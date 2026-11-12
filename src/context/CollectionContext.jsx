import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const CollectionContext = createContext(null);
// Context hooks are exported with their provider for a clear, single-file API.
// eslint-disable-next-line react-refresh/only-export-components
export const useCollection = () => useContext(CollectionContext);

export function CollectionProvider({ children }) {
  const [albums, setAlbums] = useLocalStorage("album-tracker:collection", {});

  const save = (album, status = "wishlist", patch = {}) => {
    setAlbums((previous) => {
      const existing = previous[album.collectionId];
      return {
        ...previous,
        [album.collectionId]: {
          ...existing,
          collectionId: album.collectionId,
          name: album.collectionName,
          artist: album.artistName,
          artwork: album.artworkUrl100,
          year: album.releaseDate?.slice(0, 4),
          genre: album.primaryGenreName,
          status,
          rating: existing?.rating ?? 0,
          notes: existing?.notes ?? "",
          addedAt: existing?.addedAt ?? Date.now(),
          ...patch,
        },
      };
    });
  };

  const update = (id, patch) =>
    setAlbums((previous) => ({
      ...previous,
      [id]: { ...previous[id], ...patch },
    }));

  const remove = (id) =>
    setAlbums((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });

  return (
    <CollectionContext.Provider value={{ albums, save, update, remove }}>
      {children}
    </CollectionContext.Provider>
  );
}

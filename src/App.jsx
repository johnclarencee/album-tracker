import { useState } from "react";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import AiPicks from "./pages/AiPicks.jsx";
import Collection from "./pages/Collection.jsx";
import Discover from "./pages/Discover.jsx";
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import { CollectionProvider } from "./context/CollectionContext.jsx";
import { PlayerProvider } from "./context/PlayerContext.jsx";

function Tracker() {
  const [page, setPage] = useState("discover");
  const [albumId, setAlbumId] = useState(null);
  const [returnPage, setReturnPage] = useState("discover");

  const openAlbum = (id) => {
    setReturnPage(page);
    setAlbumId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const navigate = (nextPage) => {
    setAlbumId(null);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <Navbar page={albumId ? "" : page} setPage={navigate} />
      <main>
        {albumId ? <AlbumDetail albumId={albumId} back={() => { setAlbumId(null); setPage(returnPage); }} /> : <>
          {page === "discover" && <Discover openAlbum={openAlbum} />}
          {page === "collection" && <Collection openAlbum={openAlbum} />}
          {page === "ai" && <AiPicks openAlbum={openAlbum} />}
        </>}
      </main>
      <Player />
      <footer className="site-footer"><span>ALBUM TRACKER</span><span>A personal listening log · Music data by iTunes</span></footer>
    </div>
  );
}

export default function App() {
  return <CollectionProvider><PlayerProvider><Tracker /></PlayerProvider></CollectionProvider>;
}

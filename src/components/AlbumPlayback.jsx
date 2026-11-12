import { useEffect, useState } from "react";
import TrackList from "./TrackList.jsx";
import { findDeezerAlbum } from "../services/deezer.js";

export default function AlbumPlayback({ title, artist, tracks }) {
  const albumKey = `${title}:${artist}`;
  const [lookup, setLookup] = useState(null);
  const [selectedAlbumKey, setSelectedAlbumKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    findDeezerAlbum(title, artist)
      .then((match) => { if (!cancelled) setLookup({ key: albumKey, album: match }); })
      .catch(() => { if (!cancelled) setLookup({ key: albumKey, album: null }); });
    return () => { cancelled = true; };
  }, [albumKey, title, artist]);

  const deezerAlbum = lookup?.key === albumKey ? lookup.album : null;
  const useDeezer = selectedAlbumKey === albumKey;
  const showPlayer = () => setSelectedAlbumKey(albumKey);

  if (useDeezer && deezerAlbum) {
    return (
      <div className="deezer-player-wrap">
        <div className="deezer-player-heading"><span>FULL ALBUM PLAYER</span><button className="text-button" onClick={() => setSelectedAlbumKey(null)}>Back to 30-second previews</button></div>
        <iframe className="deezer-frame" title={`Play ${title} on Deezer`} src={`https://widget.deezer.com/widget/dark/album/${deezerAlbum.id}?autoplay=false`} allow="autoplay; encrypted-media; clipboard-write" loading="lazy" />
        <p className="deezer-help">Only previews playing? Log in to Deezer in this browser, then reload.</p>
      </div>
    );
  }

  return <>
    {deezerAlbum && <div className="deezer-callout">
      <p>Want to play this album in full on Deezer? You’ll need to be logged in to Deezer.</p>
      <div className="callout-actions"><a className="btn-link" href="https://www.deezer.com/login" target="_blank" rel="noreferrer">Log in to Deezer</a><button className="primary" onClick={showPlayer}>I’m logged in, show player</button></div>
    </div>}
    <TrackList tracks={tracks} />
  </>;
}

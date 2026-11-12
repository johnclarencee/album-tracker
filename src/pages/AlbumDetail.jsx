import { useEffect, useState } from "react";
import AlbumPlayback from "../components/AlbumPlayback.jsx";
import StatusSelect from "../components/StatusSelect.jsx";
import Stars from "../components/Stars.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
import { appleMusicSearchUrl, bigArt, getAlbumTracks, spotifySearchUrl, youtubeSearchUrl } from "../services/itunes.js";

export default function AlbumDetail({ albumId, back }) {
  const { albums, save, update, remove } = useCollection();
  const [load, setLoad] = useState({ id: null, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    getAlbumTracks(albumId)
      .then((data) => { if (!cancelled) setLoad({ id: albumId, data, error: "" }); })
      .catch((requestError) => { if (!cancelled) setLoad({ id: albumId, data: null, error: requestError.message }); });
    return () => { cancelled = true; };
  }, [albumId]);

  const data = load.id === albumId ? load.data : null;
  const error = load.id === albumId ? load.error : "";
  if (error) return <section className="page"><button className="back-link" onClick={back}>← Back</button><p className="notice error">{error}</p></section>;
  if (!data?.album) return <section className="page"><button className="back-link" onClick={back}>← Back</button><p className="notice">Loading album…</p></section>;

  const { album, tracks } = data;
  const saved = albums[album.collectionId];
  const setAlbumStatus = (status) => saved ? update(album.collectionId, { status }) : save(album, status);
  const setRating = (rating) => saved ? update(album.collectionId, { rating }) : save(album, "wishlist", { rating });
  const setNotes = (notes) => saved ? update(album.collectionId, { notes }) : save(album, "wishlist", { notes });
  const links = [
    ["Spotify", spotifySearchUrl(album.collectionName, album.artistName)],
    ["YouTube", youtubeSearchUrl(album.collectionName, album.artistName)],
    ["Apple Music", appleMusicSearchUrl(album.collectionName, album.artistName)],
  ];

  return (
    <section className="page detail-page">
      <button className="back-link" onClick={back}>← Back to your albums</button>
      <div className="detail-head">
        <div className="detail-art-frame"><img src={bigArt(album.artworkUrl100, 600)} alt={`${album.collectionName} cover`} /></div>
        <div className="detail-copy">
          <div className="eyebrow">ALBUM DETAILS</div>
          <h2 className="page-title">{album.collectionName}</h2>
          <p className="detail-artist">{album.artistName}</p>
          <p className="card-meta">{album.releaseDate?.slice(0, 4)} <span>·</span> {album.primaryGenreName} <span>·</span> {album.trackCount} tracks</p>
          <div className="where"><span>Listen elsewhere</span>{links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>
          <div className="save-panel">
            <div className="save-panel-heading"><span>{saved ? "IN YOUR COLLECTION" : "YOUR LISTENING LOG"}</span>{saved && <button className="text-button danger-text" onClick={() => remove(album.collectionId)}>Remove album</button>}</div>
            <StatusSelect value={saved?.status ?? "wishlist"} onChange={setAlbumStatus} />
            <div className="rating-line"><span>YOUR RATING</span><Stars value={saved?.rating ?? 0} onChange={setRating} /></div>
            <label className="notes-label" htmlFor="album-notes">NOTES</label>
            <textarea id="album-notes" value={saved?.notes ?? ""} onChange={(event) => setNotes(event.target.value)} placeholder="Add a memory, a favorite track, or a thought…" rows="3" />
          </div>
        </div>
      </div>
      <div className="section-heading"><div><div className="eyebrow">SIDE A, SIDE B</div><h3>Tracklist</h3></div><span>{tracks.length} tracks · 30-second previews</span></div>
      <AlbumPlayback title={album.collectionName} artist={album.artistName} tracks={tracks} />
    </section>
  );
}

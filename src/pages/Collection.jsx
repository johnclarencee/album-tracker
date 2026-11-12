import { useMemo, useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import StatusSelect from "../components/StatusSelect.jsx";
import { STATUSES } from "../components/statuses.js";
import Stars from "../components/Stars.jsx";
import { useCollection } from "../context/CollectionContext.jsx";

export default function Collection({ openAlbum }) {
  const { albums, update, remove } = useCollection();
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const saved = Object.values(albums);
  const visible = useMemo(() => {
    const filtered = saved.filter((album) => status === "all" || album.status === status);
    return filtered.sort((a, b) => {
      if (sort === "title") return a.name.localeCompare(b.name);
      if (sort === "artist") return a.artist.localeCompare(b.artist);
      if (sort === "rating") return b.rating - a.rating || a.name.localeCompare(b.name);
      return (b.addedAt ?? 0) - (a.addedAt ?? 0);
    });
  }, [saved, status, sort]);

  return (
    <section className="page">
      <div className="eyebrow">YOUR PERSONAL SHELF</div>
      <div className="collection-title-row"><div><h2 className="page-title">My collection</h2><p className="page-intro">A little archive of where your ears have been.</p></div><span className="collection-count">{saved.length} {saved.length === 1 ? "ALBUM" : "ALBUMS"}</span></div>
      {saved.length === 0 ? <div className="empty-state"><span className="empty-icon">◉</span><h3>Your shelf is waiting.</h3><p>Find an album in Discover and save it here to start your listening log.</p></div> : <>
        <div className="collection-tools">
          <div className="filter-chips" role="group" aria-label="Filter collection by status">
            <button className={`chip ${status === "all" ? "on" : ""}`} onClick={() => setStatus("all")}>All ({saved.length})</button>
            {STATUSES.map((item) => <button key={item.id} className={`chip ${status === item.id ? "on" : ""}`} onClick={() => setStatus(item.id)}>{item.label} ({saved.filter((album) => album.status === item.id).length})</button>)}
          </div>
          <label className="sort-control">SORT BY <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Recently added</option><option value="title">Album title</option><option value="artist">Artist</option><option value="rating">Highest rated</option></select></label>
        </div>
        {visible.length === 0 ? <p className="notice">No albums in this status yet.</p> : <div className="collection-list">{visible.map((album) => <article className="collection-item" key={album.collectionId}>
          <AlbumCard title={album.name} artist={album.artist} art={album.artwork} meta={album.year} onOpen={() => openAlbum(album.collectionId)} />
          <div className="collection-item-details"><StatusSelect value={album.status} onChange={(value) => update(album.collectionId, { status: value })} /><div className="rating-line"><span>YOUR RATING</span><Stars value={album.rating} onChange={(rating) => update(album.collectionId, { rating })} /></div><label className="notes-label" htmlFor={`note-${album.collectionId}`}>NOTES</label><textarea id={`note-${album.collectionId}`} value={album.notes ?? ""} onChange={(event) => update(album.collectionId, { notes: event.target.value })} placeholder="Add a note…" rows="3"/><button className="text-button danger-text remove-link" onClick={() => remove(album.collectionId)}>Remove from collection</button></div>
        </article>)}</div>}
      </>}
    </section>
  );
}

import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { searchAlbums } from "../services/itunes.js";

export default function Discover({ openAlbum }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event?.preventDefault();
    if (!term.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setResults(await searchAlbums(term.trim()));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="eyebrow">THE CRATE DIGGER</div>
      <h2 className="page-title">Find your next favorite.</h2>
      <p className="page-intro">Search albums and artists, preview tracks, and keep a record of what you love.</p>
      <form className="search" onSubmit={onSubmit}>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search by album or artist" aria-label="Search albums" />
        <button type="submit" disabled={loading || !term.trim()}>{loading ? "Searching…" : "Search"}</button>
      </form>
      {error && <p className="notice error">{error}</p>}
      {results === null && !error && <p className="notice">Search for an album to see its tracks, play 30-second previews, and save it.</p>}
      {results?.length === 0 && <p className="notice">No albums found for “{term}”. Check the spelling or try the artist’s name.</p>}
      {results?.length > 0 && <div className="results-label">{results.length} ALBUMS FOUND</div>}
      <div className="grid">
        {results?.map((album) => (
          <AlbumCard key={album.collectionId} title={album.collectionName} artist={album.artistName} art={album.artworkUrl100} meta={album.releaseDate?.slice(0, 4)} onOpen={() => openAlbum(album.collectionId)} />
        ))}
      </div>
    </section>
  );
}

import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
import { searchAlbums } from "../services/itunes.js";
import { getRecommendations } from "../services/ai.js";

const MIN_ALBUMS = 3;

export default function AiPicks({ openAlbum }) {
  const { albums } = useCollection();
  const [picks, setPicks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const saved = Object.values(albums);
  const ratedCount = saved.filter((album) => album.rating > 0).length;

  const ask = async () => {
    setLoading(true);
    setError("");
    try {
      const taste = [...saved].sort((a, b) => b.rating - a.rating).slice(0, 40).map(({ name, artist, rating, status }) => ({ title: name, artist, rating, status }));
      const { albums: suggestions } = await getRecommendations(taste);
      const found = await Promise.all(suggestions.map(async (suggestion) => {
        const matches = await searchAlbums(`${suggestion.title} ${suggestion.artist}`);
        const match = matches.find((album) => album.collectionName.toLowerCase() === suggestion.title.toLowerCase() && album.artistName.toLowerCase() === suggestion.artist.toLowerCase()) ?? matches[0];
        return match ? { album: match, reason: suggestion.reason } : null;
      }));
      const seen = new Set();
      setPicks(found.filter((pick) => {
        if (!pick || albums[pick.album.collectionId] || seen.has(pick.album.collectionId)) return false;
        seen.add(pick.album.collectionId);
        return true;
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="eyebrow">A LITTLE ALGORITHMIC SERENDIPITY</div>
      <h2 className="page-title">Good things to hear next.</h2>
      <p className="page-intro">Recommendations shaped by the albums you save and rate.</p>
      {saved.length < MIN_ALBUMS ? <div className="empty-state compact"><span className="empty-icon">✳</span><h3>Give the recommendations something to go on.</h3><p>Save at least {MIN_ALBUMS} albums first. You have {saved.length}.</p></div> : <>
        <div className="ai-callout"><div><span className="eyebrow">YOUR TASTE PROFILE</span><p>Based on {saved.length} saved albums{ratedCount > 0 ? `, ${ratedCount} rated` : ""}.{ratedCount === 0 ? " Add star ratings for better matches." : ""}</p></div><button className="primary" onClick={ask} disabled={loading}>{loading ? "Finding your next listen…" : picks ? "Refresh picks" : "Get recommendations"}</button></div>
      </>}
      {error && <p className="notice error">{error}</p>}
      {picks?.length === 0 && <p className="notice">No new matching albums found. Try again for a different set.</p>}
      <div className="grid">{picks?.map(({ album, reason }) => <AlbumCard key={album.collectionId} title={album.collectionName} artist={album.artistName} art={album.artworkUrl100} meta={reason} onOpen={() => openAlbum(album.collectionId)} />)}</div>
      <p className="privacy-note">Your album titles, artists, ratings, and statuses are sent to Google Gemini to generate picks. Your notes are not sent.</p>
    </section>
  );
}

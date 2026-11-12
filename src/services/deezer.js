export async function searchDeezerAlbums(query) {
  const response = await fetch(`/api/deezer?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not search Deezer.");
  return data.albums ?? [];
}

const normalize = (value = "") => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

export async function findDeezerAlbum(title, artist) {
  const albums = await searchDeezerAlbums(`${title} ${artist}`);
  const cleanTitle = normalize(title);
  const cleanArtist = normalize(artist);
  const scored = albums.map((album) => {
    const candidateTitle = normalize(album.title);
    const candidateArtist = normalize(album.artist?.name);
    const titleMatch = candidateTitle === cleanTitle || candidateTitle.includes(cleanTitle) || cleanTitle.includes(candidateTitle);
    const artistMatch = candidateArtist === cleanArtist || candidateArtist.includes(cleanArtist) || cleanArtist.includes(candidateArtist);
    return { album, score: (titleMatch ? 1 : 0) + (artistMatch ? 1 : 0) };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score === 2 ? scored[0].album : null;
}

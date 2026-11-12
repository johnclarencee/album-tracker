const BASE = "https://itunes.apple.com";

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not reach the iTunes API. Check your connection and try again.");
  }
  return response.json();
}

export const bigArt = (url = "", size = 400) =>
  url.replace(/\d+x\d+bb/, `${size}x${size}bb`);

export async function searchAlbums(term) {
  const data = await request(
    `${BASE}/search?term=${encodeURIComponent(term)}&entity=album&limit=24`,
  );
  return data.results ?? [];
}

export async function getAlbumTracks(collectionId) {
  const data = await request(
    `${BASE}/lookup?id=${encodeURIComponent(collectionId)}&entity=song`,
  );
  const [album, ...tracks] = data.results ?? [];
  return { album, tracks: tracks.filter((track) => track.wrapperType === "track") };
}

export const spotifySearchUrl = (name, artist) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${name} ${artist}`)}`;
export const youtubeSearchUrl = (name, artist) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} ${artist} album`)}`;
export const appleMusicSearchUrl = (name, artist) =>
  `https://music.apple.com/search?term=${encodeURIComponent(`${name} ${artist}`)}`;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  const query = String(req.query?.q ?? "").trim().slice(0, 160);
  if (!query) return res.status(400).json({ error: "Add an album or artist search term." });
  try {
    const response = await fetch(`https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) return res.status(502).json({ error: `Deezer returned ${response.status}.` });
    const data = await response.json();
    return res.status(200).json({ albums: (data.data ?? []).map(({ id, title, link, cover_medium, nb_tracks, artist }) => ({ id, title, link, cover: cover_medium, tracks: nb_tracks, artist })) });
  } catch (error) {
    console.error("Deezer search error:", error);
    return res.status(502).json({ error: "Could not reach Deezer. Try again later." });
  }
}

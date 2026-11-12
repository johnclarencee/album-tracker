import process from "node:process";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY is missing. Add it to .env.local and restart the dev server." });

  const taste = (Array.isArray(req.body?.taste) ? req.body.taste : [])
    .slice(0, 40)
    .map((album) => ({
      title: String(album.title ?? "").slice(0, 120),
      artist: String(album.artist ?? "").slice(0, 120),
      rating: Math.min(5, Math.max(0, Number(album.rating) || 0)),
      status: String(album.status ?? "").slice(0, 20),
    }))
    .filter((album) => album.title && album.artist);
  if (taste.length < 3) return res.status(400).json({ error: "Save at least 3 albums first so there is a listening pattern to learn from." });

  const model = "gemini-3.5-flash-lite";
  try {
    const requestBody = JSON.stringify({
        systemInstruction: { parts: [{ text: "You are a music recommendation engine. You receive a person's saved albums with a star rating (0 means unrated) and status (wishlist, listening, listened). Infer taste from genres, eras, moods, and artists. Weight 4-5 star albums most, and steer away from styles of 1-2 star albums. Recommend exactly 6 real, released albums that are not in their list. At most 2 may be by artists already in the list. Reply only with JSON: {\"albums\":[{\"title\":\"\",\"artist\":\"\",\"reason\":\"\"}]}. Each reason is under 15 words and mentions the pattern it matches. Never include song lyrics." }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(taste) }] }],
        generationConfig: { responseMimeType: "application/json" },
      });
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    let response;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: requestBody,
      });
      if (response.status !== 503 || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 800 * 2 ** attempt));
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error("Gemini error:", response.status, detail);
      return res.status(502).json({ error: `Gemini returned ${response.status}. Check the terminal for details.` });
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text);
    return res.status(200).json({ albums: Array.isArray(parsed.albums) ? parsed.albums.slice(0, 6) : [] });
  } catch (error) {
    console.error("Gemini function error:", error);
    return res.status(500).json({ error: "Something went wrong. Check the terminal for details." });
  }
}

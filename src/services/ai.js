export async function getRecommendations(taste) {
  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taste }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not get recommendations.");
  return data;
}

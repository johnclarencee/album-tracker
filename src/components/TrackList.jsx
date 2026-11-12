import { usePlayer } from "../context/PlayerContext.jsx";

const formatTime = (milliseconds = 0) => {
  const seconds = Math.round(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export default function TrackList({ tracks = [] }) {
  const { current, isPlaying, playTrack } = usePlayer();
  return (
    <ol className="tracks">
      {tracks.map((track, index) => {
        const active = current?.trackId === track.trackId;
        return (
          <li key={track.trackId} className={`track ${active ? "active" : ""}`}>
            <span className="track-index">{String(index + 1).padStart(2, "0")}</span>
            <button className="play-btn" disabled={!track.previewUrl} onClick={() => playTrack(track, tracks)} aria-label={active && isPlaying ? `Pause ${track.trackName}` : `Play ${track.trackName}`}>
              {active && isPlaying ? "Ⅱ" : "▶"}
            </button>
            <span className="track-name">{track.trackName}</span>
            {!track.previewUrl && <span className="preview-unavailable">No preview</span>}
            <span className="track-time">{formatTime(track.trackTimeMillis)}</span>
          </li>
        );
      })}
    </ol>
  );
}

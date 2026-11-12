import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);
// Context hooks are exported with their provider for a clear, single-file API.
// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  if (audioRef.current == null) audioRef.current = new Audio();

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const current = queue[index] ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!current?.previewUrl) return;
    audio.src = current.previewUrl;
    audio.play().catch(() => setIsPlaying(false));
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      if (index < queue.length - 1) setIndex((currentIndex) => currentIndex + 1);
      else setIsPlaying(false);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, [index, queue]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = () => {
    const audio = audioRef.current;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };

  const playTrack = (track, tracks) => {
    if (current?.trackId === track.trackId) return toggle();
    const playable = tracks.filter((item) => item.previewUrl);
    setQueue(playable);
    setIndex(playable.findIndex((item) => item.trackId === track.trackId));
  };

  const next = () => index < queue.length - 1 && setIndex((value) => value + 1);
  const prev = () => index > 0 && setIndex((value) => value - 1);
  const seek = (ratio) => {
    if (audioRef.current.duration) audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  return (
    <PlayerContext.Provider
      value={{ current, isPlaying, progress, playTrack, toggle, next, prev, seek,
        hasNext: index < queue.length - 1, hasPrev: index > 0 }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { Ripple } from "primereact/ripple";
interface VideoPlayerProps {
  id: string;
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id, src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      window.dispatchEvent(new CustomEvent("pause-all-videos", { detail: id }));
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const pauseOthers = (e: Event) => {
      const event = e as CustomEvent<string>;
      if (event.detail !== id) {
        videoRef.current?.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("pause-all-videos", pauseOthers);
    return () => {
      window.removeEventListener("pause-all-videos", pauseOthers);
    };
  }, [id]);

  return (
    <div className="relative w-full border-round-2xl overflow-hidden shadow-2">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full block"
        onEnded={() => setIsPlaying(false)}
        playsInline
        muted
        loop
      />

      <div
        className="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={togglePlayPause}
        style={{ cursor: "pointer" }}
      >
        {(!isPlaying || isHover) && (
          <div
            className="p-ripple flex align-items-center justify-content-center border-circle shadow-4"
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "rgb(249,167,78)",
              opacity: 0.7,
            }}
          >
            <i
              className={`pi ${
                isPlaying ? "pi-pause" : "pi-play"
              } text-white text-2xl`}
            />
            <Ripple />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

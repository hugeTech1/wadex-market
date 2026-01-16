import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { stripHtml } from "../../utils/stripHtml";
import { fetchBlockData } from "../../utils/fetchBlockData";

const VideoSection: React.FC<{ data: any }> = ({ data }) => {
  return (
    <>
      <div className="container mt-7">
        <div className="flex align-items-center justify-content-between flex-column xl:flex-row gap-5">
          <div className="w-full xl:w-6">
            <h3 className="text-5xl w-9 font-medium m-0">
              Get the tutorials you need for installations of plugins,
              application etc.
            </h3>
          </div>
          <div className="w-full xl:w-5">
            <p className="m-0 text-xl text-black-alpha-80 font-normal">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga
              obcaecati dicta, officia quos magnam repellendus
            </p>
            <NavLink to="#" className="btn btn-primary mt-3 px-5 py-2">
              Free Tutorials
            </NavLink>
          </div>
        </div>
        <div className="mt-7">
          <VideoWithProperties elemData={data} />
        </div>
      </div>
    </>
  );
};

const VideoWithProperties = ({ elemData }: { elemData: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const VIDEO_URL =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const POSTER_URL = "/images/video-poster.png";

  useEffect(() => {
    fetchBlockData(elemData.blocks_shortcode || "properties")
      .then(setSteps)
      .catch(console.error);
  }, [elemData]);

  const togglePlay = async () => {
    const el = videoRef.current;
    if (!el) return;

    try {
      if (el.paused) {
        await el.play();
        setIsPlaying(true);
      } else {
        el.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying((v) => !v);
    }
  };

  return (
    <section className="surface-0">
      <div className="mx-auto">
        <div className="flex flex-column lg:flex-row gap-5 align-items-center">
          {/* Left timeline */}
          <div className="w-full lg:w-3">
            <div className="flex flex-column gap-2 justify-content-center">
              {steps.map((s, idx) => (
                <div key={s.generic_list_uuid} className="flex gap-3">
                  <div className="flex flex-column align-items-center">
                    <div
                      className="flex align-items-center justify-content-center border-circle shadow-1 overflow-hidden"
                      style={{ width: 56, height: 56 }}
                    >
                      <img
                        src={s.generic_list_image}
                        alt={s.generic_list_title}
                        className="block border-circle"
                        style={{ objectFit: "contain" }}
                        draggable={false}
                      />
                    </div>

                    {idx !== steps.length - 1 && (
                      <div
                        className="mt-3"
                        style={{
                          width: 1,
                          height: 44,
                          borderLeft: "1px dashed black",
                        }}
                      />
                    )}
                  </div>

                  <div className="pt-1">
                    <div className="text-xl font-semibold text-900">
                      {s.generic_list_title}
                    </div>
                    <div
                      className="mt-2 text-600 line-height-3 text-sm"
                      style={{ maxWidth: 260 }}
                    >
                      {s.generic_list_subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right video */}
          <div className="w-full lg:w-9">
            <div className="relative border-round-3xl overflow-hidden shadow-2">
              <video
                ref={videoRef}
                className="block w-full"
                style={{ height: 400, objectFit: "cover" }}
                src={elemData ? stripHtml(elemData.block_segment) : VIDEO_URL}
                poster={elemData ? elemData.blocks_bgimage : POSTER_URL}
                playsInline
                muted
                loop
                preload="metadata"
                controls={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* bottom-right control */}
              {/* PLAY / PAUSE BUTTON */}
              <button
                type="button"
                onClick={togglePlay}
                className="absolute flex align-items-center justify-content-center border-circle bg-white shadow-3 cursor-pointer"
                style={{
                  right: 18,
                  bottom: 18,
                  width: 44,
                  height: 44,
                  border: "1px solid rgba(0,0,0,0.12)",
                  backdropFilter: "blur(6px)",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <i
                  className={`pi ${isPlaying ? "pi-pause" : "pi-play"}`}
                  style={{ fontSize: "1rem", marginLeft: isPlaying ? 0 : 2 }}
                />
              </button>
            </div>

            <style>{`
              @media (max-width: 992px){
                video{ height: 360px !important; }
              }
              @media (max-width: 576px){
                video{ height: 320px !important; }
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

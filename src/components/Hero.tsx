import { useEffect, useState } from "react";
import type { IPageBlock } from "../types/page";
import ExpandCards from "./custom-components/ExpandCards";
import SearchBar from "./custom-components/SearchBar";
import { fetchBlockData } from "../utils/fetchBlockData";

const Hero = ({ heroBlock }: { heroBlock: IPageBlock | undefined }) => {
  const [sliderData, setSliderData] = useState<any>([]);

  useEffect(() => {
    if (!heroBlock?.blocks_shortcode) return;

    fetchBlockData(heroBlock.blocks_shortcode)
      .then(setSliderData)
      .catch((err) => console.error("Page fetch failed:", err));
  }, [heroBlock?.blocks_shortcode]);
  

  return (
    <>
      <div className="flex flex-column xl:flex-row container align-items-center justify-content-between gap-5">
        <div className="w-full xl:w-3 relative z-2 flex flex-column align-items-start gap-7 pt-5 xl:p-0">
          <div>
            <h1 className="max-w-full text-7xl font-medium	line-height-1 xl:max-w-10rem text-black">
              Make Life Easy
            </h1>
          </div>
          <div>
            <SearchBar placeholder={"Find what you want..."} />
          </div>
        </div>
        <div className="w-full xl:w-9">
          <ExpandCards cards={sliderData} />
        </div>
      </div>
    </>
  );
};

export default Hero;

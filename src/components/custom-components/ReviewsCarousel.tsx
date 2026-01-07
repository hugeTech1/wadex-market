import React, { useEffect, useMemo, useState } from "react";
import { Carousel } from "primereact/carousel";
import "primeicons/primeicons.css";
import { stripHtml } from "../../utils/stripHtml";
import { fetchBlockData } from "../../utils/fetchBlockData";

const ReviewsCarousel: React.FC<{ data: any }> = ({ data }) => {
  const [slides, SetSlides] = useState<any[]>([]);

  useEffect(() => {
    fetchBlockData(data.blocks_shortcode || "reviews")
      .then(SetSlides)
      .catch(console.error);
  }, [data]);

  const responsiveOptions = useMemo(
    () => [
      { breakpoint: "1400px", numVisible: 4, numScroll: 1 },
      { breakpoint: "1200px", numVisible: 3, numScroll: 1 },
      { breakpoint: "992px", numVisible: 2, numScroll: 1 },
      { breakpoint: "576px", numVisible: 1, numScroll: 1 },
    ],
    []
  );

  const itemTemplate = (t: any) => (
    <div className="p-2">
      <div className="surface-0 border-round-2xl shadow-2 p-4 h-full">
        <p className="text-700 line-height-3 m-0">{t.generic_list_description}</p>

        <div className="flex align-items-center gap-3 mt-4">
          <img
            src={t.generic_list_image}
            alt={t.generic_list_title}
            className="border-circle"
            style={{ width: 44, height: 44, objectFit: "cover" }}
            draggable={false}
          />
          <div>
            <div className="text-900 font-semibold">{t.generic_list_title}</div>
            <div className="text-orange-500 text-sm">{t.generic_list_subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="surface-0 py-6">
      <div className="mx-auto" style={{}}>
        <h2 className="text-center text-900 text-6xl font-normal mb-5">
          {stripHtml(data.block_segment)}
        </h2>

        <Carousel
          value={slides ? slides : []}
          numVisible={4}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={itemTemplate}
          autoplayInterval={3000}
          showIndicators={false}
          prevIcon={<img src="/icons/back-arrow.png" alt="left" />}
          nextIcon={<img src="/icons/move-arrow.png" alt="right" />}
          className="testimonial-carousel relative"
        />
      </div>
    </section>
  );
};

export default ReviewsCarousel;

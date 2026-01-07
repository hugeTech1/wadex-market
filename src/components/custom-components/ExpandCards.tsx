import React, { useState } from "react";

const ExpandCards: React.FC<{ cards: any[] }> = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="flex align-items-stretch justify-content-center card-container gap-4 flex-column xl:flex-row"
      onMouseLeave={() => setActiveIndex(0)}
    >
      {cards.map((card, index) => (
        <div
          key={card.generic_list_uuid}
          className={`ex-card ${
            activeIndex === index ? "active pl-8" : "px-5"
          } border-round-xl p-3 pb-5 relative overflow-hidden cursor-pointer flex flex-column justify-content-end bg-cover bg-center transition-all transition-duration-400 transition-ease`}
          style={{ backgroundImage: `url(${card.generic_list_image})` }}
          onMouseEnter={() => setActiveIndex(index)}
        >
          <div className="relative z-1">
            <h2 className="card-title w-max text-4xl text-white -rotate-180 m-0 mb-2">
              {card.generic_list_title}
            </h2>
            <p className="card-desc text-white text-base">{card.generic_list_subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandCards;

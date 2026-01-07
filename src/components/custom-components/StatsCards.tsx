import { useEffect, useState } from "react";
import { fetchBlockData } from "../../utils/fetchBlockData";

const StatsCards = ({ data }: any) => {
  return (
    <>
      <div className="container">
        <div
          id={data.blocks_elementid}
          dangerouslySetInnerHTML={{
            __html: data.block_segment,
          }}
        />
        <StatsGrid
          shortcode={data.blocks_shortcode ? data.blocks_shortcode : ""}
        />
      </div>
    </>
  );
};

const StatsGrid = ({ shortcode }: any) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchBlockData(shortcode || "stats")
      .then(setData)
      .catch(console.error);
  }, [shortcode]);
  return (
    <div className="surface-900 p-4">
      <div className="grid w-10 mx-auto mt-3 row-gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="
              col-12
              sm:col-6
              lg:col-4
            "
          >
            <div
              className="
                border-round-xl
                p-4
                h-full
                w-max
                w-17rem
              "
              style={{ backgroundColor: "#f9a74e" }}
            >
              <h2 className="text-5xl font-medium m-0 mb-2">
                {item.generic_list_subtitle}
              </h2>
              <p className="text-xl text-900 m-0 opacity-80">
                {item.generic_list_title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;

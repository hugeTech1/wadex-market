import { useEffect, useState } from "react";
import { fetchBlockData } from "../../utils/fetchBlockData";

const TeamMembers = ({ data }: any) => {
  console.log("🚀 ~ TeamMembers ~ data:", data)
  return (
    <>
      <div className="container">
        <div
          id={data.blocks_elementid}
          dangerouslySetInnerHTML={{
            __html: data.block_segment,
          }}
        />

        <TeamGrid shortcode={data?.blocks_shortcode} />
      </div>
    </>
  );
};

const TeamGrid = ({ shortcode }: any) => {
  const [teamData, setTeamData] = useState<any[]>([]);

  useEffect(() => {
    fetchBlockData(shortcode || "teams")
      .then(setTeamData)
      .catch(console.error);
  }, [shortcode]);

  return (
    <>
      {/* Grid */}
      <div className="flex row-gap-6 align-items-center justify-content-center flex-wrap mt-5">
        {teamData.map((item) => {
          const Wrapper = item.link ? "a" : "div";
          return (
            <Wrapper
              key={item.generic_list_uuid}
              href={item.generic_list_link}
              className=" sm:col-6 md:col-4 lg:col-3 block item-card no-underline text-black-alpha-90"
            >
              <div className=" surface-card hover-card">
                <img
                  src={item.generic_list_image}
                  alt={item.generic_list_title}
                  className="w-full border-round-xl"
                  style={{minHeight:"300px"}}
                />

                <h4 className="text-2xl font-normal m-0 mt-3">
                  {item.generic_list_title}
                </h4>
                <p className="text-lg text-color-secondary m-0 mt-1 font-light">
                  {item.generic_list_subtitle}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </>
  );
};

export default TeamMembers;

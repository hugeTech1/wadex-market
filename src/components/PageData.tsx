import FormBuilderContainer from "../plugins/form-builder/FormBuilderContainer";
import type { IPageBlock, IPageData } from "../types/page";
import { stripHtml } from "../utils/stripHtml";
import CarouselWrapper from "./CarouselWrapper";
import Courses from "./custom-components/Courses";
import ReviewsCarousel from "./custom-components/ReviewsCarousel";
import SearchFullWidth from "./custom-components/SearchFullWidth";
import StandardHero from "./custom-components/StandardHero";
import StatsCards from "./custom-components/StatsCards";
import TabList from "./custom-components/TabList";
import TeamMembers from "./custom-components/TeamMembers";
import VideoSection from "./custom-components/VideoSection";
import Hero from "./Hero";
import VideoPlayer from "./VideoPlayer";

const PageData = ({ pageData }: { pageData: IPageData[] }) => {
  const blocks = pageData[0]?.blocks || [];
  const contentBlocks: IPageBlock[][] = [];
  let currentGroup: IPageBlock[] = [];
  let groupSize = 1;
  const noBgSections = ["video-section", "hero-section", "single-video"];

  for (const block of blocks) {
    const isHalf = block.blocks_css_cls?.includes("half-width") ?? false;
    const isQuarter = block.blocks_css_cls?.includes("quarter-width") ?? false;

    if (isHalf) {
      groupSize = 2;
    } else if (isQuarter) {
      groupSize = 4;
    } else {
      groupSize = 1;
    }

    currentGroup.push(block);

    if (currentGroup.length === groupSize) {
      contentBlocks.push(currentGroup);
      currentGroup = [];
    }
  }

  if (currentGroup.length > 0) {
    contentBlocks.push(currentGroup);
  }
  const heroBlock = pageData[0]?.blocks?.find(
    (b) => b.blocks_elementid === "home-page-hero"
  );

  return (
    <>
      {contentBlocks.map((group, groupIdx) => (
        <div
          key={groupIdx}
          style={{
            backgroundColor:
              group[0].blocks_bgcolor === "#000000"
                ? "transparent"
                : group[0].blocks_bgcolor,
            backgroundImage: noBgSections.includes(group[0].blocks_elementid)
              ? "none"
              : group[0].blocks_bgimage
              ? `url(${group[0].blocks_bgimage})`
              : "none",

            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className={`${
            group.some((b) => b.blocks_css_cls === "std-margin")
              ? "std-margin"
              : ""
          }`}
        >
          <div
            className={`${
              group.some((b) => b.blocks_css_cls === "full-width")
                ? "full-width"
                : "container"
            }`}
          >
            <div className="grid mr-0 gap-2 md:gap-0 justify-content-center">
              {group.map((block, idx) => (
                <div
                  key={idx}
                  className={
                    block.blocks_css_cls?.includes("half-width")
                      ? "col-12 md:col-6 p-0 md:px-2 inline-block " +
                        block.blocks_css_cls
                      : block.blocks_css_cls?.includes("quarter-width")
                      ? "col-12 md:col-3 p-0 md:px-2 inline-block " +
                        block.blocks_css_cls
                      : "col-12 p-0 " + block.blocks_css_cls
                  }
                >
                  {block.blocks_type === "block_standard" &&
                    (() => {
                      switch (block.blocks_elementid) {
                        case "home-page-hero":
                          return <Hero heroBlock={heroBlock} />;
                        case "hero-section":
                          return <StandardHero data={block} />;

                        case "services-list":
                        case "sidebar-list":
                          return (
                            <div className="container mt-7">
                              <h2 className="m-0 text-center text-black font-semibold text-4xl ">
                                {stripHtml(block.block_segment)}
                              </h2>

                              <TabList
                                shortcode={block.blocks_shortcode}
                                layout={block.blocks_elementid}
                              />
                            </div>
                          );
                        case "video-section":
                          return <VideoSection data={block} />;
                        case "single-video":
                          return (
                            <>
                              <VideoPlayer
                                id={block.blocks_elementid}
                                src={stripHtml(block.block_segment)}
                                poster={block.blocks_bgimage}
                              />
                            </>
                          );

                        case "search-form":
                          return <SearchFullWidth data={block} />;
                        case "reviews":
                          return <ReviewsCarousel data={block} />;
                        case "stats":
                          return <StatsCards data={block} />;
                        case "teams":
                          return <TeamMembers data={block} />;
                        case "courses":
                          return <Courses data={block} />;

                        default:
                          return (
                            <div
                              id={block.blocks_elementid}
                              dangerouslySetInnerHTML={{
                                __html: block.block_segment,
                              }}
                            />
                          );
                      }
                    })()}

                  {block.blocks_type === "form" && block.blocks_shortcode && (
                    <FormBuilderContainer formId={block.blocks_shortcode} data={block} />
                  )}
                  {block.blocks_type === "carousal" && (
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: block.block_segment,
                        }}
                      />
                      <CarouselWrapper query_id={block.blocks_shortcode} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PageData;

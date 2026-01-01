import FormBuilderContainer from "../plugins/form-builder/FormBuilderContainer";
import type { IPageBlock, IPageData } from "../types/page";
import CarouselWrapper from "./CarouselWrapper";
import Hero from "./Hero";

const PageData = ({ pageData }: { pageData: IPageData[] }) => {
    const blocks = pageData[0]?.blocks || [];
    const contentBlocks: IPageBlock[][] = [];
    let currentGroup: IPageBlock[] = [];
    let groupSize = 1;

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
                        backgroundColor: group[0].blocks_bgcolor === "#000000"
                            ? "transparent"
                            : group[0].blocks_bgcolor,
                        backgroundImage: group[0].blocks_bgimage
                            ? `url(${group[0].blocks_bgimage})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <div
                        className={`${group.some(b => b.blocks_css_cls === "full-width") ? "full-width"
                            : "container"}`}
                    >
                        <div className="grid mr-0 gap-2 md:gap-0 justify-content-center">

                            {group.map((block, idx) => (
                                <div
                                    key={idx}
                                    className={
                                        block.blocks_css_cls?.includes("half-width")
                                            ? "col-12 md:col-6 p-0 md:px-2 inline-block " + block.blocks_css_cls
                                            : block.blocks_css_cls?.includes("quarter-width")
                                                ? "col-12 md:col-3 p-0 md:px-2 inline-block " + block.blocks_css_cls
                                                : "col-12 p-0 " + block.blocks_css_cls
                                    }
                                >
                                    {block.blocks_type === "block_standard" &&
                                        <>
                                            {
                                                (block.blocks_elementid === "home-page-hero") ?
                                                    <Hero heroBlock={heroBlock} />
                                                    :
                                                    <div id={block.blocks_elementid} dangerouslySetInnerHTML={{ __html: block.block_segment }} />
                                            }
                                        </>
                                    }
                                    {block.blocks_type === "form" && block.blocks_shortcode && (
                                        <FormBuilderContainer formId={block.blocks_shortcode} />
                                    )}
                                    {block.blocks_type === "carousal" && (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: block.block_segment }} />
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
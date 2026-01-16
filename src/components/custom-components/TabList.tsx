import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { fetchBlockData } from "../../utils/fetchBlockData";

type LayoutType = "services-list" | "sidebar-list";

const TabList: React.FC<{ shortcode: string; layout?: LayoutType }> = ({
  shortcode,
  layout = "services-list",
}) => {
  const [tabListItems, setTabListItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchBlockData(shortcode || "services-list")
      .then(setTabListItems)
      .catch(console.error);
  }, [shortcode]);

  const mappedItems = tabListItems.map((item) => ({
    id: item.generic_list_uuid,
    title: item.generic_list_title,
    image: item.generic_list_image,
    link: item.generic_list_link,
    category: item.generic_list_subtitle,
  }));

  const categories = [
    "All",
    ...Array.from(new Set(mappedItems.map((i) => i.category))),
  ];

  const filteredItems =
    activeTab === "All"
      ? mappedItems
      : mappedItems.filter((i) => i.category === activeTab);

  return (
    <>
      {/* ================= TAB LAYOUT (EXISTING) ================= */}
      {layout === "services-list" && (
        <div className="tablist-wrapper mt-5">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-4 flex-wrap justify-content-center">
            
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={classNames(
                  "tab-btn p-2 text-base cursor-pointer border-none bg-transparent tab-btn relative flex flex-column align-items-start justify-content-center gap-1",
                  { active: activeTab === cat }
                )}
              >
                
                {cat}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div className="flex row-gap-6 align-items-center justify-content-center flex-wrap ">
            
            {filteredItems.map((item) => {
              const Wrapper = item.link ? "a" : "div";
              return (
                <Wrapper
                  key={item.id}
                  href={item.link}
                  className=" sm:col-6 md:col-4 lg:col-3 block item-card no-underline text-black-alpha-90"
                >
                  
                  <div className=" surface-card hover-card">
                    
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full border-round-xl"
                    />
                    <h4 className="text-2xl font-normal m-0 mt-3">
                      {item.title}
                    </h4>
                    <p className="text-lg text-color-secondary m-0 mt-1 font-light">
                      
                      {item.category}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SIDEBAR LAYOUT (NEW) ================= */}
      {layout === "sidebar-list" && (
        <div className="mt-5">
          <div className="flex flex-column md:flex-row gap-4">
            {/* Sidebar */}
            <aside className=" md:w-18rem w-full sidebar overflow-hidden flex flex-column">
              <h4 className="text-2xl mb-3 sidebar-title px-3 py-3 text-capitalize font-normal">Categories</h4>

              <div className="flex flex-column gap-2 overflow-x-auto px-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={classNames(
                      "border-none cursor-pointer p-2 border-round-md text-left white-space-nowrap sidebar-btn",
                      {
                        "bg-primary active": activeTab === cat,
                        "bg-transparent text-color ": activeTab !== cat,
                      }
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 sidebar-content">
              <h4 className="text-xl mb-3">Recommended for you</h4>

              <div className="grid">
                {filteredItems.map((item) => {
                  const Wrapper = item.link ? "a" : "div";
                  return (
                    <Wrapper
                      key={item.id}
                      href={item.link}
                      className="col-12 sm:col-6 lg:col-3 no-underline text-color"
                    >
                      <div className="sidebar-card border-round-xl h-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full border-round-lg"
                        />

                        <h4 className="mt-2 mb-1 text-base font-normal">
                          {item.title}
                        </h4>
                        <p className="text-sm text-color-secondary m-0">
                          {item.category}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabList;

import React, { useEffect, useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import VideoPlayer from "../VideoPlayer";
import { getQueryData } from "../../services/page.service";
import { Button } from "primereact/button";

const Courses = ({ data }: any) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  // ================= Fetch courses =================
  useEffect(() => {
    getQueryData(data?.blocks_shortcode || "", {})
      .then((res) => {
        const apiData = res.data || [];
        setCourses(apiData);

        if (apiData.length > 0) {
          setActiveCategory(apiData[0].courses_category);
          setActiveIndex(0);
        }
      })
      .catch(console.error);
  }, [data]);

  // ================= Unique categories =================
  const categories = useMemo(() => {
    return Array.from(
      new Set(courses.map((item) => item.courses_category))
    );
  }, [courses]);

  return (
    <div className="flex flex-column lg:flex-row mt-8 gap-6 lg:gap-0">
      {/* ================= Sidebar ================= */}
      <div
        className="p-3 courses-sidebar"
        style={{
          width: "300px",
          borderRadius: "12px",
          backgroundColor: "#e8e5e5",
        }}
      >
        {/* ================= Search ================= */}
        <div className="mb-5">
          <div className="search-wrapper flex align-items-center shadow-1">
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find what you want"
              className="search-input border-none outline-none bg-white h-4rem py-2 px-2"
            />

            <Button
              label="Go"
              className="search-btn h-4rem border-none text-xl font-medium"
            />
          </div>
        </div>

        {/* ================= Categories & Lectures ================= */}
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => {
            const index = e.index as number;
            setActiveIndex(index);
            setActiveCategory(categories[index]);
          }}
        >
          {categories.map((category) => (
            <AccordionTab
              key={category}
              header={category.replace(/_/g, " ").toUpperCase()}
            >
              <ul className="list-none p-0 m-0">
                {courses
                  .filter(
                    (lec) =>
                      lec.courses_category === category &&
                      lec.courses_title
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .sort(
                    (a, b) =>
                      a.courses_lecture_number -
                      b.courses_lecture_number
                  )
                  .map((lec) => (
                    <li
                      key={lec.courses_uuid}
                      className="py-2 cursor-pointer text-md"
                    >
                      {lec.courses_lecture_number}. {lec.courses_title}
                    </li>
                  ))}
              </ul>
            </AccordionTab>
          ))}
        </Accordion>
      </div>

      {/* ================= Content ================= */}
      <div className="flex-1 px-4 courses-block">
        {activeCategory && (
          <>
            <h2 className="m-0 mb-5 text-center text-4xl">
              {activeCategory.replace(/_/g, " ").toUpperCase()}
            </h2>

            <div className="grid">
              {courses
                .filter(
                  (lecture) =>
                    lecture.courses_category === activeCategory
                )
                .map((lecture) => (
                  <div
                    key={lecture.courses_uuid}
                    className="col-12 md:col-6"
                  >
                    <VideoPlayer
                      id={lecture.courses_uuid}
                      src={lecture.courses_link}
                      poster={lecture.courses_thumbnail}
                    />
                    <p className="mt-2 text-lg font-medium">
                      {lecture.courses_lecture_number}.{" "}
                      {lecture.courses_title}
                    </p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;

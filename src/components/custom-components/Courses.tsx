import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import VideoPlayer from "../VideoPlayer";

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  poster: string;
}

interface CourseCategory {
  id: string;
  title: string;
  lectures: Lecture[];
}
const courseData: CourseCategory[] = [
  {
    id: "start",
    title: "Start",
    lectures: [
      {
        id: "lec-1",
        title: "1 Lecture Wadex platform",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        poster: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
      },
      {
        id: "lec-2",
        title: "2 Lecture Wadex platform",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        poster: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
      }
    ]
  },
  {
    id: "overview",
    title: "Overview",
    lectures: [
      {
        id: "lec-3",
        title: "1 Lecture Introduction",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        poster: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
      }
    ]
  }
];

const Courses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>(
    courseData[0]
  );
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className="p-3 surface-200"
        style={{ width: "280px", borderRadius: "12px" }}
      >
        {/* Search */}
        <div className="mb-3">
          <span className="p-input-icon-right w-full">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find what you want"
              className="w-full"
            />
          </span>
        </div>

        {/* Categories */}
        <Accordion>
          {courseData.map((category) => (
            <AccordionTab
              key={category.id}
              header={category.title}
              onClick={() => setActiveCategory(category)}
            >
              <ul className="list-none p-0 m-0">
                {category.lectures.map((lec, index) => (
                  <li
                    key={lec.id}
                    className="py-2 cursor-pointer text-sm"
                  >
                    {index + 1}. {lec.title}
                  </li>
                ))}
              </ul>
            </AccordionTab>
          ))}
        </Accordion>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h2 className="mb-4">{activeCategory.title}</h2>

        <div className="grid">
          {activeCategory.lectures.map((lecture) => (
            <div key={lecture.id} className="col-12 md:col-6">
              <VideoPlayer
                id={lecture.id}
                src={lecture.videoUrl}
                poster={lecture.poster}
              />
              <p className="mt-2 text-sm">{lecture.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;

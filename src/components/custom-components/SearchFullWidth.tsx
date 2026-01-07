import { stripHtml } from "../../utils/stripHtml";
import SearchBar from "./SearchBar";

const SearchFullWidth = ({ data }: any) => {
  return (
    <>
      <div className="container flex flex-column xl:flex-row align-items-center justify-content-between gap-3">
        <div className="w-full xl:w-3">
          <h3 className="text-4xl font-medium">
            {stripHtml(data?.block_segment)}{" "}
          </h3>
        </div>
        <div className="w-full xl:w-9">
          <SearchBar placeholder="Find what you want" />
        </div>
      </div>
    </>
  );
};

export default SearchFullWidth;

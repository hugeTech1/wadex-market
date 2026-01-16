import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder? : string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [value, setValue] = React.useState("");

  const handleSubmit = () => {
    if (onSearch) onSearch(value);
  };

  return (
    <div className="search-wrapper flex align-items-center shadow-1">
      <InputText
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="search-input border-none outline-none bg-white h-5rem py-3 px-4 "
      />

      <Button
        label="Go"
        className="search-btn h-5rem border-none text-2xl font-medium"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default SearchBar;

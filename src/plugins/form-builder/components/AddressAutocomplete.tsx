import { useState, useRef } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { getPlaceSuggestions, type Suggestion } from "../services/places.service";


interface AddressFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AddressField: React.FC<AddressFieldProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceRef = useRef<number | null>(null);

  const handleSearch = (e: any) => {
    const query = e.query.trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const results = await getPlaceSuggestions(e.query);
      setSuggestions(results);
    }, 300);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={handleSearch}
      field="label"
      onChange={(e) =>
        onChange(typeof e.value === "string" ? e.value : e.value?.label ?? "")
      }
      placeholder={placeholder || "Enter address"}
      className="w-full"
      inputClassName="w-full"
      panelClassName="max-w-2rem"
    />
  );
};

export default AddressField;
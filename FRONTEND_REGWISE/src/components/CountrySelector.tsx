import { useApp } from "../context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Globe } from "lucide-react";

interface CountrySelectorProps {
  variant?: "default" | "compact";
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  variant = "default",
  className = "",
}) => {
  const { selectedCountry, setSelectedCountry, countries } = useApp();

  const handleCountryChange = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    setSelectedCountry(country || null);
  };

  if (variant === "compact") {
    return (
      <Select
        value={selectedCountry?.id || ""}
        onValueChange={handleCountryChange}
      >
        <SelectTrigger className={`w-[180px] ${className}`}>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <SelectValue placeholder="Select country" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.code} - {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center space-x-2 text-gray-700">
        <Globe className="w-5 h-5" />
        <span>Select Country</span>
      </label>
      <Select
        value={selectedCountry?.id || ""}
        onValueChange={handleCountryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a country to explore" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              <div className="flex items-center justify-between w-full">
                <span>{country.name}</span>
                <span className="text-gray-500 ml-4">({country.code})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCountry && (
        <p className="text-gray-600">Region: {selectedCountry.region}</p>
      )}
    </div>
  );
};

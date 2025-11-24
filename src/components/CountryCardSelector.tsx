import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../utils/constants';
import { Card, CardContent } from './ui/card';
import { Check } from 'lucide-react';

export const CountryCardSelector = () => {
  const { selectedCountry, setSelectedCountry } = useApp();

  const getCountryFlag = (code: string) => {
    // Using flag emoji based on country code
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {COUNTRIES.map((country) => {
        const isSelected = selectedCountry?.id === country.id;
        return (
          <Card
            key={country.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              isSelected
                ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                : 'hover:ring-1 hover:ring-primary/50'
            }`}
            onClick={() => setSelectedCountry(country)}
          >
            <CardContent className="p-4 text-center relative">
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="text-4xl mb-2">{getCountryFlag(country.code)}</div>
              <p className="font-medium text-sm text-foreground">{country.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{country.region}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

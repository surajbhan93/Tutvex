// CITY REGISTRY (cities.ts)

// ✅ CORRECT
import { CITIES } from "./locations/index";

export const CITY_MAP = CITIES.reduce((acc, city) => {
  acc[city.slug] = city;
  return acc;
}, {} as Record<string, any>);

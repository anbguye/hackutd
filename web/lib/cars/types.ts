export type CarCard = {
  trim_id: number;
  model_year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  description: string | null;
  msrp: number | null;
  invoice: number | null;
  body_type: string | null;
  body_seats: number | null;
  drive_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  horsepower_hp: number | null;
  torque_ft_lbs: number | null;
  combined_mpg: number | null;
  city_mpg: number | null;
  highway_mpg: number | null;
  image_url: string | null;
};

export type SearchToyotaTrimsInput = {
  q?: string;
  model?: string;
  modelYear?: number;
  trim?: string;
  bodyType?: string;
  seatsMin?: number;
  driveType?: string;
  transmission?: string;
  engineType?: string;
  cylinders?: number;
  hpMin?: number;
  torqueMin?: number;
  mpgCombinedMin?: number;
  mpgCityMin?: number;
  mpgHighwayMin?: number;
  budgetMin?: number;
  budgetMax?: number;
  sortBy?: "msrp" | "mpg" | "horsepower" | "model";
  sortDir?: "asc" | "desc";
  limit?: number;
};

export type SearchToyotaTrimsResult = {
  items: CarCard[];
  count: number;
};

export type DisplayCarRecommendationsInput = {
  items: CarCard[];
};

export type DisplayCarRecommendationsResult = {
  items: CarCard[];
  count: number;
};


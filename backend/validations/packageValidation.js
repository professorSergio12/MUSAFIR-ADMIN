import zod from "zod";

export const packageSchema = zod.object({
  name: zod.string().min(1, "Package name is required"),
  description: zod.string().optional(),
  basePrice: zod.number().min(0, "Base price must be a positive number"),
  durationDays: zod.number().min(1, "Duration must be at least 1 day"),
  isRecommended: zod.boolean().optional(),
  bestSeason: zod.enum(["winter", "summer", "monsoon", "all"]).optional(),
  images: zod.string().url().optional(),
  country: zod.string().min(1, "Country is required"),
  itinerary: zod.array(zod.string().length(24)).optional(),
  availableHotels: zod.array(zod.string().length(24)).optional(),
  availableFoodOptions: zod.array(zod.string().length(24)).optional(),
});

import zod from "zod";

export const itinerarySchema = zod.object({
  name: zod.string().min(1, "Location name is required"),
  country: zod.string().min(1, "Country is required"),
  city: zod.string().min(1, "City is required").optional(),
  details: zod.string().min(1, "Details are required"),
  locationImage: zod.string().url().optional(),
  day: zod.number().min(1, "Day is required"),
});

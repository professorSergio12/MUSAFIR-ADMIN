import zod from "zod";

const roomTypeSchema = zod.object({
  name: zod.enum(["Standard Room", "Suite", "Deluxe Room"]),
  surcharge: zod.number().default(0),
});

export const HotelSchema = zod.object({
  name: zod.string().min(4, "A hotel must have a name."),
  country: zod.string().min(4, "A hotel must have a country."),
  pricePerNight: zod.number().min(1, "A hotel must have a price per night."),
  images: zod
    .array(zod.string().url())
    .min(1, "A hotel must have at least one image."),
  tier: zod.string().min(4, "A hotel must have a tier."),
  roomTypes: zod.array(roomTypeSchema),
  description: zod.string().optional(),
});

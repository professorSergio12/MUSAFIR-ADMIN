import zod from "zod";

const foodTypeSchema = zod.object({
  name: zod.enum(["Lunch", "Breakfast", "Dinner"]),
  surcharge: zod.number().default(0),
});

export const foodSchema = zod.object({
  name: zod.string().min(4, "A food must have a name."),
  surchargePerDay: zod
    .number()
    .min(1, "A food must have a daily surcharge amount."),
  foodOptions: zod.array(foodTypeSchema),
  description: zod.string().optional(),
  image: zod.string().url().optional(),
});

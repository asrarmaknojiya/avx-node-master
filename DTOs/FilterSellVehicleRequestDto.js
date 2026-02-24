import Joi from "joi";

export const FilterSellVehicleRequestDto = Joi.object({
  userId: Joi.number().integer().required(),
  makerId: Joi.number().integer().allow(null).optional(),
  modelId: Joi.number().integer().allow(null).optional(),
  variantId: Joi.number().integer().allow(null).optional(),
  mfgYear: Joi.number().integer().allow(null).optional(),
  fuelType: Joi.string().allow(null, "").optional(),
  transmissionType: Joi.string().allow(null, "").optional(),
  minPrice: Joi.number().integer().allow(null).optional(),
  maxPrice: Joi.number().integer().allow(null).optional(),
  vehicleType: Joi.string()
    .trim()
    .uppercase()
    .valid("TWO_WHEELER", "FOUR_WHEELER")
    .allow(null, ""),

  // pagination + sorting
  pageNumber: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().trim().default("createdAt"),
  sortDirection: Joi.string()
    .trim()
    .lowercase()
    .valid("asc", "desc")
    .default("desc"),
}).custom((value, helpers) => {
  const updatedValue = Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, val === "" ? null : val])
  );
  return updatedValue;
});

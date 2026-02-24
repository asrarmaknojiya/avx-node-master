import Joi from "joi";

export const HomePageVehiclesRequestDto = Joi.object({
  userId: Joi.number().integer().required(),

  pageNumber: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(10),

  sortBy: Joi.string().trim().default("createdAt"),
  sortDirection: Joi.string().trim().lowercase().valid("asc", "desc").default("desc"),
})
  .custom((value) => {
    // "" -> null, for safety
    const normalized = Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v === "" ? null : v])
    );
    return normalized;
  })
  .prefs({ convert: true, abortEarly: false, stripUnknown: true });

const Joi = require("joi");
const categories = [
  "Trending",
  "Iconic cities",
  "Amazing Pools",
  "Beach",
  "Mountains",
  "Forts",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats",
  "Rooms",
];

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().allow("", null),
    }).allow(null),
    category: Joi.string()
      .valid(...categories)
      .required(),
  }).required(),

  deleteImageFilenames: Joi.array().items(Joi.string()).optional(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

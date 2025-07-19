const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [
    // This will be an array of image objects
    {
      url: String,
      filename: String,
    },
  ],
  mainImage: {
    // This will store the URL of the main image for display on index page
    type: String,
    default: function () {
      // Default to the URL of the first image in the 'images' array if available
      return this.images && this.images.length > 0 ? this.images[0].url : "";
    },
    // Alternatively, you could leave this null and set it explicitly in the controller.
    // Making it a simple string for now, we'll derive it.
  },

  image: {
    // This field needs to be in your Mongoose schema *during* migration
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: String,
    enum: [
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
    ],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

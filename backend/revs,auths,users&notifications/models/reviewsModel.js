const mongoose = require("mongoose");

const forbiddenWords = [
  "nayek",
  "nik",
  "nyk",
  "mnayka",
  "tnayek",
  "9ahba",
  "9a7ba",
  "9o7b",
  "zeb",
  "zab",
  "krarez",
  "zebi",
  "sorm",
  "miboun",
  "tahan",
  "din",
  "zok",
  "asba",
  "nam",
  "term",
  "zabour",
];

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please enter a review"],
      validate: {
        validator: function (val) {
          const cleanVal = val.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          return !forbiddenWords.some((word) => cleanVal.includes(word));
        },
        message: "Your review contains forbidden words!",
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pour éviter surcharge avec populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  }).lean(); // améliore la performance
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

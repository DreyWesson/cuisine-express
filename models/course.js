const mongoose = require("mongoose"),
  courseSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      items: [],
      zipCode: {
        // Add properties to the course schema.
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999,
      },
      subscribers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
      ],
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model("Course", courseSchema);

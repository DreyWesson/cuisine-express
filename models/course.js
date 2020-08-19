const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  courseSchema = new Schema(
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
      maxStudents: {
        type: Number,
        default: 0,
        min: [0, "Course cannot have a negative number of students"],
      },
      cost: {
        type: Number,
        default: 0,
        min: [0, "Course cannot have a negative cost"],
      },
    },
    {
      timestamps: true,
    }
  );
courseSchema.pre("save", function (next) {
  let course = this;
  // Method 1: Resolve circular-dependency issues by
  // using the mongoose.model to require ur model
  const Subscriber = mongoose.model("Subscriber");
  if (course.subscribedAccount === undefined) {
    Subscriber.findOne({ email: course.email })
      .then((subscriber) => {
        course.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});
module.exports = mongoose.model("Course", courseSchema);

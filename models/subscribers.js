const mongoose = require("mongoose"),
  { Schema } = mongoose,
  subscriberSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      zipCode: {
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999,
      },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    },
    {
      timestamps: true,
    }
  );
subscriberSchema.pre("save", function (next) {
  let subscriber = this;
  // Method 1: Resolve circular-dependency issues by
  // using the mongoose.model to require ur model
  const User = mongoose.model("User");
  if (subscriber.subscribedAccount === undefined) {
    User.findOne({ email: subscriber.email })
      .then((user) => {
        subscriber.subscribedAccount = user;
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
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model("Subscriber").find({ zipCode: this.zipCode }).exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
// Method 2: Require here at the bottom due to circular dependencies issues
// between User&Subscriber model
// const User = require("./user");

const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  { Schema } = mongoose,
  userSchema = new Schema(
    {
      name: {
        first: {
          type: String,
          trim: true,
        },
        last: {
          type: String,
          trim: true,
        },
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      zipCode: { type: Number, min: [1000, "Zip code too short"], max: 99999 },
      password: {
        type: String,
        required: true,
      },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    },
    {
      timestamps: true,
    }
  );

userSchema.pre("save", function (next) {
  let user = this;
  // Method 1: Resolve circular-dependency issues by
  // using the mongoose.model to require ur model
  const Subscriber = mongoose.model("Subscriber");
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
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
userSchema.pre("save", function (next) {
  let user = this;
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((error) => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});
userSchema.methods.passwordComparison = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});
userSchema.virtual("nickname").get(function () {
  return `${this.name.first}${this.zipCode}`;
});
module.exports = mongoose.model("User", userSchema);
// Method 2: Require here at the bottom due to circular dependencies issues
// between User&Subscriber model
// const Subscriber = require("./subscribers");

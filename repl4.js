const mongoose = require("mongoose"),
  Subscriber = require("./models/subscribers"),
  Course = require("./models/course");
User = require("./models/user");
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// var testUser;
// function createUser(first, last, email, password) {
//   User.create({
//     name: {
//       first,
//       last,
//     },
//     email,
//     password,
//   })
//     .then((user) => {
//       console.log("Created new user: ", user);
//       testUser = user;
//     })
//     .catch((error) => console.log(error.message));
// }
// createUser("Nelso", "Mandel", "nelso@mandel.com", "mlkjfk");

// User.findOne({ email: "jon@jonwexler.com" })
//   .then((u) => {
//     console.log(u);
//     return (testUser = u);
//   })
//   .catch((e) => console.log(e.message));

// var targetSubscriber;
// Subscriber.findOne({
//   email: testUser.email,
// }).then((subscriber) => (targetSubscriber = subscriber));
// console.log(targetSubscriber);

var testUser;
User.create({
  name: {
    first: "Bens",
    last: "Dexl ",
  },
  zipCode: "12345",
  friend: "enemy",
  email: "Bens@jondexl.com",
  password: "pass123",
})
  .then((user) => {
    testUser = user;
    return Subscriber.findOne({
      email: user.email,
    });
  })
  .then((subscriber) => {
    testUser.subscribedAccount = subscriber;
    testUser.save().then((user) => console.log(" user updated"));
  })
  .catch((error) => console.log(error.message));

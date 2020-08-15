const mongoose = require("mongoose"),
  Subscriber = require("./models/subscribers");
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

Subscriber.create({
  name: "john",
  email: "jon@jonwexler.com",
  zipCode: "89087",
})
  .then((subscriber) => console.log(subscriber))
  .catch((error) => console.log(error.message));

var subscriber;
Subscriber.findOne({
  name: "drey",
}).then((result) => {
  subscriber = result;
  console.log(subscriber.getInfo());
});

const mongoose = require("mongoose"),
  url = "mongodb://localhost/recipe_db",
  subscribersController = require("./controllers/subscribersController");
mongoose.Promise = global.Promise;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const client = mongoose.connect;

var db = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// var subscriber1 = new Subscriber({
//   name: "Jon Wexler",
//   email: "jon@jonwexler.com",
// });

// subscriber1.save((error, savedDocument) => {
//   if (error) console.log(error);
//   console.log(savedDocument);
// });
// Subscriber.create(
//   {
//     name: "Jon Wexler",
//     email: "jon@jonwexler.com",
//   },
//   function (error, savedDocument) {
//     if (error) console.log(error);
//     console.log(savedDocument);
//   }
// );
// const myQuery = Subscriber.findOne({ name: "Jon Wexler" }).where(
//   "email",
//   /wexler/
// );
// myQuery.exec((error, data) => {
//   if (data) console.log(data.name);
// });

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  partials = require("express-partials");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(partials());
app.use(express.static("public"));

app.get("view engine");
app.get("/", homeController.showHome);
app.get("/courses", homeController.showCourses);
// app.get("/contact", homeController.showSignUp);
// app.get("/contact", homeController.postedSignUpForm);
app.get("/contact", subscribersController.getSubscriptionPage);
app.get(
  "/subscribers",
  subscribersController.getAllSubscribers,
  (req, res, next) => {
    console.log(req.data);
    res.render("subscribers", { subscribers: req.data });
  }
);

app.post("/subscribe", subscribersController.saveSubscriber);

// Errorhandlers
// Must go beneath pre-existing routes else it will override them
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

let port = app.get("port");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

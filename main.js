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

const express = require("express"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  usersController = require("./controllers/usersController"),
  partials = require("express-partials");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use("/", router);
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(partials());
router.use(express.static("public"));

router.get("view engine");
router.get("/", homeController.showHome);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
router.get("/subscribers/new", subscribersController.new);

router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);

// Errorhandlers
// Must go beneath pre-existing routes else it will override them
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

let port = app.get("port");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

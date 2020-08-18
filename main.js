const mongoose = require("mongoose"),
  url = "mongodb://localhost/recipe_db",
  subscribersController = require("./controllers/subscribersController");
mongoose.Promise = global.Promise;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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
  partials = require("express-partials"),
  methodOverride = require("method-override");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use("/", router);
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(partials());
router.use(express.static("public"));
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));

router.get("view engine");
router.get("/", homeController.showHome);

// Users
// Get all users
router.get("/users", usersController.index, usersController.indexView);
// Get new user's form
router.get("/users/new", usersController.new);
// Get user with id
router.get("/users/:id", usersController.show, usersController.showView);
//  Edit user details
// router.get("/users/:id/edit", usersController.edit, usersController.editView);
router.get("/users/:id/edit", usersController.edit);

// Submit: create new user form
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
// Submit: update user edited profile
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

// Subscribers
// Get all subscribers
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
// Get new subscriber's form
router.get("/subscribers/new", subscribersController.new);
// Get subscriber with id
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
//  Edit user details
router.get("/subscribers/:id/edit", subscribersController.edit);
// Submit: create new subscriber form
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
// Submit: update user edited profile
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

// ErrorHandlers
// Must go beneath pre-existing routes else it will override them
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

let port = app.get("port");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

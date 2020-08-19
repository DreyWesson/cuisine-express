const mongoose = require("mongoose"),
  url = "mongodb://localhost/recipe_db",
  express = require("express"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  usersController = require("./controllers/usersController"),
  subscribersController = require("./controllers/subscribersController"),
  courseController = require("./controllers/courseController"),
  partials = require("express-partials"),
  methodOverride = require("method-override"),
  connectFlash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session");
require("dotenv").config();

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
router.use(cookieParser("secret_passcode"));
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(connectFlash());
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
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

// Course
// Get all Course
router.get("/courses", courseController.index, courseController.indexView);
// Get new Course's form
router.get("/courses/new", courseController.new);
// Get Course with id
router.get("/courses/:id", courseController.show, courseController.showView);
//  Edit user details
router.get("/courses/:id/edit", courseController.edit);
// Submit: create new Course form
router.post(
  "/courses/create",
  courseController.create,
  courseController.redirectView
);
// Submit: update Course edited profile
router.put(
  "/courses/:id/update",
  courseController.update,
  courseController.redirectView
);
router.delete(
  "/courses/:id/delete",
  courseController.delete,
  courseController.redirectView
);

// ErrorHandlers
// Must go beneath pre-existing routes else it will override them
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

let port = app.get("port");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

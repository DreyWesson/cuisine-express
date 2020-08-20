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
  expressSession = require("express-session"),
  expressValidator = require("express-validator");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
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
router.use(expressValidator());
router.use(partials());
router.use(express.static("public"));
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));

router.use(cookieParser(process.env.secret));
router.use(
  expressSession({
    secret: process.env.secret,
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

router.get("view engine");
// HOME
router.get("/", homeController.showHome);
// USERS
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.get("/users/login", usersController.login);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
// router.get("/users/:id/edit", usersController.edit, usersController.editView);
router.get("/users/:id/edit", usersController.edit);
router.post(
  "/users/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
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
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
router.get("/subscribers/new", subscribersController.new);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
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
router.get("/courses", courseController.index, courseController.indexView);
router.get("/courses/new", courseController.new);
router.get("/courses/:id", courseController.show, courseController.showView);
router.get("/courses/:id/edit", courseController.edit);
router.post(
  "/courses/create",
  courseController.create,
  courseController.redirectView
);
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

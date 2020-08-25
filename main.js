const mongoose = require("mongoose"),
  url = "mongodb://localhost/recipe_db",
  express = require("express"),
  app = express(),
  partials = require("express-partials"),
  methodOverride = require("method-override"),
  connectFlash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  passport = require("passport");
require("dotenv").config();

const router = require("./routes/index");

const User = mongoose.model("User");
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
// app.set("token", process.env.TOKEN || "recipeT0k3n");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());
app.use(partials());
app.use(express.static("public"));
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(cookieParser(process.env.secret));
app.use(
  expressSession({
    secret: process.env.secret,
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  // Set up the loggedIn variable to reflect passport login status.
  res.locals.loggedIn = req.isAuthenticated();
  // Set up the currentUser to reflect a logged-in user.
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.get("view engine");
app.use("/", router);

let port = app.get("port");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

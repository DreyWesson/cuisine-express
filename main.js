const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  partials = require("express-partials"),
  methodOverride = require("method-override"),
  connectFlash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
  morgan = require("morgan");
require("dotenv").config();
const router = require("./routes/index");

const User = mongoose.model("User");

let testDB = "recipe_test_db",
  mainDB = "recipe_db",
  mongooseObjects = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

mongoose.Promise = global.Promise;
function mongoDB(selectDB, inBuiltObj, port) {
  let selectEnv =
    process.env.MONGODB_URI || `mongodb://localhost:27017/${selectDB}`;

  mongoose.connect(selectEnv, inBuiltObj);

  // const client = mongoose.connect;
  mongoose
    .createConnection(selectEnv, inBuiltObj)
    .once("open", () =>
      console.log(
        `Successfully connected to MongoDB using Mongoose!, in ${selectDB} database`
      )
    );
  app.set("port", process.env.PORT || port);
}

if (process.env.NODE_ENV === "test") mongoDB(testDB, mongooseObjects, 3001);
else mongoDB(mainDB, mongooseObjects, 3000);

app.set("view engine", "ejs");
app.set("token", process.env.TOKEN || "recipeT0k3n");

// app.use(morgan("combined"));
app.use(morgan(":method :url :status * :response-time ms"));
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
app.get("token");

let port = app.get("port");
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const io = require("socket.io")(server);
require("./controllers/chatsController")(io);

module.exports = app;

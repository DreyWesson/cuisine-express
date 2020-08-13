const mongoose = require("mongoose"),
  Subscriber = require("./model/subscribers");

// mongoose.connect("mongodb://localhost:27017/recipe_db", {
//   useNewUrlParser: true,
// });
// mongoose.connection;
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const client = mongoose.connect;

var db = mongoose.createConnection("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// db.once("open", () => {
//   console.log("Successfully connected to MongoDB using Mongoose!");
// });

var contacts = [
  {
    name: "Drey Wesson",
    email: "drey@wesson.com",
    zipCode: 10016,
  },
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016,
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103,
  },
];
// Set up the connection to the database.
// Subscriber.deleteMany()
//   .exec()
//   .then(() => {
//     // Remove all existing data.
//     console.log("Subscriber data is empty!");
//   });
// Loop through
var commands = [];
// subscriber objects to create promises.
contacts.forEach((c) => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email,
    })
  );
});
Promise.all(commands)
  .then((r) => {
    // Log confirmation after promises resolve.
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch((error) => console.log(`ERROR: ${error}`));

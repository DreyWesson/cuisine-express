const mongoose = require("mongoose"),
  Subscriber = require("./models/subscribers"),
  Course = require("./models/course");
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// Create a new Subscriber
function createSubscriber(name, email, zipCode) {
  Subscriber.create({
    name,
    email,
    zipCode,
  }).then((subscriber) => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  });
}
// createSubscriber("Wesson Drey", "wessondrey@gmail.com", "98765");

// Create a new Course
function createCourse(title, description, zipCode, items) {
  // note, items takes an array
  Course.create({
    title,
    description,
    zipCode,
    items,
  }).then((course) => console.log(`Created course: ${course.title}`));
}
const items = ["banana", "apple", "pineapple"];
// createCourse("OMG", "The world is yours", "56748", items);

// SEARCH for a subscriber or course
function searchModel(model, param) {
  // pass in the model(Subscriber, Course etc) and search param
  switch (model) {
    case Subscriber:
      Subscriber.findOne({ name: param }).then((subscriber) =>
        console.log(`Found one subscriber: ${subscriber.getInfo()}`)
      );
      break;
    case Course:
      Course.findOne({ title: param }).then((course) => console.log(course));
      break;
    default:
      break;
  }
}
// searchModel(Subscriber, "rael");
// searchModel(Course, "Things fall apart");

// ASSOCIATE course with subscriber
function associationHandler(name, title) {
  Subscriber.findOne({ name })
    .then((subscriber) => {
      return Course.findOne({ title }).then((course) => {
        subscriber.courses.push(course);
        subscriber.save();
      });
    })
    .then((_) => console.log("Courses now associated with subscriber"));
}
// associationHandler("Jon", "Tomato Land");
// POPULATE course document in subscriber
function populate(name, title) {
  var testCourse, testSubscriber;
  Subscriber.findOne({ name })
    .then((subscriber) => (testSubscriber = subscriber))
    .then((subscriber) => {
      return Course.findOne({ title }).then((course) => (testCourse = course));
    })
    .then(() => Subscriber.populate(testSubscriber, "courses"))
    .then((subscriber) => console.log(subscriber));
}
// populate("Jon", "Tomato Land");
// Query subscribers where ObjectId is same as course.
Course.findOne({ title: "Tomato Land" })
  .then((course) => {
    console.log(course._id);
    console.log(mongoose.Types.ObjectId(course._id));

    return Subscriber.findById({
      courses: mongoose.Types.ObjectId(course._id),
    });
  })
  .then((subscriber) => console.log(subscriber));

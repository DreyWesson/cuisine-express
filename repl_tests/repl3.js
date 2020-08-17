const mongoose = require("mongoose"),
  Subscriber = require("./models/subscribers"),
  Course = require("./models/course");
var testCourse, testSubscriber;
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
// DELETE all subscribers and courses.
Subscriber.deleteMany({})
  .then((items) => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return Course.deleteMany({});
  })
  .then((items) => console.log(`Removed ${items.n} records!`))
  .then(() => {
    // CREATE a new subscriber
    return Subscriber.create({
      name: "Drey",
      email: "drey@wesson.com",
      zipCode: "12345",
    });
  })
  .then((subscriber) => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    return Subscriber.findOne({ name: "xxx" });
  })
  .then((subscriber) => {
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => {
    // CREATE a new course
    return Course.create({
      title: "Things fall apart",
      description: "Things fall apart",
      zipCode: 12345,
      items: ["cherry", "heirloom"],
    });
  })
  .then((course) => {
    testCourse = course;
    console.log(`Created course: ${course.title}`);
  })
  .then(() => {
    // ASSOCIATE the course with subscriber
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
  })
  .then(() => {
    return Subscriber.populate(testSubscriber, "courses");
  })
  .then((subscriber) => console.log(subscriber))
  .then(() => {
    console.log(mongoose.Types.ObjectId(testCourse._id));
    return Subscriber.find({
      courses: mongoose.Types.ObjectId(testCourse._id),
    });
  })
  .then((subscriber) => console.log("The association: ", subscriber));

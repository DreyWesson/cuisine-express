var courses = [
  { title: "Event Driven Cakes", cost: 50 },
  { title: "Asynchronous Artichoke", cost: 25 },
  { title: "Object Oriented Orange Juice", cost: 10 },
];

exports.showHome = (req, res) => {
  res.render("../views/index");
};
exports.showCourses = (req, res) => {
  res.render("../views/courses", {
    offeredCourses: courses,
  });
};
exports.showSignUp = (req, res) => {
  res.render("../views/contact");
};
exports.postedSignUpForm = (req, res) => {
  res.render("../views/thanks");
};

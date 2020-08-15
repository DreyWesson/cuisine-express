var courses = [
  { title: "Event Driven Cakes", cost: 50 },
  { title: "Asynchronous Artichoke", cost: 25 },
  { title: "Object Oriented Orange Juice", cost: 10 },
];

showHome = (req, res) => {
  res.render("../views/index");
};
showCourses = (req, res) => {
  res.render("../views/courses", {
    offeredCourses: courses,
  });
};
showSignUp = (req, res) => {
  res.render("../views/contact");
};
postedSignUpForm = (req, res) => {
  res.render("../views/thanks");
};
module.exports = { showHome, showCourses, showSignUp, postedSignUpForm };

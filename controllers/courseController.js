const Course = require("../models/course"),
  getCourseParams = (body) => {
    return {
      title: body.title,
      description: body.description,
      maxStudents: body.maxStudents,
      cost: body.cost,
    };
  };

module.exports = {
  index: (req, res, next) => {
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then((course) => {
        req.flash("success", `${course.title}'s course created successfully!`);
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error saving course: ${error.message}`);
        req.flash(
          "error",
          `Failed to create course because: ${error.message}.`
        );
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        req.flash("error", `Error fetching course by ID: ${error.message}.`);
        next(error);
      });
  },
  showView: (req, res) => res.render("courses/show"),

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.render("courses/edit", { course });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        req.flash("error", `Error editing course by ID: ${error.message}.`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, { $set: courseParams })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        req.flash("success", `${course.title}'s course updated successfully!`);
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        req.flash(
          "error",
          `Failed to update course because: ${error.message}.`
        );
        next(error);
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then((course) => {
        res.locals.redirect = "/courses";
        req.flash("success", `${course.title}'s course deleted!`);

        next();
      })
      .catch((error) => {
        console.log(`Error deleting course by ID: ${error.message}`);
        req.flash("error", `Error deleting course by ID: ${error.message}.`);

        next();
      });
  },
};

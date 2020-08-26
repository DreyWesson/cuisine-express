const router = require("express").Router(),
  coursesController = require("../controllers/courseController"),
  usersController = require("../controllers/usersController"),
  subscribersController = require("../controllers/subscribersController");
// router.use(usersController.verifyToken);
// Courses
router.get(
  "/courses/:id/join",
  coursesController.join,
  coursesController.respondJSON
);
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);
router.get("/course", coursesController.show, coursesController.respondJSON);
router.use(coursesController.errorJSON);

// Users
router.get("/users", usersController.index, usersController.respondJSON);
router.use(usersController.errorJSON);

// Subscribers
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.respondJSON
);
router.post("/login", usersController.apiAuthenticate);
router.use(subscribersController.errorJSON);
module.exports = router;

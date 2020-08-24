const router = require("express").Router(),
  homeController = require("../controllers/homeController");
router.get("/", homeController.showHome);
module.exports = router;

const router = require("express").Router(),
  homeController = require("../controllers/homeController");
router.get("/", homeController.showHome);
router.get("/chat", homeController.chat);
module.exports = router;

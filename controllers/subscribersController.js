const mongoose = require("mongoose"),
  Subscriber = require("../models/subscribers");

module.exports = {
  // index: (req, res) => {
  //   Subscriber.find({})
  //     .then((subscribers) => {
  //       res.render("subscribers/index", { subscribers });
  //     })
  //     .catch((error) => {
  //       console.log(`Error fetching users: ${error.message}`);
  //       res.redirect("/");
  //     });
  // },

  index: (req, res, next) => {
    Subscriber.find()
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },

  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },
  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
    });
    newSubscriber
      .save()
      .then((result) => {
        res.render("thanks");
      })
      .catch((error) => {
        if (error) res.send(error);
      });
  },
};

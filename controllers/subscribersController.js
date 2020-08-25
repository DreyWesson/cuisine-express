const Subscriber = require("../models/subscribers"),
  httpStatus = require("http-status-codes"),
  getSubscriberParams = (body) => {
    return {
      name: body.name,
      email: body.email,
      zipCode: parseInt(body.zipCode),
    };
  };

module.exports = {
  index: (req, res, next) => {
    Subscriber.find()
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.subscribers);
    } else {
      // res.render("users/index");
      res.render("subscribers/index");
    }
  },
  new: (req, res) => {
    res.render("subscribers/new");
  },
  create: (req, res, next) => {
    let subscriberParams = getSubscriberParams(req.body);
    Subscriber.create(subscriberParams)
      .then((subscribers) => {
        res.locals.redirect = "/subscribers";
        res.locals.subscribers = subscribers;
        req.flash(
          "success",
          `${subscribers.name}'s subscriber created successfully!`
        );
        next();
      })
      .catch((error) => {
        console.log(`Error saving subscriber: ${error.message}`);
        req.flash(
          "error",
          `Failed to create subscriber because: ${error.message}.`
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
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        req.flash(
          "error",
          `Error fetching subscriber by ID: ${error.message}.`
        );
        next(error);
      });
  },
  showView: (req, res) => res.render("subscribers/show"),
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.render("subscribers/edit", { subscriber });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        req.flash(
          "error",
          `Error editing subscriber with ID: ${error.message}.`
        );
        next(error);
      });
  },
  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = getSubscriberParams(req.body);
    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams })
      .then((subscriber) => {
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        req.flash(
          "success",
          `${subscriber.name}'s subscription updated successfully!`
        );
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        req.flash(
          "error",
          `Failed to update subscription because: ${error.message}.`
        );
        next(error);
      });
  },
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then((subscriber) => {
        res.locals.redirect = "/subscribers";
        req.flash("success", `${subscriber.name}'s subscription deleted!`);
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        req.flash(
          "error",
          `Error deleting subscriber with ID: ${error.message}.`
        );
        next();
      });
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
};

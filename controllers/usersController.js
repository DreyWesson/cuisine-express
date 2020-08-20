const User = require("../models/user"),
  getUserParams = (body) => {
    return {
      name: {
        first: body.first,
        last: body.last,
      },
      email: body.email,
      password: body.password,
      zipCode: parseInt(body.zipCode),
    };
  };

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },
  new: (req, res) => {
    res.render("users/new");
  },
  validate: (req, res, next) => {
    // Remove whitespace with the trim method.
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    // Validate zip code field
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    // Validate password field
    req.check("password", "Password cannot be empty").notEmpty();
    // Collect the results of previous validations
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  create: (req, res, next) => {
    let userParams = getUserParams(req.body);
    if (req.skip) next();
    else {
      User.create(userParams)
        .then((users) => {
          req.flash(
            "success",
            `${users.fullName}'s account created successfully!`
          );
          res.locals.redirect = "/users";
          res.locals.users = users;
          next();
        })
        .catch((error) => {
          console.log(`Error saving user: ${error.message}`);
          req.flash(
            "error",
            `Failed to create user account because: ${error.message}.`
          );
          next(error);
        });
    }
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        req.flash("error", `Error fetching user by ID: ${error.message}.`);
        next(error);
      });
  },
  showView: (req, res) => res.render("users/show"),

  // edit: (req, res, next) => {
  //   let userId = req.params.id;
  //   User.findById(userId)
  //     .then((user) => {
  //       res.locals.user = user;
  //       next();
  //     })
  //     .catch((error) => {
  //       console.log(`Error fetching user by ID: ${error.message}`);
  //       next(error);
  //     });
  // },
  // editView: (req, res) => res.render("users/edit"),
  // OR
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", { user });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        req.flash("error", `Error editing user by ID: ${error.message}.`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, { $set: userParams })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        req.flash(
          "success",
          `${user.fullName}'s account updated successfully!`
        );
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then((users) => {
        res.locals.redirect = "/users";
        req.flash("success", `${users.fullName}'s account deleted!`);
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        req.flash("error", `Error deleting user by ID: ${error.message}.`);
        next();
      });
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user && user.password === req.body.password) {
          res.locals.redirect = `/users/${user._id}`;
          req.flash("success", `${user.fullName}'s logged in successfully!`);
          res.locals.user = user;
          next();
        } else {
          req.flash("error", "Your account or password is incorrect.");
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch((error) => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  },
  authenticate: (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          user.passwordComparison(req.body.password).then((passwordsMatch) => {
            if (passwordsMatch) {
              res.locals.redirect = `/users/${user._id}`;
              req.flash(
                "success",
                `${user.fullName}'s logged in successfully!`
              );
              res.locals.user = user;
            } else {
              req.flash(
                "error",
                "Failed to log in user account: Incorrect Password."
              );
              res.locals.redirect = "/users/login";
            }
            next();
          });
        } else {
          req.flash(
            "error",
            "Failed to log in user account: User account not found."
          );
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch((error) => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  },
};

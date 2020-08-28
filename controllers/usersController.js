const User = require("../models/user"),
  httpStatus = require("http-status-codes"),
  passport = require("passport"),
  token = process.env.TOKEN || "recipeT0k3n",
  jsonWebToken = require("jsonwebtoken"),
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
  // export getUserParams for test
  getUserParams,
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
    // Example: Check if name is empty field, using server-side
    req.check("first", "First name can't be empty").isLength({ min: 2 });
    req.check("last", "Last name can't be empty").isLength({ min: 2 });
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

  // verifyToken: (req, res, next) => {
  //   let token = req.query.apiToken;
  //   if (token) {
  //     User.findOne({ apiToken: token })
  //       .then((user) => {
  //         if (user) next();
  //         else next(new Error("Invalid API token."));
  //       })
  //       .catch((error) => next(new Error(error.message)));
  //   } else {
  //     next(new Error("Invalid API token."));
  //   }
  // },

  verifyJWT: (req, res, next) => {
    // Retrieve the JWT from request headers.
    let token = req.headers.token;
    if (token) {
      // Verify the JWT, and decode its payload.
      jsonWebToken.verify(
        token,
        "secret_encoding_passphrase",
        (errors, payload) => {
          if (payload) {
            // Check for a user with the decoded user ID from the JWT payload.
            User.findById(payload.data).then((user) => {
              if (user) {
                // Call the next middleware function if a user is found with the JWT ID
                next();
              } else {
                res.status(httpStatus.FORBIDDEN).json({
                  error: true,
                  message: "No User account found.",
                });
              }
            });
          } else {
            res.status(httpStatus.UNAUTHORIZED).json({
              error: true,
              message: "Cannot verify API token.",
            });
            next();
          }
        }
      );
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token",
      });
    }
  },

  create: (req, res, next) => {
    if (req.skip) next();
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because:
    ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
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

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login. Wrong password or email.",
    successRedirect: "/",
    successFlash: "Logged in!",
  }),

  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign(
          { data: user._id, exp: new Date().setDate(new Date().getDate() + 1) },
          "secret_encoding_passphrase"
        );
        res.json({
          success: true,
          token: signedToken,
        });
      } else
        res.json({ success: false, message: "Could not authenticate user." });
    })(req, res, next);
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
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

var express = require("express");
var router = express.Router();
var dbHelper = require("../mongoUsers");
var { check, validationResult } = require("express-validator");

// Get all users
router.get("/", function(req, res, next) {
  dbHelper.getArrayOfAllUsers(function(users) {
    console.log(users);
    res.render("userList", {
      users: users,
      error: ""
    });
  });
});

// Delete user
router.get(
    "/delete",
    [
      check("id")
          .isString()
          .isLength({ min: 24, max: 24 })
    ],
    function(req, res, next) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("error", {
          errors: errors.array(),
          message: "Error during deleting user"
        });
      }
      var id = req.query.id;
      dbHelper.deleteUserWithId(id, function(isDeleted) {
        if (isDeleted) {
          return res.status(422).render("error", {
            errors: [],
            message: "Error during deleting user"
          });
        } else {
          res.redirect("/users");
        }
      });
    }
);

// Add user
router.post(
    "/",
    [
      check("firstName").isLength({ min: 1 }),
      check("lastName").isLength({ min: 1 }),
      check("age").isInt()
    ],
    function(req, res, next) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("error", {
          errors: errors.array(),
          message: "Bad form input"
        });
      }

      var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age
      };
      dbHelper.addUser(user);

      // redirection
      res.redirect("/users");
    }
);

router.get(
    "/edit",
    [
      check("id")
          .isString()
          .isLength({ min: 24, max: 24 })
    ],
    function(req, res, next) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("error", {
          errors: errors.array(),
          message: "Error during editing user"
        });
      }
      var id = req.query.id;
      var user = dbHelper.getUserWithId(id, function(user) {
        res.render("edit", {
          user: user
        });
      });
    }
);

router.post(
    "/edit",
    [
      check("firstName").isLength({ min: 1 }),
      check("lastName").isLength({ min: 1 }),
      check("age").isInt(),
      check("id")
          .isString()
          .isLength({ min: 24, max: 24 })
    ],
    function(req, res, next) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("error", {
          errors: errors.array(),
          message: "Bad form input"
        });
      }
      dbHelper.editUser(
          req.body.id,
          req.body.firstName,
          req.body.lastName,
          req.body.age
      );
      // redirection
      res.redirect("/users");
    }
);

module.exports = router;

/*
TODO:
- Modification d'une ligne de la bd
- intégrer materialize pour mettre en forme
*/

const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const { check } = require("express-validator");
const { Router } = require("express");
const router = Router();

const JWT_Secret = "AsAlwaysOverPowered$";

// route for creating user

router.post(
  "/register",
  [
    check("name", "Please Enter name min of 3 Characters").isLength({ min: 5 }),
    check("email", "Please Enter a valid Email").isEmail(),
    check("password", "Password must be atleast 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res, next) => {
    // logic for validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ errors: result.array() });
    }

    // checking email is exist or not
    try {
      let checkEmail = await User.findOne({ email: req.body.email });
      if (checkEmail) {
        return res.json({
          success: false,
          msg: "User With this Email is already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // creating user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      }).catch((err) => res.json({ success: false, msg: "Internal Error" }));
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtToken = JWT.sign(data, JWT_Secret);

      res.json({ success: true, jwtToken });
    } catch (error) {
      res.json({ success: false, msg: "Internal Error" });
    }
  }
);

// creating route to login users
router.post(
  "/login",
  [
    check("email", "Please Enter a valid Email").isEmail(),
    check("password", "Password must be atleast 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res, next) => {
    // logic for validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ msg: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "Please Enter Correct Details" });
      }
      const ComparePassword = await bcrypt.compare(password, user.password);
      if (!ComparePassword) {
        return res
          .status(400)
          .json({ success: false, msg: "Please Enter Correct Details" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtToken = JWT.sign(data, JWT_Secret);
      const { password: hashedPassword, ...rest } = user._doc;

      res.json({ success: true, jwtToken, rest });
    } catch (error) {
      res.json({ success: false, msg: "Internal Error" });
    }
  }
);

// creating route to get user logged

router.post("/logged", fetchUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    res.json({ success: false, msg: "Internal Error" });
  }
});

module.exports = router;

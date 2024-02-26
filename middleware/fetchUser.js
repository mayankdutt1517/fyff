const JWT = require("jsonwebtoken");
const JWT_Secret = "AsAlwaysOverPowered$";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const data = JWT.verify(token, JWT_Secret);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send("Access Denied");
  }
};

module.exports = fetchUser;

const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  try {
    let token = req.header('x-token');
    if (!token) {
      return res.json("Token not found");
    } else {
      let decoded = jwt.verify(token, '1234-5678');
      req.user = decoded.user;
      next();
    }
  } catch(err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

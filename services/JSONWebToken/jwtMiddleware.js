const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).send("Please Login");

  const verified = jwt.verify(
    token,
    process.env.JWT_SECRET || "TheFifthTeamIsTheBestTeam",
    (err, user) => {
      if (err) return res.status(401).send("Please Login");
      req.user = user;
      next();
    }
  );
};

module.exports = verifyToken;

import jwt from "jsonwebtoken";
import Company from "../db/schema.js";

const authMiddleware = async (req, res, next) => {
  console.log("run");

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const currentCompany = await Company.findById(decoded.id);

    if (!currentCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    req.currentCompany = currentCompany;
    next(); // Proceed to the route handler
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

export default authMiddleware;

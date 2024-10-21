import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../db/schema.js";

class AuthController {
  async register(companyData) {
    const hashedPassword = await bcrypt.hash(companyData.password, 10);
    const newCompany = new Company({
      ...companyData,
      password: hashedPassword,
      isEmailVerified: false,
      isPhoneVerified: false,
      postedJobs: [],
    });
    return await newCompany.save();
  }

  async login(email, password) {
    const company = await Company.findOne({ companyEmail: email });
    if (!company || !(await bcrypt.compare(password, company.password))) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: company._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return { token };
  }

  async verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}

export default new AuthController();

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  experienceLevel: { type: Number, required: true },
  candidates: [{ type: String }],
  endDate: { type: Date, required: true },
});

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employeeSize: { type: Number, required: true },
    emailOTP: { type: String, required: false },
    phoneOTP: { type: String, required: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    postedJobs: [jobSchema],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
const Company = mongoose.model("Company", companySchema);

export default Company;

export { Job };

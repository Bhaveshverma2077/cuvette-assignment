import { config } from "dotenv";
config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { sendEmail, sendSMS } from "./utils/mailer.js";
import authController from "./controllers/authController.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import { generateSixDigitOTP } from "./utils/index.js";
import { Job } from "./db/schema.js";

const PORT = process.env.PORT ?? 5000;
const app = express();
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST"],
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("working...");
});

app.post("/verify/email/:otp", authMiddleware, async (req, res) => {
  try {
    const { otp } = req.params;
    if (req.currentCompany.emailOTP !== otp) {
      res.status(400).json({ CODE: "INVALID" });
      return;
    }
    req.currentCompany.isEmailVerified = true;
    await req.currentCompany.save();
    res.status(200).json({ CODE: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ CODE: "ERROR", message: error.message });
  }
});

app.post("/verify/phone/:otp", authMiddleware, async (req, res) => {
  console.log(req.params);
  try {
    const { otp } = req.params;
    if (req.currentCompany.phoneOTP !== otp) {
      res.status(400).json({ CODE: "INVALID" });
      return;
    }
    req.currentCompany.isPhoneVerified = true;
    await req.currentCompany.save();
    res.status(200).json({ CODE: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ CODE: "ERROR", message: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const companyName = "Cuvette";
    const emailOtp = generateSixDigitOTP();
    const phoneOtp = generateSixDigitOTP();

    const emailTemplate = `
      Hi there,

      Thank you for registering with ${companyName}!

      Your verification code is: ${emailOtp}

      Please enter this code to verify your email address.

      If you did not request this verification, please ignore this message.

      Best regards,
      ${companyName} Team
`;

    const phoneTemplate = `Your verification code for ${companyName} is: ${phoneOtp}`;

    const company = await authController.register({
      ...req.body,
      phoneOTP: phoneOtp,
      emailOTP: emailOtp,
    });

    sendEmail([company.companyEmail], "verify you email", "", emailTemplate);
    sendSMS(company.phoneNo, phoneTemplate);

    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/user", authMiddleware, async (req, res) => {
  const user = req.currentCompany;

  try {
    res.json({
      id: user._id,
      name: user.name,
      email: user.companyEmail,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { token } = await authController.login(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post("/jobs", authMiddleware, async (req, res) => {
  const { jobTitle, jobDescription, experienceLevel, candidates, endDate } =
    req.body;

  if (!jobTitle || !jobDescription || !experienceLevel || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const jobPost = {
    jobTitle,
    jobDescription,
    experienceLevel,
    candidates: candidates || [],
    endDate: new Date(endDate),
  };

  const job = Job(jobPost);

  try {
    req.currentCompany.postedJobs.push(job);
    await req.currentCompany.save();

    res.status(201).json({
      message: "Job post added successfully",
      job,
    });
  } catch (error) {
    console.error("Error adding job post:", error);
    res
      .status(500)
      .json({ message: "Error adding job post", error: error.message });
  }
});

app.post("/send-emails/:jobId", authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  const jobPost = req.currentCompany.postedJobs.id(jobId);

  if (!jobPost) {
    return res.status(404).json({ message: "Job post not found" });
  }

  const { candidates } = jobPost;
  const subject = `New Job Alert: ${jobPost.jobTitle}`;
  const text = `We are excited to inform you about a new job opportunity: ${jobPost.jobDescription}`;

  const html = `
    <h1>Job Opportunity: ${jobPost.jobTitle}</h1>
    <p>Dear Candidate,</p>
    <p>We are excited to inform you about a new job opening for the position of <strong>${jobPost.jobTitle}</strong>.</p>
    <p><strong>Job Description:</strong><br>${jobPost.jobDescription}</p>
    <p><strong>Experience Level:</strong> ${jobPost.experienceLevel}</p>
    <p><strong>Application Deadline:</strong> ${jobPost.endDate}</p>
    <p>We would love to see your application and learn more about your qualifications. Please feel free to reach out if you have any questions.</p>
    <p>Best regards,<br>The Hiring Team</p>
`;

  try {
    await sendEmail(candidates, subject, text, html);

    res
      .status(200)
      .json({ message: "Emails sent successfully to candidates." });
  } catch (error) {
    console.error("Error sending emails:", error);
    res
      .status(500)
      .json({ message: "Error sending emails", error: error.message });
  }
});

mongoose.connect("mongodb://127.0.0.1:27017/jobappppp").then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
});

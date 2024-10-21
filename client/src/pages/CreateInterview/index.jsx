import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import home from "../../icons/home.svg";
import curvedTriangle from "../../icons/curved-triangle.svg";
import calander from "../../icons/calander.svg";

import Navbar from "../../components/nabvar";
import EmailTagInput from "./components/EmailTagInpt";
import { useAuth } from "../../context/auth";

const inputStyle =
  "w-full md:w-[24rem] lg:w-[32rem] p-2 pl-9 border border-[#D0D0D0] placeholder:text-sm placeholder:text-[#535353B2] rounded-md";

function InputFieldContainer({ name, children }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-2 md:mb-0 md:gap-16 w-full justify-between items-center relative">
      <p className="text-lg w-full md:w-36 text-start md:text-right">{name}</p>
      {children}
    </div>
  );
}

export default function CreateInterview() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const elements = e.target.elements;
    const endDate = elements["job_end_date"].value;

    // data to send (not validated)
    const data = {
      jobTitle: elements["job_title"].value,
      jobDescription: elements["job_des"].value,
      experienceLevel: elements["job_exp_level"].value,
      candidates,
      endDate: endDate ? new Date(endDate).toISOString() : "",
    };

    // validation
    if (
      data.jobTitle === "" ||
      data.jobDescription == "" ||
      data.experienceLevel == "" ||
      data.endDate == ""
    ) {
      setIsError(true);
      return;
    }

    setIsError(false);
    console.log(data);
    const response = await fetch(
      `http://${import.meta.env.VITE_API_URL}/jobs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const jobId = (await response.json())["job"]["_id"];

    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}/send-emails/${jobId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    navigate("/");
  };
  if (!user.isPhoneVerified || !user.isEmailVerified) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center flex-col">
        <div className="text-red-500 mt-1 text-sm">
          Phone and Email verification needed.
        </div>
        <Link to={"/verify"} className="text-blue-600 underline">
          verify
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitHandler}
      className="min-h-[100vh] h-[52rem] md:h-[20rem]"
    >
      <Navbar />
      <div className="h-[2px] w-full bg-[#C5C5C5]"></div>
      <div className="flex h-full">
        <div className="h-full border-r-2 border-[#C5C5C5] px-6 pt-6">
          <button className="w-6">
            <img src={home} className="w-6" />
          </button>
        </div>
        <div className="min-h-[100vh] md:min-h-[calc(100vh-78px)] w-full p-24">
          <div className="flex flex-col flex-1 lg:flex-auto lg:w-[42rem] gap-4">
            <InputFieldContainer name={"Job Title"}>
              <input
                name="job_title"
                className={inputStyle}
                type="text"
                placeholder="Enter a Job Title"
              />
            </InputFieldContainer>
            <InputFieldContainer name={"Job Description"}>
              <textarea
                name="job_des"
                className={inputStyle}
                type="text"
                placeholder="Enter a Job Description"
              />
            </InputFieldContainer>
            <InputFieldContainer name={"Experience Level"}>
              <select
                name="job_exp_level"
                className={inputStyle}
                placeholder="Select Experience Level"
              >
                <option value="0">Fresher</option>
                <option value="1">1+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
              </select>
              <img
                className="click-pass-through w-4 absolute z-10 right-2 top-14 md:top-[50%] md:translate-y-[-50%]"
                src={curvedTriangle}
              />
            </InputFieldContainer>
            <InputFieldContainer name={"Add Candidate"}>
              <EmailTagInput updateFunc={setCandidates}></EmailTagInput>
            </InputFieldContainer>
            <InputFieldContainer name={"End Date"}>
              <input
                name="job_end_date"
                className={inputStyle}
                type="date"
                placeholder="Select a Date"
              />
              <img
                className="w-4 absolute right-2 top-14 md:top-[50%] md:translate-y-[-50%]"
                src={calander}
              />
            </InputFieldContainer>
            <div className="flex justify-end pb-24 md:pb-0">
              <button
                type="submit"
                className="bg-[#0B66EF] py-1 px-3 text-white rounded-md"
              >
                Send
              </button>
            </div>
            {isError && (
              <div className="text-red-500 mt-1 text-sm">
                All fields are required except for candidates.
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

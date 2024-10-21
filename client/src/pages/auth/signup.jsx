import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import person from "../../icons/person.svg";
import phone from "../../icons/phone.svg";
import mail from "../../icons/mail.svg";
import groups from "../../icons/groups.svg";

import Navbar from "../../components/nabvar";
import TextField from "./components/TextField";
import AuthFormContainer from "./components/AuthFormContainer";
import { useAuth } from "../../context/auth";

export default function SignUp() {
  const { user } = useAuth(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const elements = e.target.elements;

    // data to send (not validated)
    const data = {
      name: elements["name"].value,
      phoneNo: elements["phone"].value,
      companyName: elements["company_name"].value,
      password: elements["password"].value,
      companyEmail: elements["company_email"].value,
      employeeSize: elements["employee_size"].value,
    };

    // validation
    if (
      data.name === "" ||
      data.phoneNo == "" ||
      data.companyName == "" ||
      data.companyEmail == "" ||
      data.password == "" ||
      data.employeeSize == ""
    ) {
      setIsError(true);
      return;
    }

    setIsError(false);
    console.log(data);
    const response = await fetch(
      `http://${import.meta.env.VITE_API_URL}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    navigate("/login");
  };

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <form
        onSubmit={submitHandler}
        className="flex justify-center md:justify-around"
      >
        <div className="items-center justify-center hidden c-md:flex c-md:w-64 lg:w-96 text-[0.9rem]">
          {
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
          }
        </div>
        {/* dummy div for alignment */}
        <div className="hidden lg:block" />
        <AuthFormContainer
          title={"Sign Up"}
          subtitle={"Lorem Ipsum is simply dummy text"}
        >
          <TextField
            name={"name"}
            image={person}
            placeholderText={"Name"}
          ></TextField>
          <TextField
            name={"phone"}
            image={phone}
            placeholderText={"Phone no."}
          ></TextField>
          <TextField
            image={person}
            name={"company_name"}
            placeholderText={"Company Name"}
          ></TextField>
          <TextField
            name={"company_email"}
            image={mail}
            placeholderText={"Company Email"}
          ></TextField>
          <TextField
            image={groups}
            name={"employee_size"}
            placeholderText={"Employee Size"}
          ></TextField>
          <TextField
            image={null}
            name={"password"}
            placeholderText={"Password"}
            obscure={true}
          ></TextField>
          <div className="text-center text-[0.8rem]">
            <p>By clicking on proceed you wil accept our Terms & Conditions</p>
            <p>
              <span className="text-[#0B66EF] opacity-70">Terms</span> &{" "}
              <span className="text-[#0B66EF] opacity-70">Conditions</span>
            </p>
          </div>
          {isError && (
            <div className="text-red-500 mt-1 text-sm">
              All fields are required.
            </div>
          )}
          <button className="bg-[#0B66EF] hover:bg-[#2c589b] transition-colors py-1 text-white w-full rounded-md">
            Proceed
          </button>
        </AuthFormContainer>
      </form>
    </>
  );
}

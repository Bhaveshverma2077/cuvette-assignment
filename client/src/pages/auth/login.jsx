import mail from "../../icons/mail.svg";

import AuthFormContainer from "./components/AuthFormContainer";
import Navbar from "../../components/nabvar";
import TextField from "./components/TextField";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isError, setIsError] = useState(false);
  const { user, login } = useAuth(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const elements = e.target.elements;

    // data to send (not validated)
    const data = {
      email: elements["email"].value,
      password: elements["password"].value,
    };

    // validation
    if (data.email === "" || data.password === "") {
      setIsError(true);
      return;
    }
    setIsError(false);
    const response = await fetch(
      `http://${import.meta.env.VITE_API_URL}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const body = await response.json();
    const token = body["token"];
    login(token);
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={submitHandler}
        className="flex justify-center md:justify-around pt-16"
      >
        <div className="items-center justify-center hidden c-md:flex c-md:w-64 lg:w-96 text-[0.9rem]">
          {
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
          }
        </div>
        {/* dummy div for alignment */}
        <div className="hidden lg:block" />
        <AuthFormContainer
          title={"Log In"}
          subtitle={"Lorem Ipsum is simply dummy text"}
        >
          <TextField
            image={mail}
            placeholderText={"Enter Email"}
            name={"email"}
          ></TextField>
          <TextField
            image={null}
            obscure
            placeholderText={"Enter Password"}
            name={"password"}
          ></TextField>
          {isError && (
            <div className="text-red-500 mt-1 text-sm">
              All fields are required.
            </div>
          )}
          <button
            type="submit"
            className="bg-[#0B66EF] hover:bg-[#2c589b] transition-colors py-1 text-white w-full rounded-md"
          >
            Login
          </button>
        </AuthFormContainer>
      </form>
    </>
  );
}

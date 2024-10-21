import { useEffect, useState } from "react";

import phone from "../../icons/phone.svg";
import mail from "../../icons/mail.svg";
import checkCircle from "../../icons/check_circle.svg";

import AuthFormContainer from "./components/AuthFormContainer";
import Navbar from "../../components/nabvar";
import TextField from "./components/TextField";
import { useAuth } from "../../context/auth";

function CustomTextField({
  prefixImage,
  suffixImage,
  placeholderText,
  onSubmit,
  isVerified,
}) {
  const [value, setValue] = useState();
  return (
    <>
      <div className="relative w-full">
        {isVerified && (
          <img
            className="absolute right-3 w-4 top-[50%] -translate-y-[50%] z-10"
            src={suffixImage}
          />
        )}
        <TextField
          image={prefixImage}
          disabled={isVerified}
          placeholderText={placeholderText}
          onChange={(e) => setValue(e.target.value)}
        ></TextField>
      </div>
      {!isVerified && (
        <button
          onClick={() => onSubmit(value)}
          className="bg-[#0B66EF] hover:bg-[#2c589b] transition-colors py-1 text-white w-full rounded-md"
        >
          Verify
        </button>
      )}
    </>
  );
}

export default function Verify() {
  const { user } = useAuth();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    if (user && user.isEmailVerified) setIsEmailVerified(true);
    if (user && user.isPhoneVerified) setIsPhoneVerified(true);
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex justify-center md:justify-around pt-16">
        <div className="items-center justify-center hidden c-md:flex c-md:w-64 lg:w-96 text-[0.9rem]">
          {
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
          }
        </div>
        {/* dummy div for alignment */}
        <div className="hidden lg:block" />
        <AuthFormContainer
          title={"Sign Up"}
          subtitle={
            "Two OTPs have been sent: one to your email and another via SMS to your phone."
          }
        >
          <CustomTextField
            prefixImage={phone}
            suffixImage={checkCircle}
            isVerified={isPhoneVerified}
            placeholderText={"Phone OTP"}
            onSubmit={async (otp) => {
              const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/verify/phone/${otp}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (!response.ok) {
                throw new Error("Failed to fetch user data");
              }
              setIsPhoneVerified(true);
            }}
          />
          <CustomTextField
            prefixImage={mail}
            suffixImage={checkCircle}
            isVerified={isEmailVerified}
            placeholderText={"Email OTP"}
            onSubmit={async (otp) => {
              const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/verify/email/${otp}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (!response.ok) {
                throw new Error("Failed to fetch user data");
              }
              setIsEmailVerified(true);
            }}
          />
        </AuthFormContainer>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";

const EmailTagInput = ({ updateFunc }) => {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    updateFunc(emails);
  }, [emails, updateFunc]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedEmail = emailInput.trim();
      if (validateEmail(trimmedEmail)) {
        setEmails([...emails, trimmedEmail]);
        setEmailInput("");
        setErrorMessage("");
      } else {
        setErrorMessage("Please enter a valid email address.");
      }
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="w-full md:w-[24rem] lg:w-[32rem] ">
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap items-center bg-white min-h-[40px]">
        <div className="flex flex-wrap gap-2">
          {emails.map((email) => (
            <div
              key={email}
              className="flex items-center text-sm text-[#535353B2] px-2 py-1 rounded-full border border-[#D0D0D0]"
            >
              <div className="bg-[#DADADA] rounded-full w-4 h-4 mr-[6px]"></div>
              <p>{email}</p>
              <button
                className="ml-2 text-lg focus:outline-none"
                onClick={() => removeEmail(email)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter email and press Enter"
          className="flex-1 outline-none border-none p-0 min-h-[24px] w-full box-border"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      {errorMessage && (
        <div className="text-red-500 mt-1 text-sm">{errorMessage}</div>
      )}
    </div>
  );
};

export default EmailTagInput;

import { Link, useNavigate } from "react-router-dom";

import Logo from "./logo.jsx";
import ChevronDown from "./ChevronDown.jsx";
import { useAuth } from "../context/auth.jsx";

export default function Navbar() {
  const { user, logout } = useAuth(false);
  const navigate = useNavigate();

  return (
    <nav className="px-12 py-6 text-[#576474] flex justify-between items-center w-full">
      <Logo />
      <div className="flex items-center gap-5">
        <Link to={"#"} className="no-underline text-[#576474] font-body">
          Contact
        </Link>

        {user && (
          <>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="no-underline text-[#576474] font-body"
            >
              Logout
            </button>
            <button className="rounded-sm text-[#83909F] border border-[#83909F] flex gap-3 p-2">
              <div className="rounded-full bg-[#83909F] w-5 h-5"></div>
              <p className="text-sm">{user.name}</p>
              <ChevronDown />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

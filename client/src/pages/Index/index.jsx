import { Link } from "react-router-dom";

import home from "../../icons/home.svg";

import { useAuth } from "../../context/auth";
import Navbar from "../../components/nabvar";

export default function Index() {
  useAuth();

  return (
    <div className="min-h-[100vh] h-[52rem] md:h-[20rem]">
      <Navbar />
      <div className="h-[2px] w-full bg-[#C5C5C5]"></div>
      <div className="flex h-full">
        <div className="h-full border-r-2 border-[#C5C5C5] px-6 pt-6">
          <button className="w-6">
            <img src={home} className="w-6" />
          </button>
        </div>
        <div className="p-12">
          <Link
            to={"/create-interview"}
            className="p-2 bg-[#0B66EF] text-lg text-white rounded-md"
          >
            Create Interview
          </Link>
        </div>
      </div>
    </div>
  );
}

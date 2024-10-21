import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./context/auth";

import SignUp from "./pages/auth/signup";
import Verify from "./pages/auth/verify";
import Login from "./pages/auth/login";
import CreateInterview from "./pages/CreateInterview";
import Index from "./pages/Index";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/create-interview",
    element: <CreateInterview />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-body">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  </StrictMode>
);

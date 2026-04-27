// Application root: mounts the React Router provider and enforces dark mode on the document element.
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";

export default function App() {
  // Enable dark mode globally
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <RouterProvider router={router} />;
}
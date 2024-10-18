import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";

const NavBar = ({ userInfo }) => {
  const [openNav, setOpenNav] = React.useState(false);

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {};
  const onClearSearch = () => {
    setSearchQuery("");
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          Task Management App.
        </Typography>
        {userInfo ? <ProfileInfo onLogout={onLogout} /> : ""}
      </div>
    </Navbar>
  );
};

export default NavBar;

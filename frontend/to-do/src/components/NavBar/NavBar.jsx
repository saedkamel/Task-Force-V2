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
        <div className="hidden lg:block">
          <Searchbar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
        <div className="hidden gap-2 lg:flex">
          <ProfileInfo onLogout={onLogout} />
          <Button variant="gradient" size="sm">
            Sign Up
          </Button>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="flex w-72 flex-nowrap items-center gap-2 lg:hidden">
          <Button variant="gradient" size="sm" fullWidth>
            Sign In
          </Button>
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;

import React from "react";
import { useState } from "react";

import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/Navbar";
import { validateEmail } from "../../utiles/helper";
import axiosInstance from "../../utiles/axiosintances";

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handelLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please insert a valid email email");
      return;
    }

    if (!password) {
      setError("Please insert your password");
      return;
    }

    setError("");

    // LOGIN API CALL
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      console.log(response.data);

      //Handle Successfull login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // handel login errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(`An unexpected error occurred. Please try again. ${error}`);
      }
    }
  };

  return (
    <div>
      <div>
        <NavBar />
      </div>

      <section className="grid text-center h-screen p-8">
        <div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Log In
          </Typography>
          <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
            Enter your email and password to sign in
          </Typography>
          {error && (
            <p className="text-red-600 text-xs pb-1 font-bold">{error} </p>
          )}
          <form
            onSubmit={handelLogin}
            className="mx-auto max-w-[24rem] text-left"
          >
            <div className="mb-6">
              <label htmlFor="email">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Your Email
                </Typography>
              </label>

              <Input
                id="email"
                color="gray"
                size="lg"
                type="email"
                name="email"
                placeholder="name@mail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Password
                </Typography>
              </label>
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                size="lg"
                placeholder="********"
                labelProps={{
                  className: "hidden",
                }}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                type={passwordShown ? "text" : "password"}
                icon={
                  <i onClick={togglePasswordVisiblity}>
                    {passwordShown ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </i>
                }
              />
            </div>

            <Button
              type="sumbit"
              color="gray"
              size="lg"
              className="mt-6"
              fullWidth
            >
              sign in
            </Button>
            <div className="!mt-4 flex justify-end">
              <Typography
                as="a"
                href="#"
                color="blue-gray"
                variant="small"
                className="font-medium"
              >
                Forgot password
              </Typography>
            </div>
            <Button
              variant="outlined"
              size="lg"
              className="mt-6 flex h-12 items-center justify-center gap-2"
              fullWidth
            >
              <img
                src={`https://www.material-tailwind.com/logos/logo-google.png`}
                alt="google"
                className="h-6 w-6"
              />{" "}
              sign in with google
            </Button>
            <Typography
              variant="small"
              color="gray"
              className="!mt-4 text-center font-normal"
            >
              Not registered?{" "}
              <a href="#" className="font-medium text-gray-900">
                <Link to="/signup">Create account</Link>
              </a>
            </Typography>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;

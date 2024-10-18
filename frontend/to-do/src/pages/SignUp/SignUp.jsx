import React, { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { validateEmail } from "../../utiles/helper";
import axiosInstance from "../../utiles/axiosintances";

const SignUp = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please insert a name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please insert a valid email");
      return;
    }
    if (!password) {
      setError("Please insert a password");
      return;
    }

    if (!isTermsChecked) {
      setError("Please agree on Terms and Conditions");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      console.log(response.data);

      //Handle Successfull SignUp response
      if (response.data && response.data.error) {
        setError(response.data.error);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // handel SignUp errors
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
    <div className="flex flex-col ">
      <div className="pb-4">
        <NavBar />
      </div>
      <div className="flex flex-col justify-items-start items-center p-4 ">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Nice to meet you! Enter your details to register.
          </Typography>
          {error && (
            <p className="text-red-600 text-xs pb-1 font-bold">{error} </p>
          )}
          <form
            onSubmit={handleSignUp}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Name
              </Typography>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                size="lg"
                placeholder="your name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
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
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button type="submit" className="mt-6" fullWidth>
              sign up
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{" "}
              <a href="#" className="font-medium text-gray-900">
                <Link to="/login">Log In</Link>
              </a>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

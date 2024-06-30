import { useState } from "react";
import { BottomWarning } from "../components/Common/BottomWarning";
import { Button } from "../components/Common/Button";
import { Heading } from "../components/Common/Heading";
import { InputBox } from "../components/Common/InputBox";
import { SubHeading } from "../components/Common/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const emailSchema = z.string().max(50, "Email must be less than 50 characters").regex(/^[A-Za-z0-9._%+-]+@gmail\.com$/, "Email must be a valid address");

const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return email
} catch (e) {
    setErrorMessage(e.errors[0].message);
      return false;
  }
};

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Doe"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            placeholder="shubhdeep@gmail.com"
            label={"Email"}
          />
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2 text-left">
              {errorMessage}
            </div>
          )}
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                if (!validateEmail(email)) return;
                try {
                  const response = await axios.post(
                    "http://localhost:5000/api/signup",
                    {
                      firstName,
                      lastName,
                      email,
                      password,
                    }
                  );
                  localStorage.setItem("token", response.data.token);
                  navigate("/Home");
                } catch (error) {
                  if (error.response && error.response.status === 400) {
                    setErrorMessage("Email already in use");
                  } else {
                    setErrorMessage("Something went wrong. Please try again.");
                  }
                }
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

import { useDispatch, useSelector } from "react-redux";
import {
  selectEmail,
  selectName,
  selectPassword,
  setEmail,
  setName,
  setPassword,
} from "../../redux/features/registerSlice";
import { toast } from "react-toastify";
import authServices from "../../services/authServices";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Register = () => {
  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  let confirmPassword = "";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Call the register function from the authServices
    if (confirmPassword == password) {
      toast.success("Registering...");
      try {
        const response = await authServices.register({ name, email, password });
        if (response) {
          toast.success("Registered successfully");

          // Clear the form
          dispatch(setName(""));
          dispatch(setEmail(""));
          dispatch(setPassword(""));

          // Redirect to the login page
          setTimeout(() => {
            navigate("/auth/login");
          }, 500);
        }
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message);
      }
    }
  };

  return (
      <div className="lg:min-w-[30vw] px-8 py-6 shadow-xl border border-slate-100 rounded-lg bg-white">
        <div className="flex gap-6 flex-col">
          <div className="flex items-center justify-center flex-col gap-1">
            <div className="text-slate-900 font-semibold text-2xl">
              Create an account
            </div>
            <span className="text-slate-500 text-base">
              Enter your credentials to create your account
            </span>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 font-semibold">
                  Full name
                </Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="border p-2 rounded"
                  value={name}
                  onChange={(e) => dispatch(setName(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 font-semibold">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="border p-2 rounded"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 font-semibold">Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="border p-2 rounded"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700">Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter confirm password"
                  className="h-10"
                  onChange={(e) => (confirmPassword = e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                className="bg-slate-800 text-md font-semibold w-full"
                size="lg"
              >
                Sign Up
              </Button>
              <div className="flex justify-between items-center">
                <div className="text-base">Already have an account?</div>
                <Link
                  to="/auth/login"
                  className="underline text-orange-500 text-sm font-medium"
                >
                  Click here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Register;

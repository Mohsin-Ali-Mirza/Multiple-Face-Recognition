import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import Loggedin from "../constants/loggedin";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let __URL__;
  if (document.domain === "localhost") {
    __URL__ = "http://localhost:1337";
  } else {
    __URL__ = "";
  }

  useEffect(() => {
    console.log("Updated state:", loggedIn);
    // Here you can perform any additional actions based on the updated state
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (inputs.email === "admin" && inputs.password === "admin") {
      // Log the success message
      console.log("Logged in successfully");
  
      // Update the state using a callback function
       setLoggedIn((prevLoggedIn) => {
        // Log the previous state
        console.log("Before state update:", prevLoggedIn);
  
        // Update the state
        return true;
      });
  
    } else {
      alert("Invalid login credentials. Please try again.");
    }
  };
  

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-600 animate-pop">
      <form
        className="bg-white flex flex-col px-5 py-10 shadow-2xl rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-blue-900 text-2xl -mt-5 underline underline-offset-2 font-mono">
          Login
        </h1>
        <div className="flex flex-col space-y-5 p-5 rounded-md">
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="border border-b-blue-900 outline-none rounded-sm placeholder:px-1 h-8"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="border border-b-[blue-900] outline-none rounded-sm placeholder:px-1 h-8"
            onChange={handleChange}
          />
          <button className="flex justify-center items-center space-x-2 bg-blue-900 text-white py-1 rounded-md shadow-md hover:bg-blue-900 hover:tracking-wider font-mono">
            <span>Login</span>
            <AiOutlineLogin />
          </button>
        </div>
      </form>
      <Loggedin decision={loggedIn} />
    </div>
  );
};

export default Login;

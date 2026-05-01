import React from "react";
import LoginForm from "../organism/LoginForm";

const LoginTemplate = ({onClick}) => {
  return (
    <div className="w-full max-w-lg p-12 mx-auto border rounded-lg shadow-lg bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-gray-900 text-3xl font-semibold">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
      </div>
      <div>
        <LoginForm />
      </div>
      <div className="mt-4">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={onClick}
            className="text-blue-500 hover:underline cursor-pointer font-semibold"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginTemplate;

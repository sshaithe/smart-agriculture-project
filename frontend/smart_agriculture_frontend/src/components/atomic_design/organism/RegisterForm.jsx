import React from "react";
import FormField from "../modelcule/FormField";

const RegisterForm = ({email, password, text, handleChange}) => {
  return (
    <div className="flex flex-col gap-5">
      <FormField
        id="username"
        name="username"
        label="Username"
        placeholder="Enter your username"
        value={text}
        onChange={handleChange}
      />
      <FormField
        id="email"
        name="email"
        label="E-Mail"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={handleChange}
      />
      <FormField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={handleChange}
      />
    </div>
  );
};

export default RegisterForm;

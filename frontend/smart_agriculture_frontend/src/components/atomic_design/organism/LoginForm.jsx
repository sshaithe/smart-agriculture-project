import React, { useState } from "react";
import FormField from "../modelcule/FormField";
import { authService } from "../../../api/AuthService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField
        id="email"
        name="email"
        label="E-Mail"
        placeholder="ornek@mail.com"
        value={formData.email}
        onChange={handleChange}
      />
      <FormField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
      />
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
          ⚠️ {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-blue-500 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all"
      >
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
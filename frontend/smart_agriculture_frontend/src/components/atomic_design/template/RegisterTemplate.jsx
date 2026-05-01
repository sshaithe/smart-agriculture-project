import React, { useState } from "react";
import RegisterForm from "../organism/RegisterForm";
import { authService } from "../../../api/AuthService";
import { useNavigate } from "react-router-dom";

const RegisterTemplate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData.email, formData.password, formData.username || null);
      setSuccess(true);
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-12 mx-auto border rounded-lg shadow-lg bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-gray-900 text-3xl font-semibold">Create Account</h2>
        <p className="text-gray-400 text-sm mt-1">Join Smart Agriculture Platform</p>
      </div>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <RegisterForm
          email={formData.email}
          password={formData.password}
          text={formData.username}
          handleChange={handleChange}
        />
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
            ⚠️ {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-2">
            ✅ Account created! Redirecting to login…
          </p>
        )}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full mt-2 h-10 bg-green-500 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/sign-in")}
          className="text-blue-500 hover:underline cursor-pointer font-semibold"
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default RegisterTemplate;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFullName,
} from "../utils/validation";

function Register() {
  const { register, checkUsername } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");

    let error = "";

    if (name === "username") error = validateUsername(value);
    if (name === "fullName") error = validateFullName(value);
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);

    if (name === "confirmPassword" || name === "password") {
      const password =
        name === "password" ? value : form.password;
      const confirmPassword =
        name === "confirmPassword" ? value : form.confirmPassword;

      setErrors((prev) => ({
        ...prev,
        [name]: error,
        confirmPassword:
          confirmPassword && password !== confirmPassword
            ? "Passwords do not match"
            : "",
      }));

      return;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  async function handleUsernameBlur() {
    const error = validateUsername(form.username);

    if (error) return;

    setCheckingUsername(true);

    try {
      const taken = await checkUsername(form.username);

      setErrors((prev) => ({
        ...prev,
        username: taken ? "Username is already taken" : "",
      }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        username: "Could not check username",
      }));
    } finally {
      setCheckingUsername(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const nextErrors = {
      username: validateUsername(form.username),
      fullName: validateFullName(form.fullName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword:
        form.password !== form.confirmPassword
          ? "Passwords do not match"
          : "",
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);

    try {
      await register(form);
      navigate("/login", {
        replace: true,
        state: { message: "Account created. You can now sign in." },
      });
    } catch (err) {
      setMessage(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function fieldClass(name) {
    return `w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none focus:border-black ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-sm">
        <Link to="/login" className="text-lg font-bold tracking-tight">
          account<span className="text-gray-400">.</span>
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          Create an account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your details to get started.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              className={fieldClass("fullName")}
              placeholder="John Doe"
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={updateField}
              onBlur={handleUsernameBlur}
              className={fieldClass("username")}
              placeholder="john_doe"
              autoComplete="username"
            />
            {checkingUsername && (
              <p className="mt-1 text-xs text-gray-500">Checking username...</p>
            )}
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              className={fieldClass("email")}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="flex rounded-md border border-gray-300 bg-white focus-within:border-black">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2.5 text-sm outline-none"
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={updateField}
              className={fieldClass("confirmPassword")}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || checkingUsername}
            className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", username: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.password.trim()) errs.password = "Password is required.";
    if (isLogin) {
      if (!form.username.trim()) errs.username = "Username is required.";
    } else {
      if (!form.name.trim()) errs.name = "Full name is required.";
      if (!form.username.trim()) errs.username = "Username is required.";
      if (!form.email.trim()) errs.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = "Invalid email format.";
      if (!form.confirmPassword.trim())
        errs.confirmPassword = "Please confirm your password.";
      else if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    let result: string | null = null;

    try {
      if (isLogin) {
        // Login
        result = await login(form.username, form.password);
      } else {
        // Register
        const uuid = crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15);
        const today = new Date().toISOString().split("T")[0];
        const status = "active";

        result = await register(
          uuid,
          form.name,
          form.email,
          form.password,
          today,
          status,
          form.username
        );
      }

      if (result) {
        const newErrors: any = {};
        if (result.toLowerCase().includes("username")) newErrors.username = result;
        else if (result.toLowerCase().includes("password")) newErrors.password = result;
        else if (result.toLowerCase().includes("email")) newErrors.email = result;
        else newErrors.form = result;
        setErrors(newErrors);
        return;
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: isLogin ? "Login successful!" : "Account created successfully!",
        life: 2000,
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Auth error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground px-3 py-5">
      <Toast ref={toast} />
      <Card
        className="w-full sm:w-20rem md:w-25rem lg:w-30rem p-4 shadow-4 border-round-2xl"
        title={
          <h2 className="text-center m-0 text-2xl font-semibold text-primary">
            {isLogin ? "Logon" : "Create an Account"}
          </h2>
        }
      >
        <div className="flex flex-column gap-4 mt-3">
          {!isLogin && (
            <>
              {/* Name */}
              <div className="flex flex-column gap-2">
                <label htmlFor="name" className="font-medium text-900">
                  Full Name
                </label>
                <InputText
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={classNames("w-full", { "p-invalid": !!errors.name })}
                />
                {errors.name && <small className="p-error">{errors.name}</small>}
              </div>

              {/* Email */}
              <div className="flex flex-column gap-2">
                <label htmlFor="email" className="font-medium text-900">
                  Email Address
                </label>
                <InputText
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={classNames("w-full", { "p-invalid": !!errors.email })}
                />
                {errors.email && <small className="p-error">{errors.email}</small>}
              </div>
            </>
          )}

          {/* Username */}
          <div className="flex flex-column gap-2">
            <label htmlFor="username" className="font-medium text-900">
              Username
            </label>
            <InputText
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={classNames("w-full", { "p-invalid": !!errors.username })}
            />
            {errors.username && <small className="p-error">{errors.username}</small>}
          </div>

          {/* Password */}
          <div className="flex flex-column gap-2 relative">
            <label htmlFor="password" className="font-medium text-900">
              Password
            </label>
            <Password
              id="password"
              name="password"
              value={form.password}
              feedback={false}
              toggleMask
              placeholder="Enter your password"
              onChange={handleChange}
              inputClassName={classNames("w-full", { "p-invalid": !!errors.password })}
              className="w-full"
            />
            {errors.password && <small className="p-error">{errors.password}</small>}
            {isLogin && (
              <small
                className="text-blue-600 cursor-pointer mt-1 inline-block"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </small>
            )}
          </div>

          {/*Confirm Password */}
          {!isLogin && (
            <div className="flex flex-column gap-2 relative">
              <label htmlFor="confirmPassword" className="font-medium text-900">
                Confirm Password
              </label>
              <Password
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                feedback={false}
                toggleMask
                placeholder="Confirm your password"
                onChange={handleChange}
                inputClassName={classNames("w-full", { "p-invalid": !!errors.confirmPassword })}
                className="w-full"
              />
              {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
            </div>
          )}

          {errors.form && (
            <div className="text-center">
              <small className="p-error">{errors.form}</small>
            </div>
          )}

          {/* Submit */}
          <Button
            label={isLogin ? "Logon" : "Register"}
            onClick={handleSubmit}
            className="curved-button"
          />

          <div className="flex justify-content-center">
            <span className="pr-2">
              {
                isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"
              }
            </span>

            <Button
              link
              label={
                isLogin
                  ? "Register here"
                  : "Logon here"
              }
              onClick={() => {
                setIsLogin(!isLogin);
                setForm({ name: "", email: "", password: "", username: "", confirmPassword: "" });
                setErrors({});
              }}
              className="text-sm text-primary p-0"
            />
          </div>
        </div>
      </Card>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default AuthPage;
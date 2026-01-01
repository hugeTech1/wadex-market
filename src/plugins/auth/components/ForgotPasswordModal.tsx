import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface ForgotPasswordModalProps {
  visible: boolean;
  onHide: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onHide }) => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useRef<Toast>(null);

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Email is required", life: 3000 });
      return;
    }

    // Check if email exists in users stored in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Email not found", life: 3000 });
      return;
    }

    // Proceed to password reset step
    setStep("reset");
  };

  const handlePasswordReset = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Please fill all password fields", life: 3000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Passwords do not match", life: 3000 });
      return;
    }

    // Update user password in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      // If the user is logged in as this user, update loggedUser as well
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
      if (loggedUser && loggedUser.email === email) {
        loggedUser.password = newPassword;
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      }

      toast.current?.show({ severity: "success", summary: "Success", detail: "Password updated successfully. Please login again.", life: 3000 });
      // Clear states and close modal after a delay
      setTimeout(() => {
        setStep("email");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        onHide();
      }, 3000);
    } else {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Unexpected error occurred", life: 3000 });
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    onHide();
  };

  return (
    <Dialog header="Forgot Password" visible={visible} style={{ width: '30vw' }} modal onHide={handleClose}>
      <Toast ref={toast} />
      {step === "email" && (
        <div className="flex flex-column gap-3">
          <label htmlFor="forgot-email">Enter your email address:</label>
          <InputText
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />
          <Button label="Next" onClick={handleEmailSubmit} className="curved-button" />
        </div>
      )}

      {step === "reset" && (
        <div className="flex flex-column gap-3">
          <label htmlFor="new-password">New Password:</label>
          <Password
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            feedback={false}
            toggleMask
            placeholder="Enter new password"
          />

          <label htmlFor="confirm-password">Confirm New Password:</label>
          <Password
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            feedback={false}
            toggleMask
            placeholder="Re-enter new password"
          />

          <Button label="Reset Password" onClick={handlePasswordReset} className="curved-button" />
        </div>
      )}
    </Dialog>
  );
};

export default ForgotPasswordModal;
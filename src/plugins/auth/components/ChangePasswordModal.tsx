import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { editUser } from "../services/auth.service";

interface ChangePasswordModalProps {
    visible: boolean;
    onHide: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    onHide,
}) => {
    const { user, logout } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!visible) {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setLoading(false);
        }
    }, [visible]);


    // const validatePassword = (pass: string) => {
    //     const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    //     return strongRegex.test(pass);
    // };

    const handleChangePassword = async () => {
        if (!user) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "User not found!",
                life: 3000,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Passwords do not match.",
                life: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await editUser(user, oldPassword, newPassword);

            if (response.status === "OK") {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Password changed successfully!",
                    life: 2000,
                });

                onHide();
                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, 2000);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to update password. Please try again.",
                    life: 3000,
                });
            }
        } catch (err: any) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail:
                    err?.response?.data?.error?.message ||
                    "Something went wrong while changing password.",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Change Password"
            visible={visible}
            style={{ width: "20rem" }}
            modal
            onHide={onHide}
        >
            <Toast ref={toast} />
            <div className="flex flex-column gap-3 mt-3 p-fluid">
                <Password
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Old Password"
                    toggleMask
                    feedback={false}
                />
                <Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    toggleMask
                    feedback={false}
                />
                <Password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    toggleMask
                    feedback={false}
                />
                <Button
                    label="Change Password"
                    loading={loading}
                    onClick={handleChangePassword}
                    className="curved-button"
                />
            </div>
        </Dialog>
    );
};

export default ChangePasswordModal;
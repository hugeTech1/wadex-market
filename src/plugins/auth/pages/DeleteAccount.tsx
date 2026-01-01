import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { delUser } from "../services/auth.service";

const DeleteAccount: React.FC = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    if (!user) return <Navigate to="/auth" replace />;

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await delUser(user.site_users_uuid);

            if (response.status === "OK") {
                toast.current?.show({
                    severity: "success",
                    summary: "Account Deleted",
                    detail: "Your account has been deleted successfully.",
                    life: 2000,
                });

                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, 2000);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to delete account. Please try again.",
                    life: 3000,
                });
            }
        } catch (err: any) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail:
                    err?.response?.data?.error?.message ||
                    "Something went wrong while deleting your account.",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen surface-ground px-3 py-5">
            <Toast ref={toast} />
            <Card
                title="Delete Account"
                className="w-full sm:w-20rem md:w-25rem lg:w-30rem shadow-3"
            >
                <div className="text-red-600 font-semibold mb-3">
                    ⚠️ Warning: This action is <u>irreversible</u>. All your data will be permanently deleted.
                </div>
                <div className="flex flex-column gap-3">
                    <Button
                        label="Delete My Account"
                        severity="danger"
                        onClick={handleDelete}
                        loading={loading}
                        className="w-full"
                    />
                </div>
            </Card>
        </div>
    );
};

export default DeleteAccount;
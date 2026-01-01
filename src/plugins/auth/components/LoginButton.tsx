import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { NavLink, useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";

interface LoginButtonProps {
    mobile?: boolean;
    loginClicked?: () => void | undefined;
}

const LoginButton = ({ mobile = false, loginClicked }: LoginButtonProps) => {

    const [showChangePassword, setShowChangePassword] = useState(false);
    const { user, logout } = useAuth();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const navigate = useNavigate();

    return (
        <>
            {(!mobile) && (user ? (
                <div className="relative">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.site_users_name)}&background=random`}
                        alt="avatar"
                        className="h-2rem w-2rem border-circle cursor-pointer"
                        onClick={() => setActiveDropdown(activeDropdown === -1 ? null : -1)}
                    />

                    {activeDropdown === -1 && (
                        <ul
                            className="absolute right-0 mt-2 bg-white shadow-3 list-none p-2 border-round w-12rem z-5"
                            onMouseEnter={() => setActiveDropdown(-1)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <li
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setShowChangePassword(true)
                                    setActiveDropdown(null);
                                }}
                            >
                                Change Password
                            </li>
                            <li
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setActiveDropdown(null);
                                    navigate("/delete-account")
                                }}
                            >
                                Delete Account
                            </li>

                            <li
                                className="p-2 cursor-pointer hover:bg-gray-100 text-red-500"
                                onClick={() => {
                                    logout();
                                    setActiveDropdown(null);
                                }}
                            >
                                Logout
                            </li>
                        </ul>
                    )}
                </div>
            ) : (
                <NavLink to={"/login"} className="text-white no-underline">Login</NavLink>
            ))}

            {(mobile) && (user ? (
                <>
                    {/* Avatar and name */}
                    <div className="flex align-items-center gap-2 p-2">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.site_users_name)}&background=random`}
                            alt="avatar"
                            className="h-2rem w-2rem border-circle"
                        />
                        <div className="text-sm font-medium">{user.site_users_name}</div>
                    </div>

                    {/* User actions */}
                    <ul className="list-none p-0 m-0 mt-2 flex flex-column gap-2">
                        <li
                            className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                setShowChangePassword(true);
                                loginClicked?.();
                            }}
                        >
                            Change Password
                        </li>
                        <li
                            className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                loginClicked?.();
                                navigate("/delete-account");
                            }}
                        >
                            Delete Account
                        </li>
                        <li
                            className="p-2 text-sm cursor-pointer text-red-500 hover:bg-gray-100"
                            onClick={() => {
                                logout();
                                loginClicked?.();
                            }}
                        >
                            Logout
                        </li>
                    </ul>
                </>
            ) : (
                <Button
                    label="Login"
                    text
                    onClick={() => {
                        loginClicked?.();
                        navigate("/login");
                    }}
                    className="w-full curved-button"
                />
            ))}

            <ChangePasswordModal
                visible={showChangePassword}
                onHide={() => setShowChangePassword(false)}
            />
        </>
    )
};

export default LoginButton;
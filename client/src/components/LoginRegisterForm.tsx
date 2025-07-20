import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Spinner from "./Spinner";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/zustand";

interface FormData {
    username: string;
    password: string;
}

interface LoginRegisterFormProps {
    formType: string;
}

const LoginRegisterForm = ({ formType }: LoginRegisterFormProps) => {
    const { setAccessToken } = useAuthStore((state) => state);
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: async (formData: FormData): Promise<string> => {
            setFormData({ username: "", password: "" });
            const res = await axios.post(
                `/api/auth/${formType.toLowerCase()}`,
                formData
            );
            return res.data;
        },
        onSuccess: (data) => {
            setAccessToken(data);
            if (formType === "Login") navigate("/dashboard");
            else navigate("/login");
        },
    });

    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
    });

    const inputClass: string =
        "px-5 py-3 bg-gray-800 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700";
    const buttonClass: string =
        "px-5 py-3 bg-blue-500 hover:bg-blue-700 rounded transition-colors cursor-pointer w-full disabled:bg-gray-500 disabled:cursor-default";

    const usernameInput = (
        <input
            type="text"
            className={inputClass}
            placeholder="username..."
            value={formData.username}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    username: e.target.value,
                })
            }
            disabled={mutation.isPending}
        />
    );

    const passwordInput = (
        <input
            type="password"
            className={inputClass}
            placeholder="password..."
            value={formData.password}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    password: e.target.value,
                })
            }
            disabled={mutation.isPending}
        />
    );

    const submitButton = (
        <button
            type="submit"
            className={buttonClass}
            onClick={() => mutation.mutate(formData)}
            disabled={mutation.isPending}
        >
            {!mutation.isPending ? (
                formType
            ) : (
                <span className="flex items-center justify-center">
                    <Spinner />
                </span>
            )}
        </button>
    );

    return (
        <form className="flex items-center justify-center h-screen w-full">
            <div className="flex flex-col gap-4 items-center justify-center h-screen w-[40%] text-white text-2xl">
                <span className="mb-10 text-3xl">{formType}</span>
                {usernameInput}
                {passwordInput}

                {mutation.isError && (
                    <span className="text-red-500 text-lg self-start">
                        {mutation.error instanceof AxiosError
                            ? mutation.error.response?.data?.detail
                            : "Internal server error"}
                    </span>
                )}

                {submitButton}
                <Link className={buttonClass + " text-center"} to={"/"}>
                    Home
                </Link>
            </div>
        </form>
    );
};

export default LoginRegisterForm;

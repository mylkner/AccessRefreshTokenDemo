import { useState } from "react";
import { Link } from "react-router";

interface FormData {
    username: string;
    password: string;
}

interface LoginRegisterFormProps {
    formType: string;
}

const LoginRegisterForm = ({ formType }: LoginRegisterFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
    });

    const inputClass: string =
        "px-5 py-3 bg-gray-800 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
    const buttonClass: string =
        "px-5 py-3 bg-blue-500 hover:bg-blue-700 rounded transition-colors cursor-pointer w-full";

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="flex flex-col gap-4 items-center justify-center h-screen w-[40%] text-white text-2xl">
                <span className="mb-10 text-3xl">{formType}</span>
                <input
                    className={inputClass}
                    placeholder="username..."
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                    }
                />
                <input
                    className={inputClass}
                    placeholder="password..."
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />
                <button
                    type="submit"
                    className={buttonClass}
                    onClick={() => {
                        console.log("Form submitted:", formData);
                    }}
                >
                    {formType}
                </button>
                <Link className={buttonClass + " text-center"} to={"/"}>
                    Home
                </Link>
            </div>
        </div>
    );
};

export default LoginRegisterForm;

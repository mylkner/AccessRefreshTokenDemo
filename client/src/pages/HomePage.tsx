import { Link } from "react-router";

const HomePage = () => {
    const linkClass: string =
        "w-[40%] text-center px-5 py-3 bg-blue-500 hover:bg-blue-700 rounded transition-colors cursor-pointer";

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen w-full text-white text-2xl">
            <span className="mb-10 text-3xl">
                Access and Refresh Token Demo
            </span>
            <Link className={linkClass} to={"/login"}>
                Login
            </Link>
            <Link className={linkClass} to={"/register"}>
                Register
            </Link>
        </div>
    );
};

export default HomePage;

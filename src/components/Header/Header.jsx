import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import "./Header.css";

import { GoCheckCircleFill } from "react-icons/go";
import { RiAdminFill } from "react-icons/ri";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import { FaPowerOff } from "react-icons/fa6";
import logo from '../../assets/logo.svg'

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isAdmin = user?.user?.user?.role;

    const handleLogout = async () => {
        dispatch(logout());
        navigate("/login");
    };


    return (
        <>
            <div className="header-container bg-sky-700 m-5 p-5 rounded-xl flex flex-col items-center w-1/6">
                <div className="image-logo h-20 w-20 bg-white rounded-full p-2"  >
                    <img src={logo}
                    alt="" />
                </div>
                <nav className="w-full">
                    <div className="w-full">
                        <NavLink className={({isActive})=>isActive?"w-full flex justify-center bg-white rounded-full text-sky-700 my-5":"w-full flex justify-center text-white my-5"} to="/checkin">
                            <span className="flex items-center p-2">
                                <pre className="mx-1 text-lg"><GoCheckCircleFill /></pre>
                                <pre className="mx-1 text-lg">Check in!</pre>
                            </span>
                        </NavLink>
                        <NavLink className={({isActive})=>isActive?"w-full flex justify-center bg-white rounded-full text-sky-700 my-5":"w-full flex justify-center text-white my-5"} to="/dashboard" end>
                            <span className="flex items-center p-2">
                                <pre className="mx-1 text-lg"><RiDashboardLine /></pre>
                                <pre className="mx-1 text-lg">Attendance</pre>
                            </span>
                        </NavLink>
                        {isAdmin === "admin" && (
                            <NavLink
                                className={({isActive})=>isActive?"w-full flex justify-center bg-white rounded-full text-sky-700 my-5":"w-full flex justify-center text-white my-5"} to="/dashboard/admin">
                                <span className="flex items-center p-2">
                                    <pre className="mx-1 text-lg"><RiAdminFill /></pre>
                                    <pre className="mx-1 text-lg">Admin</pre>
                                </span>
                            </NavLink>
                        )}
                    </div>
                    <div className="nav-right">
                            <NavLink id="logout" className={({isActive})=>isActive?"w-full flex justify-center bg-white rounded-full text-sky-700 my-5":"w-full flex justify-center text-white my-5"} to="/login" onClick={handleLogout}>
                                <span className="flex items-center p-2">
                                    <span className="mx-1 text-lg">Log Out</span>
                                    <span className="mx-1 text-lg"><HiOutlineLogout /></span>
                                </span>
                            </NavLink>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Header;

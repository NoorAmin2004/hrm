import { useState, useEffect } from "react";
import "./Checkin.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axiosInstance from "../../auth/axiosInstance";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Checkin = () => {
    const [status, setStatus] = useState("");
    const [loading, setloading] = useState(true)

    const handleCheck = async () => {
        try {
            const response = await axiosInstance({
                url: `${apiUrl}/api/check`,
                method: "post",
            });

            console.log(response);
            toast.success(response.data.message);
            setStatus(response.data.status);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };

    const handleBreak = async () => {
        try {
            const response = await axiosInstance({
                url: `${apiUrl}/api/break`,
                method: "post",
            });
            console.log(response);
            setStatus(response.data.status);
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const getStatus = async () => {
            const response = await axiosInstance({
                method: "get",
                url: `${apiUrl}/api/getstatus`,
            });
            console.log(response);
            setStatus(response.data.status);
            setloading(false)
        };
        getStatus();
    }, []);

    const CheckButtons = () => {
        return (<>
            <button onClick={handleCheck}>{status === "checkin" || status === "inbreak" ? "check out" : "check in"}</button>
            {status === "checkout" ? null : (<button onClick={handleBreak}>{status === "checkin" ? "break in" : "break out"}</button>)}
        </>)
    }

    return (
        <div className="check-container">

            <div className="check-buttons">
                {loading ? <div className="smallLoaderContainer"><div className="loader"></div></div> : <CheckButtons />}
            </div>
        </div>
    );
};

export default Checkin;

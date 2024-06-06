import { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Progress.css";
import { useSelector, useDispatch } from "react-redux";

import { IoMenuOutline } from "react-icons/io5";

import { toggleSidebar } from '../../Redux/toggleSidebar';
import axiosInstance from "../../auth/axiosInstance";


const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AttendanceSheet = () => {
    const user = useSelector((state) => state.user);
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setloading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const dispatch = useDispatch();

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
        // console.log(isSidebarOpen)
    };

    const accessToken = user?.user?.accessToken || "";

    function millisecondsToHMS(milliseconds) {
        const date = new Date(milliseconds);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");

        return !isNaN(hours) ? `${hours}:${minutes}:${seconds}` : 'N/a';
    }

    function millisecondsTo12HourFormat(milliseconds) {
        const date = new Date(milliseconds);
        // Adjust to Pakistani timezone (UTC+5)
        const timezoneOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
        const pakistaniTime = new Date(date.getTime() + timezoneOffset);

        let hours = pakistaniTime.getUTCHours();
        const minutes = pakistaniTime.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
    }

    useEffect(() => {
        const getEmployeeData = async () => {
            try {
                const response = await axiosInstance({
                    url: `${apiUrl}/api/getUserAttendance`,
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        from: fromDate ? new Date(fromDate).getTime() : undefined,
                        to: toDate ? new Date(toDate).getTime() : undefined,
                    }
                });
                console.log(response);

                const transformedData = response.data.result.map((item) => ({
                    ...item,
                    formattedDate: new Date(item.date).toLocaleString(),
                    formattedCheckIn: millisecondsTo12HourFormat(item.checkIn),
                    formattedCheckOut: millisecondsTo12HourFormat(item.checkOut),
                    formattedBreakDuration: millisecondsToHMS(
                        item.breakDuration
                    ),
                    formattedNetDuration: millisecondsToHMS(item.netDuration),
                    formattedTotalDuration: millisecondsToHMS(
                        item.totalDuration
                    ),
                }));

                setEmployeeData(transformedData);
                setloading(false)
            } catch (error) {
                console.error(error);
            }
        };
        getEmployeeData();
    }, [accessToken, fromDate, toDate]);

    const netDurationBodyTemplate = (rowData) => {
        return <span>{rowData.formattedNetDuration}</span>;
    };
    const checkInBodyTemplate = (rowData) => {
        return <span>{rowData.formattedCheckIn}</span>;
    };
    const dateBodyTemplate = (rowData) => {
        return <span>{rowData.formattedDate}</span>;
    };
    const checkOutBodyTemplate = (rowData) => {
        return <span>{rowData.formattedCheckOut}</span>;
    };

    const breakDurationBodyTemplate = (rowData) => {
        return <span>{rowData.formattedBreakDuration}</span>;
    };

    const totalDurationBodyTemplate = (rowData) => {
        return <span>{rowData.formattedTotalDuration}</span>;
    };

    useEffect(() => {
        console.log("hello");
        let res = millisecondsToHMS(1716979884244);
        console.log(res);
    }, []);

    return (
        <div className="sheet-container">
            <h1 style={{ textAlign: "center" }}> <span className="heading-attendance" >Attendance Sheet</span> <span className="menu-bar" onClick={handleToggleSidebar} ><IoMenuOutline /></span> </h1>

            <div className="progress-mini-container" >
                <div className="date-filters">
                    <label>
                        From : &nbsp;
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </label>
                    <label>
                        To :  &nbsp;
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </label>
                </div>
                {
                    loading ? <div className="loaderContainer"><div className="loader"></div></div> :
                        <DataTable
                            id="datatable-container-user"
                            value={employeeData}
                            tableStyle={{
                                minWidth: "30rem",
                                maxWidth: "100%",
                                margin: "auto",
                            }}
                            paginator
                            rows={30}
                            sortField="_id"
                            sortOrder={1}>
                            <Column body={dateBodyTemplate} header="Date"></Column>
                            <Column
                                body={checkInBodyTemplate}
                                header="Check In"></Column>
                            <Column
                                body={checkOutBodyTemplate}
                                header="Check Out"></Column>
                            <Column
                                body={breakDurationBodyTemplate}
                                header="Break Duration"></Column>
                            <Column
                                body={totalDurationBodyTemplate}
                                header="Total Duration"></Column>
                            <Column
                                body={netDurationBodyTemplate}
                                header="Net Duration"></Column>
                        </DataTable>}
            </div>
        </div>
    );
};

export default AttendanceSheet;

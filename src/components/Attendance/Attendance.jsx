import { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Attendance.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../auth/axiosInstance";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Attendance = () => {
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const { id } = useParams(); // Extracting id from the URL parameters

    const accessToken = user?.user?.accessToken || "";

    function millisecondsToHMS(milliseconds) {
        const date = new Date(milliseconds);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");

        return isNaN(hours) ? "N/a" : `${hours}:${minutes}:${seconds}`;
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
                    url: `${apiUrl}/api/admin/getUserAttendance`,
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        userId: id, // Sending the id as a query parameter
                        from: fromDate ? new Date(fromDate).getTime() : undefined,
                        to: toDate ? new Date(toDate).getTime() : undefined,
                    },
                });
                console.log(response);

                const transformedData = response.data.result.map((item) => ({
                    ...item,
                    formattedDate: new Date(item.date).toLocaleString(),
                    formattedCheckIn: millisecondsTo12HourFormat(item.checkIn),
                    formattedCheckOut: millisecondsTo12HourFormat(item.checkOut),
                    formattedBreakDuration: millisecondsToHMS(item.breakDuration),
                    formattedNetDuration: millisecondsToHMS(item.netDuration),
                    formattedTotalDuration: millisecondsToHMS(
                        item.totalDuration
                    ),
                }));

                setEmployeeData(transformedData);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        getEmployeeData();
    }, [accessToken, id, fromDate, toDate]); // Include fromDate and toDate in the dependency array

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

    return (
        <div className='sheet-container'>
            <h1 style={{ textAlign: 'center' }}>ATTENDANCE SHEET</h1>

            <div className="mini-container-attendance"  >
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
                {loading ? <div className="loaderContainer"><div className="loader"></div></div>
                    : <DataTable
                        id="datatable-container-user"
                        value={employeeData}
                        tableStyle={{
                            minWidth: "30rem",
                            maxWidth: "80%",
                            margin: "auto",
                        }}
                        paginator
                        rows={30}
                        sortField="_id"
                        sortOrder={1}
                    >
                        <Column body={dateBodyTemplate} header="DATE"></Column>
                        <Column body={checkInBodyTemplate} header="Check IN"></Column>
                        <Column body={checkOutBodyTemplate} header="CHECK OUT"></Column>
                        <Column body={breakDurationBodyTemplate} header="BREAK DOWN"></Column>
                        <Column body={totalDurationBodyTemplate} header="TOTAL DURATION"></Column>
                        <Column body={netDurationBodyTemplate} header="NET DURATION"></Column>
                    </DataTable>}
            </div>
        </div>
    );
};

export default Attendance;

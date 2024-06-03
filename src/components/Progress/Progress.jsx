import { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Progress.css";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AttendanceSheet = () => {
    const user = useSelector((state) => state.user);
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setloading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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
                const response = await axios({
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
        return <span className="text-center">{rowData.formattedNetDuration}</span>;
    };
    const checkInBodyTemplate = (rowData) => {
        return <span className="text-center">{rowData.formattedCheckIn}</span>;
    };
    const dateBodyTemplate = (rowData) => {
        return <span className="text-center">{rowData.formattedDate}</span>;
    };
    const checkOutBodyTemplate = (rowData) => {
        return <span className="text-center">{rowData.formattedCheckOut}</span>;
    };

    const breakDurationBodyTemplate = (rowData) => {
        return <span className="text-center">{rowData.formattedBreakDuration}</span>;
    };

    const totalDurationBodyTemplate = (rowData) => {
        return <span className="text-center">{rowData.formattedTotalDuration}</span>;
    };

    useEffect(() => {
        console.log("hello");
        let res = millisecondsToHMS(1716979884244);
        console.log(res);
    }, []);

    console.log(employeeData)

    return (
        <div className="sheet-container w-full">
            <h1 className="w-full bg-white text-sky-700 my-5 text-center rounded-lg p-2 font-bold text-xl">Attendance Sheet</h1>

            <div className="bg-white p-5 rounded-lg" >
            <div className="date-filters my-2 flex">
                <div className="border-slate-400 border-2 w-1/6 rounded-lg mx-2">
                    <label className="mx-2">
                        From :
                    </label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="border-slate-400 border-2 w-1/6 rounded-lg mx-2">
                    <label className="mx-2">
                        To :
                    </label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
            </div>
                {
                    loading ? <div className="loaderContainer"><div className="loader"></div></div> :
                        // <DataTable id="datatable-container-user" value={employeeData} paginator rows={30} sortField="_id" sortOrder={1} className="" >
                        //     <Column body={dateBodyTemplate} header="Date"></Column>
                        //     <Column body={checkInBodyTemplate} header="Check In"></Column>
                        //     <Column body={checkOutBodyTemplate} header="Check Out"></Column>
                        //     <Column body={breakDurationBodyTemplate} header="Break Duration"></Column>
                        //     <Column body={totalDurationBodyTemplate} header="Total Duration"></Column>
                        //     <Column body={netDurationBodyTemplate} header="Net Duration"></Column>
                        // </DataTable>
                        <table className="min-w-full rounded">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Date
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Check In
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Check Out
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Break Duration
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Total Duration
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                Net Duration
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((element)=>{
                                return(
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" key={element.date}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{element.date}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {element.checkIn}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {element.checkOut}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {element.breakDuration}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {element.totalDuration}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {element.netDuration}
                                </td>
                            </tr>
                            )})}
                        </tbody>
                        </table>
                    }
            </div>
        </div>
    );
};

export default AttendanceSheet;

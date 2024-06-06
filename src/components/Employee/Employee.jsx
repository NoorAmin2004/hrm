import { useEffect, useState } from "react";
import "./Employee.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import axiosInstance from "../../auth/axiosInstance";


const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Employee = () => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const [allEmployee, setAllEmployee] = useState([]);
    const [loading, setLoading] = useState(true)
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const accessToken = user?.user?.accessToken || "";

    useEffect(() => {
        const getAllUser = async () => {
            try {
                const response = await axiosInstance({
                    url: `${apiUrl}/api/admin/getAllUsers`,
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const dataAllEmployee = response.data;
                setAllEmployee(dataAllEmployee);
                setFilteredEmployees(dataAllEmployee);
                setLoading(false)
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };
        getAllUser();
    }, [accessToken]);

    const buttonForViewDetails = (rowData) => {
        const navigateUserdetail = () => {
            navigate(`attendance/${rowData._id}`);
        };
        return <button className={"attendanceButton"} onClick={navigateUserdetail}>Attendance</button>;
    };

    useEffect(() => {
        const getAllUser = async () => {
            try {
                const response = await axiosInstance({
                    url: `${apiUrl}/api/admin/getAllUsers`,
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log("response", response.data);
                const dataAllEmployee = response.data;
                setAllEmployee(dataAllEmployee);
                setFilteredEmployees(dataAllEmployee);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }
        getAllUser();
    }, [accessToken]);

    useEffect(() => {
        const results = allEmployee.filter(employee =>
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || employee.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(results);
    }, [searchTerm, allEmployee]);
    return (
        <>
            <div className='sheet-container-admin'>
                <div className="search-container">
                </div>
                <div>
                    <TextField
                    style={{
                        width:"300px",
                        marginLeft:"20px"
                       
                    }}
                        label="Search by Name & Email"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loading ? <div className="loaderContainer"><div className="loader"></div></div> :
                        <DataTable
                            id='datatable-container'
                            value={filteredEmployees}
                            tableStyle={{ minWidth: '50rem', maxWidth: '100%', margin: 'auto' }}
                            paginator
                            rows={30}
                            sortField="id"
                            sortOrder={1}>


                            <Column
                                field="firstName"
                                header="First Name"
                                sortable></Column>
                            <Column field="lastName" sortable header="Last Name"></Column>
                            <Column field="role" header="Role"></Column>
                            <Column field="phone" header="Phone"></Column>
                            <Column field="email" sortable header="Email"></Column>
                            <Column field="department" header="Department"></Column>
                            <Column
                                field="designation"
                                header="Designation"></Column>
                            <Column field="shift" header="Shift"></Column>
                            <Column field="teamLead" header="Team Lead"></Column>
                            <Column
                                body={buttonForViewDetails}
                                header="Attendance"></Column>
                        </DataTable>}
                </div>
            </div>
        </>
    );
};

export default Employee;
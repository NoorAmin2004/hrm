import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Signup.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
import { MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import axiosInstance from '../../auth/axiosInstance';
// import env from '../../../env';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Signup = () => {
    const user = useSelector(state => state.user);

    const admin_token = user?.user?.accessToken || '';
    const config_admin = {
        headers: { Authorization: `Bearer ${admin_token}` }
    };

    useEffect(() => {
        console.log(admin_token);
    }, [admin_token]);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const onSubmit = async (data) => {
        try {
            let { email, password, firstName, lastName, DOB, CNIC, designation, phone, teamLead, shift, department, role } = data;
            CNIC = Number(CNIC);
            console.log(CNIC);
            console.log(DOB)

            const response = await axiosInstance.post(`${apiUrl}/api/admin/register`, {
                email,
                password,
                firstName,
                lastName,
                DOB,
                CNIC,
                designation,
                phone,
                teamLead,
                shift,
                department,
                role
            }, config_admin);

            console.log(response);
            toast.success("User Registered Successfully", { position: "top-center" });
            console.log(response.data);
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to sign up", { position: "top-center" });
            console.log(error.message);
        }
    };

    return (
        <div className="form-container-register">
            <div className='form-register'>
                <h1 className="register-heading">Register New Employee</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="First Name"
                                id="firstName"
                                variant="outlined"
                                fullWidth
                                {...register('firstName', { required: "First Name is required" })}
                                error={!!errors.firstName}
                                helperText={errors.firstName ? errors.firstName.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <TextField
                                label="Last Name"
                                id="lastName"
                                variant="outlined"
                                fullWidth
                                {...register('lastName', { required: "Last Name is required" })}
                                error={!!errors.lastName}
                                helperText={errors.lastName ? errors.lastName.message : ''}
                            />
                        </div>
                    </div>

                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="Email"
                                id="email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                {...register('email', { required: "Email is required" })}
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <TextField
                                label="Password"
                                id="password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                {...register('password', { required: "Password is required" })}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                            />
                        </div>
                    </div>

                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="Date of Birth"
                                id="DOB"
                                type="date"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                {...register('DOB', { required: "Date of Birth is required" })}
                                error={!!errors.DOB}
                                helperText={errors.DOB ? errors.DOB.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <TextField
                                label="ENTER CNIC WITHOUT ANY SPACE"
                                id="CNIC"
                                variant="outlined"
                                fullWidth
                                {...register('CNIC', { required: "CNIC is required" })}
                                error={!!errors.CNIC}
                                helperText={errors.CNIC ? errors.CNIC.message : ''}
                            />
                        </div>
                    </div>

                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="ENTER PHONE NO. WITHOUT ANY SPACE"
                                id="phone"
                                variant="outlined"
                                fullWidth
                                {...register('phone', { required: "Phone Number is required" })}
                                error={!!errors.phone}
                                helperText={errors.phone ? errors.phone.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <TextField
                                label="Designation"
                                id="designation"
                                variant="outlined"
                                fullWidth
                                {...register('designation', { required: "Designation is required" })}
                                error={!!errors.designation}
                                helperText={errors.designation ? errors.designation.message : ''}
                            />
                        </div>
                    </div>

                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="Team Lead"
                                id="teamLead"
                                variant="outlined"
                                fullWidth
                                {...register('teamLead', { required: "Team Lead is required" })}
                                error={!!errors.teamLead}
                                helperText={errors.teamLead ? errors.teamLead.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="shift-label">Shift</InputLabel>
                                <Select
                                    labelId="shift-label"
                                    id="shift"
                                    label="Shift"
                                    defaultValue=""
                                    {...register('shift', { required: "Shift is required" })}
                                    onChange={(e) => setValue('shift', e.target.value)}
                                    error={!!errors.shift}
                                >
                                    <MenuItem value="morning">Morning</MenuItem>
                                    <MenuItem value="evening">Evening</MenuItem>
                                    <MenuItem value="night">Night</MenuItem>
                                </Select>
                                {errors.shift && <p className="error">{errors.shift.message}</p>}
                            </FormControl>
                        </div>
                    </div>

                    <div className="input-row-register">
                        <div className='child-row'>
                            <TextField
                                label="Department"
                                id="department"
                                variant="outlined"
                                fullWidth
                                {...register('department', { required: "Department is required" })}
                                error={!!errors.department}
                                helperText={errors.department ? errors.department.message : ''}
                            />
                        </div>
                        <div className='child-row'>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    label="Role"
                                    defaultValue=""
                                    {...register('role', { required: "Employee Role is required" })}
                                    onChange={(e) => setValue('role', e.target.value)}
                                    error={!!errors.role}
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                {errors.role && <p className="error">{errors.role.message}</p>}
                            </FormControl>
                        </div>
                    </div>

                    <div className="register-btn">
                        <input type="submit" value="Sign up" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

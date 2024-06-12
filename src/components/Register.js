import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data);
            navigate('/login');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" name="username" value={username} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" value={password} onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;

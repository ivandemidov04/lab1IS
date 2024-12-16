import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const response = await fetch('http://localhost:8080/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Assuming the JWT token is in data.token
            const { token } = data;
            // Save the token to localStorage (or sessionStorage)
            localStorage.setItem('jwtToken', token);
            // console.log("token " + token)
            // Navigate to home page
            navigate('/home', { state: { username } });
        } else {
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register Page</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p>
                Already have an account? <a href="/auth/sign-in">Login</a>
            </p>
        </div>
    );
}

export default Register;

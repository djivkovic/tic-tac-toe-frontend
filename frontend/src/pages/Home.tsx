import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import '../css/home.css';

const Home = () => {
    const [username, setUsername] = useState('');
        useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token); 
            setUsername(decodedToken.username);
        }
    }, []);

    return (
        <>
            <h2 className='home-title'>Home Page</h2>
            <p>Welcome, {username} </p> 
        </>
    );
}

export default Home;

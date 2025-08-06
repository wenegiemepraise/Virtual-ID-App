import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Virtual ID App</h1>
            <p className="text-lg mb-8">Store your physical IDs securely and access them anytime, anywhere.</p>
            <div className="flex space-x-4">
                <Link to="/scan" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Scan ID</Link>
                <Link to="/account" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">My Account</Link>
                <Link to="/register" className="text-blue-500 underline">Create an Account</Link>
            </div>
        </div>
    );
};

export default Home;
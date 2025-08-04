import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Virtual ID App</h1>
            <p className="text-lg mb-8">Store your physical IDs securely and access them anytime, anywhere.</p>
            <div className="flex space-x-4">
                <a href="/scan" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Scan ID</a>
                <a href="/account" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">My Account</a>
            </div>
        </div>
    );
};

export default Home;
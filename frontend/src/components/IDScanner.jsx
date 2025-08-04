import React, { useState } from 'react';

const IDScanner = () => {
    const [idImage, setIdImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = () => {
        // Logic to handle the scanning of the ID
        // This could involve sending the image to the backend for processing
        console.log('Scanning ID:', idImage);
    };

    return (
        <div className="id-scanner">
            <h2 className="text-lg font-bold">Scan Your ID</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {idImage && (
                <div className="preview">
                    <img src={idImage} alt="ID Preview" className="mt-2" />
                </div>
            )}
            <button onClick={handleScan} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Scan ID
            </button>
        </div>
    );
};

export default IDScanner;
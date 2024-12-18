// This is the Loading Screen Component which is shown when the table component is in the loading state

import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner'; 
import './comp.css'; 


interface LoadingScreenProps {
    message?: string; 
}


const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-screen">
            <ProgressSpinner />
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default LoadingScreen;

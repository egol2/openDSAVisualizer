import '../styles/Styles.css'
import React from 'react';

export const DOMAIN = "localhost"
export const BACKEND_PORT = "8000"

const Header = () => {
    return (
        <h1 className='header'>OpenDSA Data Visualizer</h1>
    );
}

export default Header;
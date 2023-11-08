import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

function NotFound() {
    return (
        <div>
            <div className="parent-not-found">
                <div className="not-found">
                    <h2 className="not-found-title">404 - Not Found</h2>
                    <p className="not-found-text">The page you are looking for does not exist.</p>
                    <p className="not-found-link">
                        <Link to="/" className="home-link">Back To Home Page</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
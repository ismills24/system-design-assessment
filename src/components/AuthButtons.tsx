// components/AuthButtons.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons: React.FC = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return isAuthenticated ? (
        <a
            onClick={() =>
                logout({
                    logoutParams: { returnTo: window.location.origin },
                })
            }
            className="block px-4 py-2 text-one hover:bg-one hover:text-white"
        >
            Logout
        </a>
    ) : (
        <a
            onClick={() => loginWithRedirect()}
            className="block px-4 py-2 text-one hover:bg-one hover:text-white"
        >
            Login
        </a>
    );
};

export default AuthButtons;

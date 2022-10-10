import React, { createContext, useContext, useEffect, useState } from 'react';
import instance from '../services/axios'
import { useCommon } from './CommonContext';

const AuthContext = createContext(null);

export const Constants = {
    TOKEN: 'token',
    USER_NAME: 'user_name',
    USER_ID: 'user_id'
}

export function AuthProvider({ children }) {
    const { setCommon } = useCommon();

    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(Constants.TOKEN);
        if (token) {
            setAuth(prevState => ({ ...prevState, token }));
        }
    }, []);

    const logIn = async (credentials, callback) => {
        try {
            const response = await instance.post(
                '/auth/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            localStorage.setItem(Constants.TOKEN, response.data.data.token);
            localStorage.setItem(Constants.USER_ID, response.data.data.user.id);
            localStorage.setItem(Constants.USER_NAME, response.data.data.user.username);
            setAuth(prevState => ({ ...prevState, user: response.data.data.user, token: response.data.data.token }));
            callback();
        } catch (error) {
            setCommon(prevState => ({ ...prevState, errorMessages: error.response.data.message, isOpen: true }))
        }
    };

    const logOut = (callback) => {
        localStorage.removeItem(Constants.TOKEN)
        localStorage.removeItem(Constants.USER_ID)
        localStorage.removeItem(Constants.USER_NAME)
        callback();
    }

    const value = { auth, logIn, logOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
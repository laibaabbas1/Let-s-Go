import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // start  mein hi token ko localStorage se le lenge
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // App load hotay waqt check krna  ke token hai ya nahi
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            //localstorage se data lenge
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken); // Token ko state mein set kia hai
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken) => { // yhn token ko userToken ke trh istemal kren ge
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(userToken); // Token state ko bhi update karn
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null); // Token state ko bhi clear krna
    };

    // Ab user ke saath token bhi poori application mein available hoga
    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
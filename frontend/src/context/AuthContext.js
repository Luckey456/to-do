import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem('authToken'));

  const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuth(token);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

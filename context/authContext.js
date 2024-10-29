import React, { createContext, useContext } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {


  return (
    <AuthContext.Provider value={{  }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    console.log('UserContext: Loading user from localStorage:', loggedInUser);
    if (loggedInUser) {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        console.log('UserContext: Parsed user data:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('UserContext: Error parsing user data:', error);
        localStorage.removeItem('loggedInUser');
      }
    } else {
      console.log('UserContext: No user found in localStorage');
      // Don't automatically create test user - let user register/login properly

      // Clear any old test user data that might exist
      const oldTestUser = localStorage.getItem('username');
      if (oldTestUser) {
        console.log('UserContext: Clearing old test user data');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
      }
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [user]);

  const login = (userData) => {
    console.log('UserContext: Login called with data:', userData);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('volunteerData');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return React.createElement(
    UserContext.Provider,
    { value: value },
    children
  );
};

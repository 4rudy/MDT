import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const MDTContext = createContext();
const ThemeContext = createContext();

export const useMDTContext = () => useContext(MDTContext);
export const useTheme = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw new Error('useTheme must be used within an MDTProvider');
    }
    return themeContext;
};

export const MDTProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const fetchProfiles = () => {
        fetch("http://localhost:5000/profiles")
            .then((response) => response.json())
            .then((data) => setProfiles(data))
            .catch((error) => console.error('Error fetching profiles:', error));
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const MDTContextValue = {
        profiles,
        selectedProfile,
        setSelectedProfile,
        fetchProfiles,
    };

    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const themeContextValue = {
        darkMode,
        toggleDarkMode,
    };

    return (
        <MDTContext.Provider value={MDTContextValue}>
            <ThemeContext.Provider value={themeContextValue}>
                <MuiThemeProvider theme={theme}>
                    {children}
                </MuiThemeProvider>
            </ThemeContext.Provider>
        </MDTContext.Provider>
    );
};
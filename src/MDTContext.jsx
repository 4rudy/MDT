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
    const [vehicles, setVehicles] = useState([]);
    const [properties, setProperties] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    const fetchProfiles = () => {
        fetch("http://localhost:5000/profiles")
            .then((response) => response.json())
            .then((data) => setProfiles(data))
            .catch((error) => console.error('Error fetching profiles:', error));
    };

    const fetchVehicles = () => {
        fetch("http://localhost:5000/vehicles")
            .then((response) => response.json())
            .then((data) => setVehicles(data))
            .catch((error) => console.error('Error fetching vehicles:', error));
    };

    const fetchProperties = () => {
        fetch("http://localhost:5000/properties")
            .then((response) => response.json())
            .then((data) => setProperties(data))
            .catch((error) => console.error('Error fetching properties:', error));
    };

    const fetchBusinesses = () => {
        fetch("http://localhost:5000/businesses")
            .then((response) => response.json())
            .then((data) => setBusinesses(data))
            .catch((error) => console.error('Error fetching businesses:', error));
    };

    useEffect(() => {
        fetchProfiles();
        fetchVehicles();
        fetchProperties();
        fetchBusinesses();
    }, []);

    const MDTContextValue = {
        profiles,
        vehicles,
        properties,
        businesses,
        selectedProfile,
        selectedProperty,
        selectedBusiness,
        setProfiles,
        setProperties,
        setBusinesses,
        setSelectedProfile,
        setSelectedProperty,
        setSelectedBusiness,
        fetchProfiles,
        fetchVehicles,
        fetchProperties,
        fetchBusinesses,
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

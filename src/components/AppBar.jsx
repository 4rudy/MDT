import React, { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

function AppBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { darkMode, toggleDarkMode } = useTheme();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getDarkModeToggleLabel = () => {
        return darkMode ? 'Light Mode' : 'Dark Mode';
    };

    const handleSettingsClick = (action) => {
        if (action === 'toggleDarkMode') {
            toggleDarkMode();
        }
        handleCloseUserMenu();
    };

    const settings = [
        { label: 'Profile', path: '/profile' },
        { label: 'Account', path: '/account' },
        { label: getDarkModeToggleLabel(), action: 'toggleDarkMode' },
    ];

    return (
        <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 'none' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/dashboard">
                            <img src="src/assets/imgs/LSPD.webp" alt="logo" width="150px" height="150px" />
                        </Link>
                        <Typography variant="h6" noWrap component="div" sx={{ marginLeft: '16px' }}>
                            Mobile Database Terminal
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Guest" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.label} onClick={() => handleSettingsClick(setting.action)}>
                                    <Typography textAlign="center">
                                        {setting.label === 'Toggle Dark Mode' ? getDarkModeToggleLabel() : setting.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
}

export default AppBar;

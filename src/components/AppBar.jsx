import React, { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const settings = [
    { label: 'Profile', path: '/profile' },
    { label: 'Account', path: '/account' }
];

function CustomMenuItem({ to, label, onClose }) {
    return (
        <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem onClick={onClose}>
                <Typography textAlign="center">{label}</Typography>
            </MenuItem>
        </Link>
    );
}

function AppBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
                                <CustomMenuItem key={setting.label} to={setting.path} label={setting.label} onClose={handleCloseUserMenu} />
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
}

export default AppBar;

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useMDTContext } from '../../MDTContext';

import './Profiles.css';

function Profiles({ darkMode, toggleDarkMode }) {
    const { profiles, fetchProfiles } = useMDTContext();
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [imageLoading, setImageLoading] = useState(true);

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
        setImageLoading(true);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleInputChange = (e, field) => {
        setSelectedProfile((prevProfile) => ({
            ...prevProfile,
            [field]: e.target.value,
        }));
    };

    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        profile.csn.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex' }}>
            <div className="profiles-first-column" style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                <div className="stickey-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '30px' }}>Profiles</h2>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <div className="scroll-container">
                    {filteredProfiles.map(profile => (
                        <div key={profile.id} style={{ marginBottom: '8px' }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => handleProfileClick(profile)}
                                style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                            >
                                <div>{profile.name}</div>
                                <div>CSN: {profile.csn}</div>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="profiles-second-column">
                {selectedProfile && (
                    <>
                        <div className="profile-info">
                            {imageLoading && <CircularProgress style={{ marginBottom: '10px' }} />}
                            <img
                                src={selectedProfile.image}
                                alt="profilepicture"
                                onLoad={handleImageLoad}
                                style={{ display: imageLoading ? 'none' : 'block' }}
                            />
                            <div>
                                <TextField
                                    id="name"
                                    label="Name"
                                    value={selectedProfile.name}
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => handleInputChange(e, 'name')}
                                />
                                <TextField
                                    id="csn"
                                    label="CSN"
                                    value={selectedProfile.csn}
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => handleInputChange(e, 'csn')}
                                />
                                <TextField
                                    id="fingerprint"
                                    label="Fingerprint"
                                    value={selectedProfile.fingerprint}
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => handleInputChange(e, 'fingerprint')}
                                />
                            </div>
                        </div>
                        <div className='profiles-details'>
                            <TextField
                                id="details"
                                value={selectedProfile.information}
                                fullWidth
                                multiline
                                variant="standard"
                                onChange={(e) => handleInputChange(e, 'information')}
                            />
                        </div>
                    </>
                )}
            </div>

            {selectedProfile && (
                <div className='profiles-third-column' style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2> </h2>
                </div>
            )}
        </div>
    );
}

export default Profiles;

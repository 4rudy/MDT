import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Profiles.css';  // Adjust the path accordingly

function Profiles() {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/profiles')
            .then(response => response.json())
            .then(data => setProfiles(data))
            .catch(error => console.error('Error fetching profiles:', error));
    }, []);

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
    };

    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div style={{ display: 'flex' }}>
            <div className="profiles-first-column" style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                <div className="stickey-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '30px' }}>Profiles</h2>
                    <TextField
                        label="Search"
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
                            <img
                                src={selectedProfile.image}
                                alt="Profile"
                            />
                            <div>
                                <p>Name: {selectedProfile.name}</p>
                                <p>CSN: {selectedProfile.csn}</p>
                            </div>
                        </div>
                        <div className='profiles-details'>
                            <textarea
                                id="details"
                                value={selectedProfile.information}
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

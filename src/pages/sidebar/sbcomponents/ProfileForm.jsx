import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';

const randomLicenses = ["Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"];

function ProfileForm({ setSelectedProfile, setButtonPosition, setShowForm, setProfiles }) {
    const [selectedLicenses, setSelectedLicenses] = useState([]);

    const handleLicenseChange = (event) => {
        const selectedLicensesArray = event.target.value;
        setSelectedLicenses(selectedLicensesArray);
    };


    const handleSubmit = async () => {
        try {
            const newProfile = {
                name: document.getElementById('name').value,
                csn: document.getElementById('csn').value,
                image: document.getElementById('image').value,
                information: document.getElementById('information').value,
                licenses: selectedLicenses,
                fingerprint: uuidv4(),
                tags: []
            };

            const response = await fetch('http://localhost:5000/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
            });

            if (response.ok) {
                const addedProfile = await response.json();

                document.getElementById('name').value = '';
                document.getElementById('csn').value = '';
                document.getElementById('image').value = '';
                document.getElementById('information').value = '';
                setSelectedLicenses([]);
                const profilesResponse = await fetch('http://localhost:5000/profiles');
                const profilesData = await profilesResponse.json();

                setProfiles(profilesData);
                setShowForm(false);
            } else {
                console.error('Error adding profile:', response.statusText);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }

        setSelectedProfile(null);
        setButtonPosition({ top: '200px', left: '1000px' });
        setShowForm(false);
    };



    return (
        <div className="profiles-second-column">
            <div className="profile-info">
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <TextField
                        id="csn"
                        label="CSN"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <TextField
                        id="image"
                        label="Picture URL"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <TextField
                        id="information"
                        label="Information"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />

                    <Select
                        label="Licenses"
                        value={selectedLicenses}
                        onChange={handleLicenseChange}
                        style={{ width: '100%', marginTop: '10px' }}
                        multiple
                    >
                        {randomLicenses.map((license) => (
                            <MenuItem key={license} value={license}>
                                {license}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={handleSubmit} style={{ marginTop: '10px', width: '100%' }}>
                        Add Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;

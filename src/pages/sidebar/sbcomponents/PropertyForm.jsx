import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import { useMDTContext } from '../../../MDTContext';

const randomLicenses = ["Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"];

function PropertyForm({ setSelectedProfile, setButtonPosition, setShowForm, setProfiles }) {
    const { profiles } = useMDTContext();
    const [selectedOwner, setSelectedOwner] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const handleOwnerChange = (event) => {
        setSelectedOwner(event.target.value);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleSubmit = async () => {
        try {
            const newProfile = {
                address: document.getElementById('address').value,
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
        setShowForm(false);
    };



    return (
        <div className="profiles-second-column">
            <div className="profile-info">
                <div>
                    <TextField
                        id="address"
                        label="Address"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <Select
                        label="Owner"
                        value={selectedOwner}
                        onChange={handleOwnerChange}
                        style={{ width: '100%' }}
                    >
                        {filteredProfiles.map((profile) => (
                            <MenuItem key={profile.id} value={profile.id}>
                                {profile.name}
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

export default PropertyForm;

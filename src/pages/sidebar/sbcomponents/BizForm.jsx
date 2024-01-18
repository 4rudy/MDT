import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';

const randomLicenses = ["Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"];

function BizForm({ setSelectedBusiness, setButtonPosition, setShowForm, setBusinesses }) {
    const [selectedLicenses, setSelectedLicenses] = useState([]);

    const handleLicenseChange = (event) => {
        const selectedLicensesArray = event.target.value;
        setSelectedLicenses(selectedLicensesArray);
    };


    const handleSubmit = async () => {
        try {
            const newBusiness = {
                name: document.getElementById('name').value,
                category: document.getElementById('category').value,
                about: document.getElementById('about').value,
            };

            const response = await fetch('http://localhost:5000/businesses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBusiness),
            });

            if (response.ok) {
                const addedBusiness = await response.json();

                document.getElementById('name').value = '';
                document.getElementById('category').value = '';
                document.getElementById('about').value = '';

                const businessesResponse = await fetch('http://localhost:5000/businesses');
                const businessesData = await businessesResponse.json();

                setBusinesses(businessesData);
                setShowForm(false);
            } else {
                console.error('Error adding business:', response.statusText);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }

        setSelectedBusiness(null);
        setShowForm(false);
    };



    return (
        <div className="businesses-second-column">
            <div className="business-info">
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <TextField
                        id="category"
                        label="Category"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <TextField
                        id="about"
                        label="About"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <Button variant="contained" onClick={handleSubmit} style={{ marginTop: '10px', width: '100%' }}>
                        Add Business
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BizForm;

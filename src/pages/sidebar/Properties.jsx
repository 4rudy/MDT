import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useMDTContext } from '../../MDTContext';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import ProfileCard from './sbcomponents/ProfileCard';
import PropertyForm from './sbcomponents/PropertyForm';
import { FixedSizeList } from 'react-window';


function Properties({ darkMode }) {
    const { profiles, properties, setProperties, setSelectedProperty, selectedProperty } = useMDTContext();
    const [searchInput, setSearchInput] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ top: '200px', left: '1000px' });
    const [showForm, setShowForm] = useState(false);
    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null)
    const [propertyProfiles, setPropertyProfiles] = useState([]);

    const handlePropertyClick = (property) => {
        const propertyId = property.id;
        const propertiesProfileData = profiles.filter(profile => profile.id === property.profile_id);

        setSelectedPropertyIndex(propertyId)
        setSelectedProperty(property);
        setPropertyProfiles(propertiesProfileData);
        setShowForm(false);
    };

    const handleInputChange = (e, field) => {
        setSelectedProperty((prevProperty) => ({
            ...prevProperty,
            [field]: e.target.value,
        }));
    };

    const handleOpenForm = () => {
        setSelectedProperty(false)
        setShowForm(!showForm);
    };

    const handleDeleteProperty = async () => {
        if (selectedPropertyIndex !== null) {

            try {
                const response = await fetch(`http://localhost:5000/properties/${selectedPropertyIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const propertiesResponse = await fetch('http://localhost:5000/properties');
                    const propertiesData = await propertiesResponse.json();

                    setProperties(propertiesData);
                    setSelectedPropertyIndex(null);
                    setSelectedProperty(false)
                } else {
                    console.error('Error deleting property');
                }
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    const filteredProperties = properties.filter(property =>
        property.address.toLowerCase().includes(searchInput?.toLowerCase())
    );


    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex' }}>
            <div className="properties-first-column" style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                <div className="stickey-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '30px' }}>Properties</h2>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <div className="scroll-container">
                    <FixedSizeList
                        height={750}
                        width="100%"
                        itemSize={50}
                        itemCount={filteredProperties.length}
                        style={{
                            overflowY: 'scroll',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#ccc transparent',
                        }}
                    >
                        {({ index, style }) => (
                            <div style={style}>
                                <div key={filteredProperties[index].id} style={{ marginBottom: '8px' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handlePropertyClick(filteredProperties[index])}
                                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                    >
                                        <div>{filteredProperties[index].address}</div>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </FixedSizeList>
                </div>
            </div>
            {showForm ? (
                <PropertyForm
                    handleOpenForm={handleOpenForm}
                    setSelectedProperty={setSelectedProperty}
                    setButtonPosition={setButtonPosition}
                    setShowForm={setShowForm}
                    setProperties={setProperties}
                />
            ) : (

                    <div className="properties-second-column" style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
                    {selectedProperty && (
                        <>
                            <Tooltip title="Delete Property">
                                <IconButton
                                    variant="text"
                                    onClick={() => handleDeleteProperty()}
                                    style={{
                                        position: 'absolute',
                                        top: '210px',
                                        right: '60px',
                                        zIndex: 1,
                                        fontSize: '15px',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <div className="property-info">
                                <div>
                                    <ProfileCard
                                        title="Owner"
                                        data={propertyProfiles.map((profile) => (
                                            <div key={profile.id}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{profile.name} - {profile.csn}</div>
                                            </div>
                                        ))}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Properties;

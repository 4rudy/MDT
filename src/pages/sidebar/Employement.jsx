import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useMDTContext } from '../../MDTContext';
import BuildIcon from '@mui/icons-material/Build';
import Tooltip from '@mui/material/Tooltip';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PetsIcon from '@mui/icons-material/Pets';
import WorkIcon from '@mui/icons-material/Work';
import GavelIcon from '@mui/icons-material/Gavel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessCard from './sbcomponents/BusinessCard';
import BizForm from './sbcomponents/BizForm';
import { FixedSizeList } from 'react-window';

const licenseIcons = {
    "Weapons": <BuildIcon />,
    "Drivers": <DriveEtaIcon />,
    "Hunting": <PetsIcon />,
    "Business": <WorkIcon />,
    "Law": <GavelIcon />,
    "Medical": <LocalHospitalIcon />,
};

function Businesses({ darkMode }) {
    const { profiles, businesses, properties, setBusinesses, setSelectedBusiness, selectedBusiness } = useMDTContext();
    const [searchInput, setSearchInput] = useState('');
    const [businessProperties, setBusinessProperties] = useState([]);
    const [businessProfile, setBusinessProfile] = useState([]);
    const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null)
    const [showForm, setShowForm] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: '200px', left: '1000px' });

    const handleBusinessClick = (business) => {
        const businessId = business.id;
        const businessPropertiesData = properties.filter(property => property.business_id === businessId);
        const businessProfilesData = profiles.filter(profile => profile.id === businessId);

        setBusinessProperties(businessPropertiesData);
        setBusinessProfile(businessProfilesData);
        setSelectedBusinessIndex(businessId)
        setSelectedBusiness(business);
        setShowForm(false);
    };

    const handleInputChange = (e, field) => {
        setSelectedBusiness((prevBusiness) => ({
            ...prevBusiness,
            [field]: e.target.value,
        }));
    };

    const handleOpenForm = () => {
        setSelectedBusiness(false)
        setButtonPosition({ top: '200px', left: '1000px' });
        setShowForm(!showForm);
    };

    const handleDeleteBusiness = async () => {
        if (selectedBusinessIndex !== null) {

            try {
                const response = await fetch(`http://localhost:5000/businesses/${selectedBusinessIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const businessesResponse = await fetch('http://localhost:5000/businesses');
                    const businessesData = await businessesResponse.json();

                    setBusinesses(businessesData);
                    setSelectedBusinessIndex(null);
                    setSelectedBusiness(false)
                } else {
                    console.error('Error deleting business');
                }
            } catch (error) {
                console.error('Error deleting business:', error);
            }
        }
    };

    const filteredBusinesses = businesses.filter(business =>
        business.name.toLowerCase().includes(searchInput?.toLowerCase()) ||
        business.category.toLowerCase().includes(searchInput?.toLowerCase())
    );



    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex' }}>
            <Tooltip title="Add Business">
                <IconButton
                    variant="text"
                    onClick={() => handleOpenForm()}
                    style={{
                        position: 'absolute',
                        top: '200px',
                        left: buttonPosition.left,
                        zIndex: 1,
                        fontSize: '15px',
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Tooltip>

            <div className="businesses-first-column" style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                <div className="stickey-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '30px' }}>Businesses</h2>
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
                        itemCount={filteredBusinesses.length}
                        style={{
                            overflowY: 'scroll',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#ccc transparent',
                        }}
                    >
                        {({ index, style }) => (
                            <div style={style}>
                                <div key={filteredBusinesses[index].id} style={{ marginBottom: '8px' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handleBusinessClick(filteredBusinesses[index])}
                                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                    >
                                        <div>{filteredBusinesses[index].name}</div>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </FixedSizeList>
                </div>
            </div>
            {showForm ? (
                <BizForm
                    handleOpenForm={handleOpenForm}
                    setSelectedBusiness={setSelectedBusiness}
                    setShowForm={setShowForm}
                    setBusinesses={setBusinesses}
                />
            ) : (

                <div className="businesses-second-column" style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
                    {selectedBusiness && (
                        <>
                            <Tooltip title="Delete Business">
                                <IconButton
                                    variant="text"
                                    onClick={() => handleDeleteBusiness()}
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
                            <div className="business-info">
                                <div>
                                    <BusinessCard
                                        title="Name"
                                        data={selectedBusiness.name}
                                    />
                                    <BusinessCard
                                        title="Category"
                                        data={selectedBusiness.category}
                                    />
                                    <BusinessCard
                                        title="About"
                                        data={selectedBusiness.about}
                                    />
                                    <BusinessCard
                                        title="Owner"
                                            data={businessProfile.length > 0 && businessProfile[0].name ? [businessProfile[0].name] : []}
                                    />
                                    <BusinessCard
                                        title="Address"
                                        data={businessProperties.length > 0 && businessProperties[0].address ? [businessProperties[0].address] : []}
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

export default Businesses;

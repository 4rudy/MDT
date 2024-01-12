import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useMDTContext } from '../../MDTContext';
import BuildIcon from '@mui/icons-material/Build';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PetsIcon from '@mui/icons-material/Pets';
import WorkIcon from '@mui/icons-material/Work';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import './Profiles.css';

const licenseIcons = {
    "Weapons": <BuildIcon />,
    "Drivers": <DriveEtaIcon />,
    "Hunting": <PetsIcon />,
    "Business": <WorkIcon />,
    "Law": <GavelIcon />,
    "Medical": <LocalHospitalIcon />,
};

function Profiles({ darkMode, toggleDarkMode }) {
    const { profiles, vehicles, properties, setSelectedProfile, selectedProfile } = useMDTContext();
    const [searchInput, setSearchInput] = useState('');
    const [imageLoading, setImageLoading] = useState(true);
    const [profileVehicles, setProfileVehicles] = useState([]);
    const [profileProperties, setProfileProperties] = useState([]);

    const handleProfileClick = (profile) => {
        const profileId = profile.id;
        const profileVehiclesData = vehicles.filter(vehicle => vehicle.profile_id === profileId);
        const profilePropertiesData = properties.filter(property => property.profile_id === profileId);
        setSelectedProfile(profile);
        setImageLoading(true);
        setProfileVehicles(profileVehiclesData);
        setProfileProperties(profilePropertiesData);
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
                    <Card style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Licenses
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedProfile.licenses.length > 0 ? (
                                    selectedProfile.licenses.map((license, index) => (
                                        <Chip
                                            key={index}
                                            label={license}
                                            icon={licenseIcons[license]}
                                            style={{ margin: '4px' }}
                                        />
                                    ))
                                ) : (
                                    <span>No licenses permitted</span>
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Tags
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedProfile.tags.length > 0 ? (
                                    selectedProfile.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} style={{ margin: '4px' }} />
                                    ))
                                ) : (
                                    <span>No tags associated</span>
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ marginTop: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Vehicles
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {profileVehicles.length > 0 ? (
                                    profileVehicles.map((vehicle, index) => (
                                        <Chip
                                            key={index}
                                            label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                            style={{ margin: '4px' }}
                                        />
                                    ))
                                ) : (
                                    <span>No owned vehicles</span>
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ marginTop: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Properties
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {profileProperties.length > 0 ? (
                                    profileProperties.map((property, index) => (
                                        <Chip
                                            key={index}
                                            label={property.address}
                                            style={{ margin: '4px' }}
                                        />
                                    ))
                                ) : (
                                    <span>No owned properties</span>
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Profiles;

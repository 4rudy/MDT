import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useMDTContext } from '../../MDTContext';
import BuildIcon from '@mui/icons-material/Build';
import Tooltip from '@mui/material/Tooltip';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PetsIcon from '@mui/icons-material/Pets';
import WorkIcon from '@mui/icons-material/Work';
import GavelIcon from '@mui/icons-material/Gavel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ProfileCard from './sbcomponents/ProfileCard';
import ProfileForm from './sbcomponents/ProfileForm';
import { FixedSizeList } from 'react-window';
import './Profiles.css';

const licenseIcons = {
    "Weapons": <BuildIcon />,
    "Drivers": <DriveEtaIcon />,
    "Hunting": <PetsIcon />,
    "Business": <WorkIcon />,
    "Law": <GavelIcon />,
    "Medical": <LocalHospitalIcon />,
};
const randomLicenses = ["Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"];

function Profiles({ darkMode }) {
    const { profiles, vehicles, properties, setProfiles, setSelectedProfile, selectedProfile } = useMDTContext();
    const [searchInput, setSearchInput] = useState('');
    const [imageLoading, setImageLoading] = useState(true);
    const [profileVehicles, setProfileVehicles] = useState([]);
    const [profileProperties, setProfileProperties] = useState([]);
    const [buttonPosition, setButtonPosition] = useState({ top: '200px', left: '1000px' });
    const [showForm, setShowForm] = useState(false);
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(null)

    const handleProfileClick = (profile) => {
        const profileId = profile.id;
        const profileVehiclesData = vehicles.filter(vehicle => vehicle.profile_id === profileId);
        const profilePropertiesData = properties.filter(property => property.profile_id === profileId);
        console.log(profileId)
        setSelectedProfileIndex(profileId)
        setSelectedProfile(profile);
        setImageLoading(true);
        setProfileVehicles(profileVehiclesData);
        setProfileProperties(profilePropertiesData);
        setButtonPosition({ top: '200px', left: '700px' });
        setShowForm(false);
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

    const handleOpenForm = () => {
        setSelectedProfile(false)
        setButtonPosition({ top: '200px', left: '1000px' });
        setShowForm(!showForm);
    };

    const handleDeleteProfile = async () => {
        if (selectedProfileIndex !== null) {

            try {
                const response = await fetch(`http://localhost:5000/profiles/${selectedProfileIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log(selectedProfileIndex)

                    const profilesResponse = await fetch('http://localhost:5000/profiles');
                    const profilesData = await profilesResponse.json();

                    setProfiles(profilesData);
                    setSelectedProfileIndex(null);
                    setSelectedProfile(false)
                } else {
                    console.error('Error deleting profile');
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    };

    const handleSaveProfile = async () => {
        try {
            if (selectedProfileIndex !== null) {
                const updatedProfileData = {
                    name: selectedProfile.name,
                    csn: selectedProfile.csn,
                    fingerprint: selectedProfile.fingerprint,
                    information: selectedProfile.information,
                    tags: selectedProfile.tags,
                    licenses: selectedProfile.licenses,
                    image: selectedProfile.image,
                };

                const response = await fetch(`http://localhost:5000/profiles/${selectedProfile.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProfileData),
                });

                if (response.ok) {
                    const profilesResponse = await fetch('http://localhost:5000/profiles');
                    const profilesData = await profilesResponse.json();

                    setProfiles(profilesData);
                    setSelectedProfile(false);
                    setButtonPosition({ top: '200px', left: '1000px' });
                    setShowForm(false);
                } else {
                    console.error('Error updating profile');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchInput?.toLowerCase()) ||
        profile.csn.toLowerCase().includes(searchInput?.toLowerCase())
    );



    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex' }}>
            <Tooltip title="Add Profile">
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
                    <FixedSizeList
                        height={750}
                        width="100%"
                        itemSize={50}
                        itemCount={filteredProfiles.length}
                        style={{
                            overflowY: 'scroll',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#ccc transparent',
                        }}
                    >
                        {({ index, style }) => (
                            <div style={style}>
                                <div key={filteredProfiles[index].id} style={{ marginBottom: '8px' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handleProfileClick(filteredProfiles[index])}
                                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                    >
                                        <div>{filteredProfiles[index].name}</div>
                                        <div>CSN: {filteredProfiles[index].csn}</div>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </FixedSizeList>
                </div>
            </div>
            {showForm ? (
                <ProfileForm
                    handleOpenForm={handleOpenForm}
                    setSelectedProfile={setSelectedProfile}
                    setButtonPosition={setButtonPosition}
                    setShowForm={setShowForm}
                    setProfiles={setProfiles}
                />
            ) : (

                <div className="profiles-second-column">
                    {selectedProfile && (
                        <>
                        <Tooltip title="Delete Profile">
                            <IconButton
                                variant="text"
                                onClick={() => handleDeleteProfile()}
                                style={{
                                    position: 'absolute',
                                    top: '200px',
                                    left: '1250px',
                                    zIndex: 1,
                                    fontSize: '15px',
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save Profile">
                            <IconButton
                                variant="text"
                                onClick={() => handleSaveProfile()}
                                style={{
                                    position: 'absolute',
                                    top: '200px',
                                    left: '1280px',
                                    zIndex: 1,
                                    fontSize: '15px',
                                }}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
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
            )}
            {selectedProfile && (
                <div className='profiles-third-column' style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
                    <ProfileCard
                        title="Licenses"
                        data={selectedProfile.licenses}
                        icons={licenseIcons}
                    />
                    <ProfileCard
                        title="Tags"
                        data={selectedProfile.tags}
                    />
                    <ProfileCard
                        title="Vehicles"
                        data={profileVehicles}
                        labelCallback={(vehicle) => `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    />
                    <ProfileCard
                        title="Properties"
                        data={profileProperties}
                        labelCallback={(property) => property.address}
                    />
                </div>
            )}
        </div>
    );
}

export default Profiles;

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useMDTContext } from '../../MDTContext';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { FixedSizeList } from 'react-window';
import BusinessCard from './sbcomponents/BusinessCard';

function Charges({ darkMode }) {
    const { charges, setSelectedCharge } = useMDTContext();
    const [searchInput, setSearchInput] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedChargeIndex, setSelectedChargeIndex] = useState(null);
    const [selectedChargeDetails, setSelectedChargeDetails] = useState(null);

    const filteredCharges = charges.filter(charge =>
        charge.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        charge.description.toLowerCase().includes(searchInput.toLowerCase()) ||
        charge.category.toLowerCase().includes(searchInput.toLowerCase())
    );

    const groupedCharges = filteredCharges.reduce((acc, charge) => {
        const penal_title = charge.penal_title || 'Uncategorized';
        acc[penal_title] = acc[penal_title] || [];
        acc[penal_title].push(charge);
        return acc;
    }, {});

    const categories = Object.keys(groupedCharges);

    const handleChargeClick = (charge) => {
        const chargeId = charge.id;

        setSelectedChargeIndex(chargeId);
        setSelectedCharge(charge);
        setShowForm(false);
        setSelectedChargeDetails(charge);
    };

    const handleInputChange = (e, field) => {
        setSearchInput(e.target.value);
    };

    const handleOpenForm = () => {
        setSelectedCharge(false);
        setShowForm(!showForm);
        setSelectedChargeDetails(null);
    };

    const handleDeleteCharge = async () => {
        if (selectedChargeIndex !== null) {
            try {
                const response = await fetch(`http://localhost:5000/charges/${selectedChargeIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const chargesResponse = await fetch('http://localhost:5000/charges');
                    const chargesData = await chargesResponse.json();

                    setCharges(chargesData);
                    setSelectedChargeIndex(null);
                    setSelectedChargeDetails(false);
                } else {
                    console.error('Error deleting charge');
                }
            } catch (error) {
                console.error('Error deleting charge:', error);
            }
        }
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ display: 'flex' }}>
            <div className="charges-first-column" style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                <div className="stickey-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '30px' }}>Charges</h2>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={searchInput}
                        onChange={(e) => handleInputChange(e, 'searchInput')}
                    />
                </div>
                <div className="scroll-container">
                    {categories.map((penal_title) => (
                        <div key={penal_title}>
                            <h3>{penal_title}</h3>
                            <FixedSizeList
                                height={300}
                                width="100%"
                                itemSize={50}
                                itemCount={groupedCharges[penal_title].length}
                                style={{
                                    overflowY: 'scroll',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#ccc transparent',
                                }}
                            >
                                {({ index, style }) => (
                                    <div style={style}>
                                        <div key={groupedCharges[penal_title][index].id} style={{ marginBottom: '8px' }}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={() => handleChargeClick(groupedCharges[penal_title][index])}
                                                style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                            >
                                                <div>{groupedCharges[penal_title][index].title}</div>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </FixedSizeList>
                        </div>
                    ))}
                </div>
            </div>
            <div className="charge-details" style={{ flex: 0.7, border: '1px solid #ccc', padding: '20px' }}>
                {selectedChargeDetails && (
                    <>
                        <BusinessCard
                            title={selectedChargeDetails.penal_title}
                            data={" "}
                        />
                        <BusinessCard
                            title={[`${selectedChargeDetails.code} - \n${selectedChargeDetails.title}`]}
                            data={selectedChargeDetails.description}
                        />
                        <BusinessCard
                            title={"Sentencing"}
                            data={[
                                <>Time: {selectedChargeDetails.months} months<br /></>,
                                <>Fine: ${selectedChargeDetails.fine}<br /></>,
                                <>Points on License: {selectedChargeDetails.points}</>
                            ]}
                        />
                        <BusinessCard
                            title={selectedChargeDetails.category}
                            data={" "}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Charges;

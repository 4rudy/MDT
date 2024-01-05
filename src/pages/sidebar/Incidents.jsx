import React from 'react'
import TextField from '@mui/material/TextField';

function Incidents() {
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Incidents</h2>
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                </div>

                <div style={{ flex: 1, width: '30%', border: '1px solid #ccc', padding: '10px' }}>
                    <h2> 2</h2>
                </div>

                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2> 3</h2>
                </div>
            </div>
        </div>
    );
}

export default Incidents

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function BusinessCard({ title, data, icons, labelCallback }) {
    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.length > 0 ? (
                        <span>
                            {labelCallback ? labelCallback(data) : data}
                        </span>
                    ) : (
                        <span>{`No ${title.toLowerCase()} available`}</span>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default BusinessCard;

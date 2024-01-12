import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

function ProfileCard({title, data, icons, labelCallback}) {
    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <Chip
                                key={index}
                                label={labelCallback ? labelCallback(item) : item}
                                icon={icons ? icons[item] : null}
                                style={{ margin: '4px' }}
                            />
                        ))
                    ) : (
                        <span>{`No ${title.toLowerCase()} available`}</span>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ProfileCard;

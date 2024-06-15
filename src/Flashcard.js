// src/Flashcard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ReactCardFlip from 'react-card-flip';
import './index.css';  // Import the CSS file

const Flashcard = ({ word, translation, pronunciation, isFlipped, handleFlip, backgroundColor }) => {
    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <Card onClick={handleFlip} className="flashcard" style={{ cursor: 'pointer', backgroundColor }}>
                <CardContent className="flashcard-content">
                    <Typography variant="h5">{word}</Typography>
                </CardContent>
            </Card>
            <Card onClick={handleFlip} className="flashcard" style={{ cursor: 'pointer', backgroundColor }}>
                <CardContent className="flashcard-content">
                    <Typography variant="h5">{translation}</Typography>
                    <Typography variant="body1">{pronunciation}</Typography>
                </CardContent>
            </Card>
        </ReactCardFlip>
    );
};

export default Flashcard;
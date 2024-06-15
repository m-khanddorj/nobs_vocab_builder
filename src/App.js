

import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { Container, FormControl, InputLabel, Select, MenuItem, Button,Snackbar, Alert  } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import flashcardsData from './flashcards.json';
import './App.css';  // Import the CSS file

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const languages = ['English','Mongolian'];
const difficulties = ['All', 'N1', 'N2', 'N3', 'N4', 'N5'];
const App = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentRoundCount, setCurrentRoundCount] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [unfamiliarWords, setUnfamiliarWords] = useState([]);
    const [unfamiliarIndex, setUnfamiliarIndex] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const shuffledFlashcards = shuffleArray([...flashcardsData]);
        setFlashcards(shuffledFlashcards);
    }, []);

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        setCurrentWordIndex(0);
        setCurrentRoundCount(0);
        setIsFlipped(false);
    };

    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
        setCurrentWordIndex(0);
        setCurrentRoundCount(0);
        setIsFlipped(false);
    };


    const handleCopy = (word) => {
        navigator.clipboard.writeText(word)
        .then(() => {
            setSnackbarOpen(true);
            setTimeout(() => setSnackbarOpen(false), 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const filteredFlashcards = flashcards.filter((card) => {
        return (selectedLanguage === 'All' || card.translation_language === selectedLanguage) &&
               (selectedDifficulty === 'All' || card.level === selectedDifficulty);
    });

    const handleNext = (knowWord,reviewRound,displayedWord) => {
        if (!knowWord) {
            const nextReviewRound = currentRoundCount + 5;
            setUnfamiliarWords([...unfamiliarWords, displayedWord]);
            setUnfamiliarIndex([...unfamiliarIndex, nextReviewRound]);
        }

        if (!reviewRound){
            const nextIndex = currentWordIndex + 1;
            setCurrentWordIndex(nextIndex % filteredFlashcards.length);
        }
        else{
            setUnfamiliarWords([...unfamiliarWords.slice(1)]);
            setUnfamiliarIndex([...unfamiliarIndex.slice(1)]);
        }
        setIsFlipped(false);
        setCurrentRoundCount(currentRoundCount+1)
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const reviewRound = unfamiliarIndex.includes(currentRoundCount);
    const backgroundColor = reviewRound ? '#f8d7da' : '#ffffff';
    const word = reviewRound ? unfamiliarWords[0]:filteredFlashcards[currentWordIndex];
    return (
        <Container>
            <div className="dropdown-container">
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>Language</InputLabel>
                    <Select value={selectedLanguage} onChange={handleLanguageChange} label="language">
                        {languages.map((language) => (
                            <MenuItem key={language} value={language}>{language}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>Difficulty</InputLabel>
                    <Select value={selectedDifficulty} onChange={handleDifficultyChange} label="Difficulty">
                        {difficulties.map((difficulty) => (
                            <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {filteredFlashcards.length > 0 && (
                <Flashcard 
                    {...word} 
                    isFlipped={isFlipped} 
                    handleFlip={handleFlip} 
                    backgroundColor={backgroundColor}
                />
            )}

            <div className="button-container">
            <Button 
                    variant="contained" 
                    style={{ backgroundColor: '#F17300', color: 'white' }} 
                    onClick={() => handleNext(false,reviewRound,word)} 
                    className="nav-button" 
                    disabled={filteredFlashcards.length === 0}
                >
                    <CloseIcon/>
                </Button>
                <Button 
                    variant="contained" 
                    style={{ backgroundColor: '#81A4CD', color: 'white' }} 
                    onClick={()=>handleCopy(word.word)} 
                    className="nav-button" 
                    disabled={filteredFlashcards.length === 0}
                >
                    <ContentCopyIcon/>
                </Button>
                <Button 
                    variant="contained" 
                    style={{ backgroundColor: '#054A91', color: 'white' }} 
                    onClick={() => handleNext(true,reviewRound,word)} 
                    className="nav-button" 
                    disabled={filteredFlashcards.length === 0}
                >
                    <CheckIcon/>
                </Button>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Copied to clipboard!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default App;
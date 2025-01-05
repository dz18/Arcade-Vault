import { 
    Box, 
    Button, 
    Grid2, 
    Typography 
} from "@mui/material";
import { 
    DirectionsCar,
    Face5,
    VideogameAsset,
    Hive,
    Forest,
    AllInclusive,
    Fastfood,
    TwoWheeler,
    AcUnit,
    CatchingPokemon,
    Pets,
    AttachMoney
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { 
    formatTime,
    resetTimer,
    startTimer
} from "../hooks/GameClock";

const cards = [
    {
        icon: <Face5 sx={{color: 'black'}} fontSize="large"/>,
        color: 'black',
        number: 1,
        flipped: false
    },
    {
        icon: <AttachMoney sx={{color: 'lime'}} fontSize="large"/>,
        color: 'lime',
        number: 2
    },
    {
        icon: <Forest sx={{color: 'green'}} fontSize="large"/>,
        color: 'green',
        number: 3
    },
    {
        icon: <VideogameAsset sx={{color: 'aqua'}} fontSize="large"/>,
        color: 'aqua',
        number: 4
    },
    {
        icon: <DirectionsCar sx={{color: 'steelblue'}} fontSize="large"/>,
        color: 'steelblue',
        number: 5
    },
    {
        icon: <Hive sx={{color: 'orange'}} fontSize="large"/>,
        color: 'orange',
        number: 6
    },
    {
        icon: <AllInclusive sx={{color: 'navy'}} fontSize="large"/>,
        color: 'navy',
        number: 7
    },
    {
        icon: <Fastfood sx={{color: 'indigo'}} fontSize="large"/>,
        color: 'indigo',
        number: 8
    },
    {
        icon: <TwoWheeler sx={{color: 'grey'}} fontSize="large"/>,
        color: 'grey',
        number: 9
    },
    {
        icon: <AcUnit sx={{color: 'skyblue'}} fontSize="large"/>,
        color: 'skyblue',
        number: 10
    },
    {
        icon: <CatchingPokemon sx={{color: 'red'}} fontSize="large"/>,
        color: 'red',
        number: 11
    },
    {
        icon: <Pets sx={{color: 'brown'}} fontSize="large"/>,
        color: 'brown',
        number: 12
    },
]

export default function CardMemoryGame() {

    // Default Game Settings
    const [totalCards, setTotalCards] = useState(12);
    const [startTime, setStartTime] = useState(1 * 60)
    const [time, setTime] = useState(startTime); // Time in seconds (5 minutes)
    const [isRunning, setIsRunning] = useState(false);
    const [deck, setDeck] = useState([])
    const [mode, setMode] = useState('easy')

    const [flippedCards, setFlippedCards] = useState([])
    const [matchedCards, setMatchCards] = useState([])
    const [cardStatus, setCardStatus] = useState([])

    // Handle Timer Countdown
    useEffect(() => {
        let timerInterval;
        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerInterval);
                        setIsRunning(false); // Stop timer at 0
                        return 0;
                    }
                });
            }, 1000);
        }

        // Cleanup Interval
        return () => clearInterval(timerInterval);
    }, [isRunning]);

    useEffect(() => {
        if (time === 0) {
            setIsRunning(false)
            alert('Time is up')
        }
    }, [time])

    // Generate Cards
    useEffect(() => {
        const fetchCards = () => {
            const shuffledCards = shuffleCards()
            setDeck(shuffledCards)
        };

        fetchCards()
    }, [mode])

    const handleReset = () => {
        resetTimer(setIsRunning, setTime, startTime)
        setFlippedCards([])
        setMatchCards([])
        const shuffled = shuffleCards()
        setDeck(shuffled)
        const initializedCardStatus = shuffled.map(card => ({
            ...card,
            flipped: false
        }));
        setCardStatus(initializedCardStatus)
    }

    const shuffleCards = () => {
        const shuffled = [...cards] // Assuming cards is an array already defined
    
        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex1 = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[randomIndex1]] = [shuffled[randomIndex1], shuffled[i]]
        }
    
        let selectedCards;
        if (mode === 'easy') {
            selectedCards = shuffled.slice(0, 6)
        } else if (mode === 'intermediate') {
            selectedCards = shuffled.slice(0, 9)
        } else {
            selectedCards = shuffled
        }

        // Duplicate the selected cards
        selectedCards = [...selectedCards, ...selectedCards];
    
        // Shuffle again after duplication
        for (let i = selectedCards.length - 1; i > 0; i--) {
            const randomIndex2 = Math.floor(Math.random() * (i + 1));
            [selectedCards[i], selectedCards[randomIndex2]] = [selectedCards[randomIndex2], selectedCards[i]]
        }
    
        const initializedCards = selectedCards.map(card => ({
            ...card,
            flipped: false
        }));

        setDeck(initializedCards)
        setCardStatus(initializedCards)
        return selectedCards;
    };

    const handleCardFlip = (index) => {
        
        if (flippedCards.length === 2 || cardStatus[index].flipped || isRunning === false)
            return 

        const updatedCardStatus = [...cardStatus];
        updatedCardStatus[index].flipped = true;
        setCardStatus(updatedCardStatus)

        const updatedFlippedCards = [...flippedCards, index];
        setFlippedCards(updatedFlippedCards)

        if (updatedFlippedCards.length === 2) {
            // Check if the cards match
            const [firstIndex, secondIndex] = updatedFlippedCards
            const firstCard = deck[firstIndex];
            const secondCard = deck[secondIndex]

            if (firstCard.number === secondCard.number) {
                // Match
                const updatedMatchedCards = [...matchedCards, firstCard.number]
                setMatchCards(updatedMatchedCards)
                setFlippedCards([])

                if (updatedMatchedCards.length === deck.length / 2) {
                    alert('you win')
                    setIsRunning(false)
                }
            } else {
                setTimeout(() => {
                    const resetStatus = [...cardStatus]
                    resetStatus[firstIndex].flipped = false
                    resetStatus[secondIndex].flipped = false;
                    setCardStatus(resetStatus)
                    setFlippedCards([])
                }, 1000)
            }
        }
    }

    return (
        <Box mt={10}>

            {/* Banner */}
            <Box>
                <Typography
                    variant="h3"
                >
                    Card Memory Game
                </Typography>
                <Typography 
                    variant="h6"
                    color="grey"
                >
                    Flip & Find Matching Cards
                </Typography>
            </Box>

            {/* Settings */}
            <Box
                bgcolor="white"
                p={2}
                my={1}
                borderRadius={2}
            >
                <Typography variant="subtitle1">
                    Time Remaining: {formatTime(time)}
                </Typography>
                <Box display='flex' flexDirection='row'>
                    <Box mt={2} flexGrow={1}>
                        <Button
                            variant="outlined"
                            onClick={() => startTimer(setIsRunning)}
                            disabled={isRunning}
                        >
                            Start Timer
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            sx={{ ml: 2 }}
                        >
                            Reset Timer
                        </Button>
                    
                        
                    </Box>
                    <Box mt={2} >
                        <Button
                            variant="outlined"
                            disabled={mode == 'easy'}
                            onClick={() => setMode('easy')}
                        >
                            Easy
                        </Button>
                        <Button
                            variant="outlined"
                            disabled={mode == 'intermediate'}
                            sx={{ ml: 2 }}
                            onClick={() => setMode('intermediate')}
                        >
                            Intermediate
                        </Button>
                        <Button
                            variant="outlined"
                            disabled={mode == 'hard'}
                            sx={{ ml: 2 }}
                            onClick={() => setMode('hard')}
                        >
                            Hard
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Game Board */}
            <Box
                bgcolor="lightgrey"
                p={2}
                my={2}
                borderRadius={2}
            >
                <Grid2 spacing={2} container>
                {deck.map((card, index) => (
                    <Grid2 
                        key={index}
                        size={2}
                    >
                        <Box
                            onClick={() => handleCardFlip(index)}
                            sx={{
                                cursor: isRunning ? 'pointer' : 'not-allowed'
                            }}
                            bgcolor={cardStatus[index].flipped || matchedCards.includes(card.number) ? 'white' : 'grey'}
                            border="1px solid black"
                            height={150}
                            borderRadius={2}
                            p={2}
                            display='flex'
                            textAlign="center"
                            overflow='hidden'
                            flexDirection='column'
                            justifyContent='space-between'
                            alignItems='center'
                        >
                        {cardStatus[index].flipped || matchedCards.includes(card.number) ? (
                            <>
                                <Box width='100%' textAlign='left'>
                                    <Typography>{card.number}</Typography>
                                </Box>
                                <Box>
                                    {card.icon}
                                </Box>
                                <Box width='100%' textAlign='right'>
                                    <Typography>{card.number}</Typography>
                                </Box>
                            </>
                        ) : (
                            <Typography>?</Typography>
                        )}
                            
                        </Box>
                    </Grid2>
                ))}
                </Grid2>
            </Box>

        </Box>
    );
}

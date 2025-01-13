import { AvTimer, Replay, SportsScore } from "@mui/icons-material";
import { Avatar, Box, Divider, Grid2, LinearProgress, Typography } from "@mui/material";
import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Fragment, useEffect, useState } from "react";

export default function CardMemoryLeaderboards({ mode }) {

    const [loading, setLoading] = useState(false)
    const [bestScores, setBestScores] = useState([])
    const [bestTimes, setBestTimes] = useState([])
    const [mostPlays, setMostPlays] = useState([])

    const fetchLeaderboards = async (mode) => {
        const leaderboardsRef = collection(db, 'games', 'cardMemory', 'leaderboards')
    
        // Queries for Best Scores, Best Times, and Most Plays
        const bestScoresQuery = query(leaderboardsRef, orderBy(`bestScore.${mode}`, 'desc'), limit(15))
        const bestTimesQuery = query(leaderboardsRef, orderBy(`bestTime.${mode}`, 'desc'), limit(15))
        const mostPlaysQuery = query(leaderboardsRef, orderBy('totalGamesPlayed', 'desc'), limit(15))
    
        try {
            const [bestScoresSnapshot, bestTimesSnapshot, mostPlaysSnapshot] = await Promise.all([
                getDocs(bestScoresQuery),
                getDocs(bestTimesQuery),
                getDocs(mostPlaysQuery)
            ])
    
            const bestScores = bestScoresSnapshot.docs.map(doc => ({
                id: doc.id,
                score: doc.data().bestScore[mode],
                username: doc.data().username
            }))
            
            const bestTimes = bestTimesSnapshot.docs.map(doc => ({
                id: doc.id,
                time: doc.data().bestTime[mode],
                username: doc.data().username
            }))
    
            const mostPlays = mostPlaysSnapshot.docs.map(doc => ({
                id: doc.id,
                totalGamesPlayed: doc.data().totalGamesPlayed,
                username: doc.data().username
            }))
    
            return { bestScores, bestTimes, mostPlays }
        } catch (error) {
            console.error(error)
            return { bestScores: [], bestTimes: [], mostPlays: [] }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { bestScores, bestTimes, mostPlays } = await fetchLeaderboards(mode)
            setBestScores(bestScores)
            setBestTimes(bestTimes)
            setMostPlays(mostPlays)
            setLoading(false)
        }
        fetchData()
    }, [mode])

    return (
        <Box>
            <Grid2 container spacing={2}>

                {/* Best Score */}
                <Grid2
                    bgcolor='gold'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
                    mb={2}
                >
                    {/* Header */}
                    <Box
                        display='flex'
                        alignItems='center'
                    >
                        <SportsScore fontSize="large"/>
                        <Typography
                            variant="h6"
                            fontWeight='bold'
                            ml={1}
                        >
                            Best Scores
                        </Typography>
                    </Box>

                    {/* Leaderboard */}
                    {!loading ? (
                        bestScores && bestScores.length > 0 ? (
                            bestScores.map((score) => (
                                <Fragment key={score.id}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box
                                        display="flex"
                                        my={1}
                                        alignItems="center"
                                    >
                                        <Avatar 
                                            src={score.photoUrl}
                                        />
                                        <Typography
                                            flexGrow={1}
                                            ml={1}
                                            noWrap
                                            sx={{
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {score.username}
                                        </Typography>
                                        <Typography
                                            fontWeight="bold"
                                            ml={1}
                                        >
                                            {score.score}
                                        </Typography>
                                    </Box>
                                </Fragment>
                            ))
                        ) : (
                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2" color="textSecondary">
                                    No scores available.
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <LinearProgress color="inherit" sx={{ mt: 1 }} />
                    )}
                </Grid2>
                
                {/* Best Time */}
                <Grid2
                    bgcolor='skyblue'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
                    mb={2}
                >
                    {/* Header */}
                    <Box
                        display='flex'
                        alignItems='center'
                    >
                        <AvTimer fontSize="large"/>
                        <Typography
                            variant="h6"
                            fontWeight='bold'
                            ml={1}
                        >
                            Best Times
                        </Typography>
                    </Box>

                    {/* Leaderboard */}
                    {!loading ? (
                        bestTimes && bestTimes.length > 0 ? (
                            bestTimes.map((score) => (
                                <Fragment key={score.id}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box
                                        display="flex"
                                        my={1}
                                        alignItems="center"
                                    >
                                        <Avatar  
                                            src={score.photoUrl}
                                        />
                                        <Typography
                                            flexGrow={1}
                                            ml={1}
                                            noWrap
                                            sx={{
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {score.username}
                                        </Typography>
                                        <Typography
                                            fontWeight="bold"
                                            ml={2}
                                        >
                                            {score.time}s left
                                        </Typography>
                                    </Box>
                                </Fragment>
                            ))
                        ) : (
                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2" color="textSecondary">
                                    No scores available.
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <LinearProgress color="inherit" sx={{ mt: 1 }} />
                    )}

                </Grid2>
                
                {/* Most Plays */}
                <Grid2
                    bgcolor='lightgreen'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
                    mb={2}
                >
                    {/* Header */}
                    <Box
                        display='flex'
                        alignItems='center'
                    >
                        <Replay fontSize="large"/>
                        <Typography
                            variant="h6"
                            fontWeight='bold'
                            ml={1}
                        >
                            Most Plays (All Modes)
                        </Typography>
                    </Box>

                    
                    {!loading ? (
                        mostPlays && mostPlays.length > 0 ? (
                            mostPlays.map((score) => (
                                <Fragment key={score.id}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box
                                        display="flex"
                                        my={1}
                                        alignItems="center"
                                    >
                                        <Avatar  
                                            src={score.photoUrl}
                                        />
                                        <Typography
                                            flexGrow={1}
                                            ml={1}
                                            noWrap
                                            sx={{
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {score.username}
                                        </Typography>
                                        <Typography
                                            fontWeight="bold"
                                            ml={2}
                                        >
                                            {score.totalGamesPlayed}
                                        </Typography>
                                    </Box>
                                </Fragment>
                            ))
                        ) : (
                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2" color="textSecondary">
                                    No scores available.
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <LinearProgress color="inherit" sx={{ mt: 1 }} />
                    )}

                </Grid2>

            </Grid2>
        </Box>
    )
}
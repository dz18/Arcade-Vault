import { AvTimer, Refresh, Replay, SportsScore } from "@mui/icons-material";
import { Box,Grid2, IconButton, Typography } from "@mui/material";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import Leaderboard from "./leaderboard";

export default function CardMemoryLeaderboards({ mode }) {

    const [loading, setLoading] = useState(false)
    const [bestScores, setBestScores] = useState([])
    const [bestTimes, setBestTimes] = useState([])
    const [mostPlays, setMostPlays] = useState([])

    const [userMap, setUserMap] = useState({})

    const fetchLeaderboards = async (mode) => {
        const leaderboardsRef = collection(db, 'games', 'cardMemory', 'leaderboards')
    
        // Queries for Best Scores, Best Times, and Most Plays
        const bestScoresQuery = query(leaderboardsRef, orderBy(`bestScore.${mode}`, 'desc'), limit(10))
        const bestTimesQuery = query(leaderboardsRef, orderBy(`bestTime.${mode}`, 'desc'), limit(10))
        const mostPlaysQuery = query(leaderboardsRef, orderBy('totalGamesPlayed', 'desc'), limit(10))
    
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

    const handleRefresh = async (mode) => {
        setLoading(true)
        const { bestScores, bestTimes, mostPlays } = await fetchLeaderboards(mode)

        // == Set userMap ==
        const bestScoresIds = bestScores.map(item => item.id);
        const bestTimesIds = bestTimes.map(item => item.id);
        const mostPlaysIds = mostPlays.map(item => item.id);

        // All ids to fetch data for
        const ids = [...new Set([...bestScoresIds, ...bestTimesIds, ...mostPlaysIds])]

        // Get all users data
        const userDocs = await Promise.all(
            ids.map(uid => getDoc(doc(db, 'users', uid)))
        )

        console.log(userDocs)

        const fetchUserData = userDocs.reduce((acc, doc) => {
            if (doc.exists()) {
                acc[doc.id] = doc.data()
            }
            return acc
        }, {})

        setUserMap(fetchUserData)

        setBestScores(bestScores)
        setBestTimes(bestTimes)
        setMostPlays(mostPlays)
        setLoading(false)
    } 

    useEffect(() => {
        const fetchData = async () => {
            handleRefresh(mode)
        }
        fetchData()
    }, [mode])

    return (
        <Box>
            <Box display='flex' gap={1} my={1} alignItems='center'>
                <Typography variant="h5" fontWeight='bold'>Leaderboards</Typography>
                <IconButton
                    title="Refresh"
                    onClick={() => handleRefresh(mode)}
                >
                    <Refresh/>
                </IconButton>
            </Box>
            
            <Grid2 container spacing={2}>

                {/* Best Score */}
                <Leaderboard
                    title='Best Score'
                    icon={<SportsScore fontSize="large"/>}
                    data={bestScores}
                    loading={loading}
                    userMap={userMap}
                    bgcolor='gold'
                    type={1}
                />
                
                {/* Best Time */}
                <Leaderboard
                    title='Best Time'
                    icon={<AvTimer fontSize="large"/>}
                    data={bestTimes}
                    loading={loading}
                    userMap={userMap}
                    bgcolor='skyblue'
                    type={2}
                />
                
                {/* Most Plays */}
                <Leaderboard
                    title='Most Plays'
                    icon={<Replay fontSize="large"/>}
                    data={mostPlays}
                    loading={loading}
                    userMap={userMap}
                    bgcolor='lightgreen'
                    type={3}
                />

            </Grid2>
        </Box>
    )
}
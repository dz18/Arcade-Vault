import { 
    Grid2,
    Box,
    Typography,
    LinearProgress,
    Avatar,
    Divider
} from "@mui/material"
import { Fragment } from "react"

export default function Leaderboard ({icon, loading, data, title, userMap, bgcolor, type}) {
    return (
        <Grid2
            bgcolor={bgcolor}
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
                {icon}
                <Typography
                    variant="h6"
                    fontWeight='bold'
                    ml={1}
                >
                    {title}
                </Typography>
            </Box>

            {/* Leaderboard */}
            {!loading ? (
                data && data.length > 0 ? (
                    data.map((score, i) => (
                        <Fragment key={score.id}>
                            <Divider sx={{ my: 1 }} />
                            <Box
                                display="flex"
                                my={1}
                                alignItems="center"
                            >
                                <Typography fontWeight='bold' mr={1}>{i + 1}.</Typography>
                                <Avatar 
                                    src={userMap[score.id].photoUrl}
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
                                    {userMap[score.id].username}
                                </Typography>
                                {type == 1 &&
                                    <Typography
                                        fontWeight="bold"
                                        ml={1}
                                    >
                                        {score.score}
                                    </Typography>
                                }
                                {type == 2 &&
                                    <Typography
                                        fontWeight="bold"
                                        ml={1}
                                    >
                                        {score.time}
                                    </Typography>

                                }
                                {type == 3 &&
                                    <Typography
                                        fontWeight="bold"
                                        ml={1}
                                    >
                                        {score.totalGamesPlayed}
                                    </Typography>
                                }
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
    )
}
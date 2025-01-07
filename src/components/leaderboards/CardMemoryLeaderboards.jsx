import { AvTimer, Replay, SportsScore } from "@mui/icons-material";
import { Box, Grid2, Typography } from "@mui/material";

export default function CardMemoryLeaderboards() {



    return (
        <Box>
            <Grid2 container spacing={2}>

                {/* Best Score */}
                <Grid2
                    bgcolor='lime'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
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
                </Grid2>
                
                {/* Best Time */}
                <Grid2
                    bgcolor='skyblue'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
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

                </Grid2>
                
                {/* Most Plays */}
                <Grid2
                    bgcolor='orange'
                    p={2}
                    size={{xs: 12, sm: 6, md: 4}}
                    overflow='hidden'
                    borderRadius={2}
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
                            Most Plays
                        </Typography>
                    </Box>

                </Grid2>

            </Grid2>
        </Box>
    )
}
import { 
    Box,
    List,
    ListItem,
    Typography
} from "@mui/material";

export default function CardMemoryInstructions() {
    return(
        <Box>
            <Typography variant="h5" fontWeight='bold' my={1}>Objective</Typography>
            <List  sx={{ listStyleType: 'disc' }}>
                <ListItem sx={{ display: 'list-item' , ml: 4}}>
                    <Typography>Match all pairs of cards on the board within the time limit.</Typography>
                </ListItem>
                <ListItem sx={{ display: 'list-item' , ml: 4}}>
                    <Typography>The fewer moves you make, the better your score!</Typography>
                </ListItem>
            </List>
        </Box>
    )
}
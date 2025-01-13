import { 
    Box,
    Typography
} from "@mui/material";

export default function ComingSoonPage(){
    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh"
            flexDirection='column'
        >
            
            <Typography variant="h1" component="span">
                Coming Soon
            </Typography>
            <Typography variant='h6' component="span" color="textSecondary">
                This page is currently under construction...
            </Typography>
            
        </Box>

    )
}
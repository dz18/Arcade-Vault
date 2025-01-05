import { 
    Box,
    Container
} from "@mui/material";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function Index() {
    return (
        <Box 
            bgcolor='rgb(235, 235, 235)'
            display='flex'
        >

            <SideNav/>

            <Box 
                sx={{
                    maxHeight: '100vh',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    width: '100%'
                }}
            >
                <Container>
                    <Outlet/>
                </Container>
            </Box>
            

        </Box>
    )
}
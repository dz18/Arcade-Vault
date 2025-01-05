import { 
    Box, 
    Button, 
    Typography,
    Divider,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from "@mui/material";
import { 
    Code,
    Gamepad,
    GitHub,
    Home,
    KeyboardDoubleArrowLeftOutlined,
    KeyboardDoubleArrowRightOutlined,
    Person
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SideNav() {

    const navigate = useNavigate()

    const [hide, setHide] = useState(false)

    return (
        <Box
            display='flex'
            flexDirection='row'
        >

            {/* Main Content */}
            <Box
                bgcolor='white'
                width={250}
                height='100vh'
                borderRight='1px solid lightgrey'
                boxSizing='border-box'
                hidden={hide}
            >

                {/* Login/Logout */}
                <Box
                    px={1}
                    py={2}
                    display='flex'
                    alignItems='center'
                >
                    <Button
                        variant="outlined"
                    >
                        Login
                    </Button>
                </Box>
                

                <Divider/>

                {/* Main Buttons */}
                <List>
                    <ListItemButton
                        onClick={() => navigate('/home')}
                    >
                        <ListItemIcon>
                            <Home fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary='Home' />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <Person fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary='Account Details'/>
                    </ListItemButton>
                </List>

                <Divider/>

                {/* Games */}
                
                <Typography
                    px={2}
                    pt={1}
                >
                    Games
                </Typography>
                <List>
                    <ListItemButton
                        onClick={() => navigate('/card-memory')}
                    >
                        <ListItemIcon>
                            <Gamepad fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="Card Memory"/>
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <Gamepad fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="Sudoku"/>
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <Gamepad fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary="Mine Sweeper"/>
                    </ListItemButton>
                </List>

                <Divider/>

                {/* Resources */}

                <Typography
                    px={2}
                    pt={1}
                >
                    Resources
                </Typography>

                <List>
                    <ListItemButton>
                        <ListItemIcon>
                            <GitHub fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary='Source Code'/>
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <Code fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primary='Developers'/>
                    </ListItemButton>
                </List>


            </Box>

            {/* Open/Close Handle */}
            <Box
                width={25}
                height='100vh'
                display='flex'
                alignItems='center'
            >
                {hide ?
                    <Box
                        onClick={() => setHide(!hide)}
                        bgcolor='white'
                        display='flex'
                        alignItems='center'
                        height='35px'
                        border='1px solid lightgrey'
                        borderLeft='none'
                        sx={{
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            cursor: 'pointer'
                        }}
                    >
                        <KeyboardDoubleArrowRightOutlined/>
                    </Box>
                :
                    <Box
                        onClick={() => setHide(!hide)}
                        bgcolor='white'
                        display='flex'
                        alignItems='center'
                        height='35px'
                        width='100%'
                        border='1px solid lightgrey'
                        borderLeft='none'
                        sx={{
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            cursor: 'pointer'
                        }}
                    >
                        <KeyboardDoubleArrowLeftOutlined/>
                    </Box>
                }
            </Box>

        </Box>
    )
}
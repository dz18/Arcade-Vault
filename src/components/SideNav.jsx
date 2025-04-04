import { 
    Box, 
    Button, 
    Typography,
    Divider,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    Skeleton,
    Collapse,
} from "@mui/material";
import { 
    Code,
    Diversity1,
    Gamepad,
    GitHub,
    Home,
    KeyboardDoubleArrowLeftOutlined,
    KeyboardDoubleArrowRightOutlined,
    Logout,
    Message,
    Person,
    Settings
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "../contexts/AuthContext";

export default function SideNav() {

    const navigate = useNavigate()

    const { user, userData, logOut } = useAuth()

    const [loading, setLoading] = useState(false)
    const [hide, setHide] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleSettingsMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const closeSettingsMenu = () => {
        setAnchorEl(null)
    }

    const handleModalOpen = () => {
        setOpenModal(true)
    }

    const handleModalClose = () => {
        setOpenModal(false)
    }

    const handleLogout = async () => {
        await logOut()
        navigate('/home')
        closeSettingsMenu()
    }

    useEffect(() => {
        if (anchorEl && !document.body.contains(anchorEl)) {
            setAnchorEl(null)
        }
    }, [anchorEl]);

    useEffect(() => {
        const fetchdata = () => {
            if (userData?.username == null) {
                setLoading(true)
            } else {
                setLoading(false)
            }
        }
        fetchdata()
    }, [userData])

    return (
        <Box
            display='flex'
            flexDirection='row'
        >

            {/* Main Content */}
            <Collapse
                in={!hide}
                orientation="horizontal"
            >
                <Box
                    bgcolor='white'
                    width={250}
                    height='100vh'
                    boxSizing='border-box'
                >

                    {/* Login/Logout */}
                    <Box
                        px={1}
                        py={2}
                        display='flex'
                        alignItems='center'
                    >
                        {user ?
                            <>
                                <Box 
                                    flexGrow={1} 
                                    display='flex' 
                                    alignItems='center'
                                >
                                    <Avatar
                                        src={userData?.photoUrl}
                                        sx={{
                                            mr: 1,
                                            ml: 1
                                        }}
                                    />
                                    <Typography>
                                        {userData?.username.length < 15 ? userData?.username : userData?.username.slice(0,15) + '...'}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={handleSettingsMenu}
                                >
                                    <Settings/>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={closeSettingsMenu}
                                    keepMounted
                                >
                                    <MenuItem
                                        onClick={handleLogout}
                                    >
                                        <ListItemIcon>
                                            <Logout/>
                                        </ListItemIcon>
                                        <ListItemText primary='Logout'/>
                                    </MenuItem>
                                </Menu>
                            </>
                        :
                            <Button
                                variant="outlined"
                                onClick={handleModalOpen}
                            >
                                Login
                            </Button>
                        }
                        
                    </Box>
                    <LoginModal
                        open={openModal}
                        onClose={handleModalClose}
                        setOpenModal={setOpenModal}
                    />
                    

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
                        <ListItemButton
                            onClick={user ? () => navigate('/account-details') : handleModalOpen}
                        >
                            <ListItemIcon>
                                <Person fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText primary='Account Details'/>
                        </ListItemButton>
                        {user &&
                        <>
                            <ListItemButton onClick={() => navigate('/chatrooms')}>
                                <ListItemIcon>
                                    <Message fontSize="large"/>
                                </ListItemIcon>
                                <ListItemText primary='Chatrooms'/>
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate('/friends')}>
                                <ListItemIcon>
                                    <Diversity1 fontSize="large"/>
                                </ListItemIcon>
                                <ListItemText primary='Friends'/>
                            </ListItemButton>
                        </>
                        }
                    </List>

                    <Divider/>

                    {/* Games */}
                    
                    <Typography
                        px={2}
                        pt={1}
                    >
                        Single-Player Games
                    </Typography>
                    <List>
                        <ListItemButton
                            onClick={() => navigate('/games/card-memory')}
                        >
                            <ListItemIcon>
                                <Gamepad fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText primary="Card Memory"/>
                        </ListItemButton>
                        <ListItemButton
                            onClick={() => navigate('/games/mine-sweeper')}
                        >
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
                        <ListItemButton 
                            LinkComponent='a'
                            href="https://github.com/dz18/game-station"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <GitHub fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText primary='Source Code'/>
                        </ListItemButton>
                        <ListItemButton
                            LinkComponent='a'
                            href="https://github.com/dz18"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <Code fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText primary='Developers'/>
                        </ListItemButton>
                    </List>


                </Box>
            </Collapse>
            

            {/* Open/Close Handle */}
            <Box
                width={25}
                height='100vh'
                display='flex'
                alignItems='center'
                flexDirection='column'
            >
                <Box
                    display='flex'
                    height='auto'
                    flexGrow={1}
                    borderLeft='1px solid lightgrey'
                    width='25px'
                />
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
                <Box
                    display='flex'
                    height='auto'
                    flexGrow={1}
                    borderLeft='1px solid lightgrey'
                    width='25px'
                />
            </Box>

        </Box>
    )
}
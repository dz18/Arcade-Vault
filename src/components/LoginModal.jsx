import { Cancel, X } from "@mui/icons-material";
import { 
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginModal ({ open, onClose, setOpenModal }) {

    const { 
        signUp,
        logIn
    } = useAuth()

    const [SignUp, setSignUp] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleOpenSignUp = () => {
        setSignUp(true)
    }

    const handleCloseSignUp = () => {
        setSignUp(false)
    }

    const handleSignUp = async () => {
        try {
            await signUp(username, email, password)
        } catch (error) {
            console.error('Error handling signup:', error)
        }
        setOpenModal(false)
    }

    const handleLogin = () => {
        setOpenModal(false)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box
                position='absolute'
                top='50%'
                left='50%'
                width={400}
                bgcolor='rgb(235, 235, 235)'
                border={1}
                boxShadow={24}
                borderRadius={1}
                overflow='hidden'
                sx={{
                    transform: 'translate(-50%, -50%)'
                }}
            >

                {/* Header */}
                <Box 
                    bgcolor="white"
                    display='flex'
                    alignItems='center'
                    px={2}
                    py={1}
                    borderBottom='1px solid lightgrey'
                >
                    <Typography 
                        variant="h6" 
                        flexGrow={1}
                    >
                    {SignUp ? 
                        'Create an Account'
                    :
                        'Welcome back!'
                    }
                        
                    </Typography>
                    <IconButton
                        onClick={onClose}
                    >
                        <Cancel/>
                    </IconButton>
                </Box>

                {/* Form */}
                <Box
                    px={2}
                    py={1}
                >
                {SignUp &&
                    <>
                        <Typography>Username</Typography>
                        <TextField
                            placeholder="Username"
                            size="small"
                            fullWidth
                            sx={{ mb : 1 }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </>
                }
                    <Typography>
                        Email
                    </Typography>
                    <TextField
                        placeholder="Email"
                        size="small"
                        fullWidth
                        sx={{ mb : 1 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Typography>
                        Password
                    </Typography>
                    <TextField
                        placeholder="Password"
                        size="small"
                        fullWidth
                        sx={{ mb : 1 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {!SignUp &&
                        <Box
                            sx={{ mb : 1}} 
                        >
                            <Typography 
                                component='span'
                                color="blue"
                                sx={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>
                    }

                    
                    {SignUp ?
                        <Button
                            onClick={handleSignUp}
                            variant="contained"
                            fullWidth
                            sx={{mt: 1}}
                        >
                            Sign Up
                        </Button>
                    :
                        <Button
                            onClick={handleLogin}
                            variant="contained"
                            fullWidth
                        >
                            Login
                        </Button>

                    }
                </Box>
                
                {SignUp ? 
                    <Typography
                        mx={2}
                        my={1}
                    >
                        Already have an Account? {' '}
                        <Typography 
                            component='span'
                            onClick={handleCloseSignUp}
                            color="blue"
                            sx={{ 
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                                Click Here
                        </Typography>
                    </Typography>

                :
                    <Typography
                        mx={2}
                        my={1}
                    >
                        Don't have an Account? {' '}
                        <Typography 
                            component='span'
                            onClick={handleOpenSignUp}
                            color="blue"
                            sx={{ 
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                                Click Here
                        </Typography>
                    </Typography>
                }
                

            </Box>
        </Modal>
    )
}
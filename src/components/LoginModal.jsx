import { Cancel, X } from "@mui/icons-material";
import { 
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button
} from "@mui/material";
import { Link } from "react-router-dom";

export default function LoginModal ({ open, onClose }) {
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
                        Welcome back!
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
                    <Typography>
                        Email
                    </Typography>
                    <TextField
                        placeholder="Email"
                        size="small"
                        fullWidth
                        sx={{ mb : 1 }}
                    />
                    <Typography>
                        Password
                    </Typography>
                    <TextField
                        placeholder="Password"
                        size="small"
                        fullWidth
                        sx={{ mb : 1 }}
                    />

                    <Box
                        sx={{ mb : 1}} 
                    >
                        <Link><Typography 
                            component='span'
                        >
                            Forgot Password?
                        </Typography></Link>
                    </Box>
                    

                    <Button
                        variant="contained"
                        fullWidth
                    >
                        Login
                    </Button>
                </Box>
                
                <Typography
                    mx={2}
                    my={1}
                >
                    Don't have an Account? <Link>Click Here</Link>
                </Typography>

            </Box>
        </Modal>
    )
}
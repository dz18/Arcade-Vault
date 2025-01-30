import { 
    Avatar,
    Box, 
    Button, 
    CircularProgress, 
    TextField, 
    Typography 
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ProfilePicModal from "../components/account/ProfilePicModal";

export default function AccountDetailsPage() {

    const { 
        user, 
        userData,
    } = useAuth()

    const [newUsername, setNewUsername] = useState('')
    const [email, setEmail] = useState('')
    const [userId, setUserId] = useState('')
    const [photoUrlModalOpen, setPhotoUrlModalOpen] = useState(false)

    useEffect(() => {
        if (user) {
            setNewUsername(userData.username)
            setEmail(userData.email)
            setUserId(userData.uid)
        }
    }, [userData])

    const handleUpdate = async () => {
        try {
            const userRef = doc(db, 'users', user.uid)
            await updateDoc(userRef, {
                username: newUsername
            })
        } catch (error) {
            console.error(error)
        }
    }

    const openPhotoUrlModalOpen = () => {
        setPhotoUrlModalOpen(true)
    }

    const closePhotoUrlModalOpen = () => {
        setPhotoUrlModalOpen(false)
    }

    return (
        <Box mt={10}>

            <Box>
                <Typography variant="h3">My Account</Typography>
            </Box>

            <Box
                display='flex'
                alignItems='center'
                gap={2}
                my={2}
                mr={2}
            >
                <Avatar
                    src={userData?.photoUrl}
                    sx={{width: 100, height: 100}}
                />
                <Button
                    variant='outlined'
                    onClick={openPhotoUrlModalOpen}
                >
                    Change Profile Picture
                </Button>
            </Box>
            <ProfilePicModal
                open={photoUrlModalOpen}
                onClose={closePhotoUrlModalOpen}
                currentPhotoUrl={userData?.photoUrl}
            />

            <Box
                display='flex'
                flexDirection='column'
                gap={1}
            >
                
                <Typography mt={1}>Username:</Typography>
                <TextField
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    sx={{
                        width: '50%'
                    }}
                />

                <Typography mt={1}>Email</Typography>
                <TextField
                    value={email}
                    sx={{width: '50%'}}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <Typography mt={1}>id</Typography>
                <TextField
                    value={userId}
                    sx={{width: '50%'}}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />

                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    sx={{width: '50%'}}
                >
                    Update
                </Button>
            </Box>


        </Box>
    )
}
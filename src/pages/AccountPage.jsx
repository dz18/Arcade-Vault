import { 
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

export default function AccountDetailsPage() {

    const { 
        user, 
        userData,
        loading
    } = useAuth()

    const [newUsername, setNewUsername] = useState('')
    const [email, setEmail] = useState('')
    const [userId, setUserId] = useState('')

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

    return (
        <Box mt={10}>

            <Box>
                <Typography variant="h3">My Account</Typography>
            </Box>

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
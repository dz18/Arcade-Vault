import { Add, Cancel } from "@mui/icons-material";
import { 
    Box, 
    Button, 
    Divider, 
    IconButton, 
    MenuItem, 
    Modal,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateChatroomModal({ open, onClose, setOpenModal}) {

    const { userData } = useAuth()

    const [name, setName] = useState('')
    const [friend, setFriend] = useState('')
    const [invitees, setInvitees] = useState([])
    const [friendsMap, setFriendsMap] = useState({})
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                if (userData) {
                    const allFriendsRef = doc(db, 'requests', userData.uid)
                    const snap = await getDoc(allFriendsRef)
                    if (snap.exists()) {
                        const allFriends = snap.data().allFriends
                        setFriendsMap(allFriends)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchFriends()
    }, [userData])

    const addFriend = () => {
        if(!invitees.includes(friend))
            setInvitees(prev => [...prev, friend])
    }

    const removeFriend = (id) => {
        const updatedInvitees = invitees.filter(invitee => invitee !== id)
        setInvitees(updatedInvitees)
        console.log(updatedInvitees)
    };

    const createChatroom = async () => {
        try {

            if (name === '')
                return

            const chatroomRef = collection(db, 'chatrooms')
            await addDoc(chatroomRef, {
                admin : userData.uid,
                users : [...invitees, userData.uid],
                started : new Date(),
                name : name
            })

            setFriend('')
            setName('')
            setInvitees([])
            onClose()
        } catch (error) {
            console.error(error)
        }
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
                    px={2}
                    py={1}
                    borderBottom='1px solid black'
                    display='flex'
                    alignItems='center'
                >
                    <Typography flexGrow={1}>Create your chatroom</Typography>
                    <IconButton
                        onClick={onClose}
                    >
                        <Cancel/>
                    </IconButton>
                </Box>
                

                {/* Form */}
                <Box
                    bgcolor='lightgrey'
                    px={2}
                    py={1}
                >
                    <Typography>
                        Chatroom Name:
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            mb: 1
                        }}
                    />

                    <Typography>
                        Invite Friends:
                    </Typography>
                    <Box>
                        <Select
                            sx={{minWidth: 120}}
                            size="small"
                            value={friend}
                            onChange={(e) => setFriend(e.target.value)}
                        >
                            <MenuItem
                                value=""
                            >
                                None
                            </MenuItem>
                        {Object.keys(friendsMap).map((key, i) => (
                            <MenuItem
                                value={key}
                                key={i}
                            >
                                {friendsMap[key].username}
                            </MenuItem>
                        ))}
                        </Select>
                        <IconButton
                            disabled={friend === '' || invitees.includes(friend)}
                            onClick={addFriend}
                        >
                            <Add/>
                        </IconButton>

                    </Box>

                    <Box
                        mb={2}
                        display='flex'
                        flexWrap='wrap'
                        pt={1}
                    >
                    {invitees.map((id, i) => (
                        <Box
                            key={i}
                            display='flex'
                            alignItems='center'
                            py='2px'
                            bgcolor='rgb(235, 235, 235)'
                            mr={1}
                            my='4px'
                            pr={1}
                            borderRadius={2}
                        >
                            <IconButton
                                onClick={() => removeFriend(id)}
                                size="small"
                            >
                                <Cancel/>
                            </IconButton>
                            <Typography>
                                {friendsMap[id].username}
                            </Typography>
                        </Box>
                    ))}
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={createChatroom}
                    >
                        Create Chatroom
                    </Button>
                </Box>
            </Box>

        </Modal>
    )
}
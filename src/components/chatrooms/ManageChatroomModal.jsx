import { Add, Cancel } from "@mui/icons-material";
import { 
    Box,
    Modal,
    Typography,
    IconButton,
    TextField,
    Select,
    MenuItem,
    Button
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function ManageChatroomModal ({open, onClose, selectedChatroom}) {

    const { userData } = useAuth()

    const [name, setName] = useState('') 
    const [members, setMembers] = useState([])
    const [toBeRemoved, setToBeRemoved] = useState([])

    const [userMap, setUserMap] = useState({})
    const [friendsMap, setFriendsMap] = useState({})
    const [friend, setFriend] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setName(selectedChatroom.name)
                if (userData) {
                    // Fetch friends
                    const allFriendsRef = doc(db, 'requests', userData.uid);
                    const snap = await getDoc(allFriendsRef);
                    let allFriends = {};
                    if (snap.exists()) {
                        allFriends = snap.data().allFriends;
                        setFriendsMap(allFriends)
                    }
    
                    // Initialize the final usersMap with all friends
                    let usersMap = { ...allFriends };
    
                    // Fetch members only if selectedChatroom has users
                    if (selectedChatroom?.users.length > 0) {
                        const userDocs = await Promise.all(
                            selectedChatroom.users.map(uid => getDoc(doc(db, 'users', uid)))
                        );
    
                        // Combine member data from userDocs
                        const fetchMemberData = userDocs.reduce((acc, doc) => {
                            if (doc.exists()) {
                                acc[doc.id] = doc.data();
                            }
                            return acc;
                        }, {});
    
                        // Merge member data into usersMap
                        usersMap = { ...usersMap, ...fetchMemberData };
    
                        // Create members list from merged usersMap and update states
                        const membersList = Object.keys(fetchMemberData).map(key => ({
                            id: key,
                            status: 'member',
                        }));
    

                        setMembers(membersList);
                    }
    
                    // Update usersMap in the state
                    setUserMap(usersMap);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, [userData, selectedChatroom, open]);


    const addFriend = (id) => {
        const membersUpdated = [...members, {id, status : 'non-member'}]
        console.log(membersUpdated)
        setMembers(membersUpdated)
    }

    const removeFriend = (id) => {
        const membersUpdated = members.filter(member => member.id !== id)
        setMembers(membersUpdated)
    } 

    const removeMember = (id) => {
        const toBeRemovedupdated = [...toBeRemoved, id]
        console.log(toBeRemovedupdated)
        setToBeRemoved(toBeRemovedupdated)
        const membersUpdated = members.filter(member => member.id !== id)
        console.log(membersUpdated)
        console.log(userMap)
        setMembers(membersUpdated)
    }

    const cancelRemoval = (id) => {
        const membersUpdated = [...members, {id : id, status: 'member'}]
        setMembers(membersUpdated)
        const toBeRemovedupdated = toBeRemoved.filter(uid => uid !== id)
        setToBeRemoved(toBeRemovedupdated)
    }


    const handleOnClose = () => {
        setName(selectedChatroom?.name || '')
        setFriend('')
        setToBeRemoved([])
        onClose()
    }

    const handleSaveChanges = async () => {
        try {
            const refChatrooms = doc(db, 'chatrooms', selectedChatroom.id)

            const membersUpdated = members.map(member => member.id)

            await updateDoc(refChatrooms, {
                users : membersUpdated,
                name: name
            })

            setToBeRemoved([])

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleOnClose}
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
                    <Typography flexGrow={1}>Manage your chatroom</Typography>
                    <Typography flexGrow={1}></Typography>
                    <IconButton
                        onClick={handleOnClose}
                    >
                        <Cancel/>
                    </IconButton>
                </Box>
                

                {/* Settings */}
                <Box
                    bgcolor='lightgrey'
                    px={2}
                    py={1}
                >
                    <Typography>Chatroom Name:</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Chatroom Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Typography mt={2}>Add Members: </Typography>
                    <Box>
                        <Select
                            value={friend}
                            size="small"
                            sx={{
                                minWidth: 120
                            }}
                            onChange={(e) => setFriend(e.target.value)}
                            
                        >
                            <MenuItem value=''>None</MenuItem>
                            {Object.keys(friendsMap).map((key, i) => (
                                <MenuItem value={key} key={i}>{friendsMap[key].username}</MenuItem>
                            ))}
                        </Select>
                        <IconButton
                            onClick={() => addFriend(friend)}
                            disabled={
                                members.some(member => member.id === friend) || 
                                toBeRemoved.some(id => id === friend ) || 
                                friend === '' 
                            }
                        >
                            <Add/>
                        </IconButton>
                    </Box>

                    <Typography mt={2}>Members: {members.length}</Typography>
                    <Box
                        mb={2}
                        display='flex'
                        flexWrap='wrap'
                    >
                    {members.map((member, i) => (
                        (member.id !== userData.uid &&
                            <Box
                                key={i}
                                display='flex'
                                alignItems='center'
                                py='2px'
                                bgcolor={member.status == 'member' ? 'rgb(235, 235, 235)' : 'lightgreen'}
                                mr={1}
                                my='4px'
                                pr={1}
                                borderRadius={2}
                            >
                                <IconButton
                                    onClick={() => {
                                        if (member.status === 'member') {
                                          removeMember(member.id);
                                        } else {
                                          removeFriend(member.id);
                                        }
                                      }}
                                    size="small"
                                    title="Remove"
                                >
                                    <Cancel/>
                                </IconButton>
                                <Typography>{userMap[member.id]?.username || ''}</Typography>
                            </Box>
                        )
                    ))}
                    </Box>

                    <Typography>To be Removed: {toBeRemoved.length}</Typography>
                    <Box
                        mb={2}
                        display='flex'
                        flexWrap='wrap'
                    >
                        
                    {toBeRemoved.map((id, i) => (
                        <Box
                            key={i}
                            display='flex'
                            alignItems='center'
                            py='2px'
                            bgcolor='lightcoral'
                            mr={1}
                            my='4px'
                            pr={1}
                            borderRadius={2}

                        >   
                            
                            <IconButton
                                onClick={() => cancelRemoval(id)}
                                size="small"
                            >
                                <Cancel/>
                            </IconButton>
                            <Typography>{userMap[id]?.username}</Typography>
                        </Box>
                    ))}
                    </Box>

                    <Button 
                        variant="contained"
                        fullWidth
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </Box>

            </Box>
        </Modal>
    )
}
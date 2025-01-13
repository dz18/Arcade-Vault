import { 
    Check, 
    ContentCopy, 
    Delete, 
    Inbox, 
    KeyboardArrowDown, 
    KeyboardArrowUp 
} from "@mui/icons-material";
import { 
    Avatar, 
    Box, 
    Button, 
    Collapse, 
    IconButton, 
    LinearProgress, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    TextField, 
    Typography 
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { 
    useEffect, 
    useState 
} from "react";
import { 
    doc, 
    getDoc, 
    onSnapshot, 
    setDoc, 
    updateDoc 
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import RemoveFriendDialog from "../components/friends/RemoveFriendDialog";

export default function FriendsPage() {

    const {userData} = useAuth()
    const [friendRequestId, setFriendRequestId] = useState('')
    const [loading, setLoading] = useState(false)

    const [allFriendsList, setAllFriendsList] = useState({})
    const [FriendRequestsList, setFriendRequestsList] = useState({})
    const [YourRequestsList, setYourRequestsList] = useState({})
    const [hideAllFriends, setHideAllFriends] = useState(false)
    const [hideFriendRequests, setHideFriendRequests] = useState(true)
    const [hideYourRequests, setHideYourRequests] = useState(true)
    const [openRemoveFriendDialog, setOpenRemoveFriendDialog] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(null);
    useEffect(() => {
        let unsubscribe; // To clean up the listener
        if (userData?.username) {
            const requestRef = doc(db, 'requests', userData.uid);
    
            unsubscribe = onSnapshot(
                requestRef,
                (docSnap) => {
                    if (docSnap.exists()) {
                        const requestData = docSnap.data();
                        setAllFriendsList(requestData.allFriends || {});
                        setFriendRequestsList(requestData.friendRequests || {});
                        setYourRequestsList(requestData.ownRequests || {});
                    } else {
                        console.warn('No request data found for this user.');
                        setAllFriendsList({});
                        setFriendRequestsList({});
                        setYourRequestsList({});
                    }
                },
                (error) => {
                    console.error('Error fetching real-time updates:', error);
                }
            );
        }
    
        return () => {
            // Clean up the onSnapshot listener
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [userData]);
    
    const sendFriendRequest = async () => {
        setLoading(true)
        if (!userData?.uid || !friendRequestId || userData?.uid === friendRequestId) {
            alert("Invalid friend request.");
            setLoading(false)
            return;
        }
    
        try {
            const senderRef = doc(db, 'requests', userData.uid);
            const recipientRef = doc(db, 'requests', friendRequestId);
    
            // Check if recipient's document exists, if not, create it
            const recipientSnap = await getDoc(recipientRef);
            if (!recipientSnap.exists()) {
                await setDoc(recipientRef, { friendRequests: {}, allFriends: {} });
            }
    
            const recipientData = recipientSnap.exists() ? recipientSnap.data() : {};
            const recipientFriendRequests = recipientData.friendRequests || {};
            const recipientAllFriends = recipientData.allFriends || {};
    
            if (recipientFriendRequests[userData.uid]) {
                alert('Friend Request is already sent');
                setLoading(false)
                setFriendRequestId('')
                return;
            }
    
            if (recipientAllFriends[userData.uid]) {
                alert('You are already friends with this person');
                setLoading(false)
                setFriendRequestId('')
                return;
            }
    
            // Check if sender is already friends with the recipient
            const senderSnap = await getDoc(senderRef);
            const senderData = senderSnap.exists() ? senderSnap.data() : {};
            const senderAllFriends = senderData.allFriends || {};
            if (senderAllFriends[friendRequestId]) {
                alert('You are already friends with this person');
                setLoading(false)
                setFriendRequestId('')
                return;
            }
    
            const timestamp = new Date();
            await updateDoc(recipientRef, {
                friendRequests: {
                    ...recipientFriendRequests,
                    [userData.uid]: {
                        photoUrl: userData.photoUrl,
                        username: userData.username,
                        status: 'requested',
                        timestamp: timestamp,
                    },
                },
            });
    
            // Check if sender's document exists, if not, create it
            if (!senderSnap.exists()) {
                await setDoc(senderRef, { ownRequests: {} });
            }
    
            const senderOwnRequests = senderData.ownRequests || {};
    
            // Get recipient username
            const recipientUserRef = doc(db, 'users', friendRequestId);
            const recipientUserSnap = await getDoc(recipientUserRef);
    
            await updateDoc(senderRef, {
                ownRequests: {
                    ...senderOwnRequests,
                    [friendRequestId]: {
                        photoUrl: recipientUserSnap.data().photoUrl,
                        username: recipientUserSnap.data().username,
                        status: 'requested',
                        timestamp: timestamp,
                    },
                },
            });
    
            alert('Friend Request Sent');
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request.');
        }
    
        setLoading(false);
        setFriendRequestId('');
    }

    const acceptFriendRequest = async (senderId) => {
        try {
            const recipientRef = doc(db, 'requests', userData.uid)
            const senderRef = doc(db, 'requests', senderId)

            // Update on current users end 
            const recipientSnap = await getDoc(recipientRef)
            if (recipientSnap.exists()) {
                // Update friend Requests
                const data = recipientSnap.data()
                const friendRequest = data.friendRequests[senderId]
                delete data.friendRequests[senderId]

                // Update All Friends
                data.allFriends[senderId] = {
                    photoUrl: friendRequest.photoUrl,
                    username: friendRequest.username,
                    timestamp: new Date()
                }

                // add it to firebase
                await updateDoc(recipientRef, {
                    friendRequests : {
                        ...data.friendRequests
                    },
                    allFriends : {
                        ...data.allFriends
                    }
                })
            }

            // Update on Senders End
            const senderSnap = await getDoc(senderRef)
            if (senderSnap.exists()) {
                // Update ownRequests
                const data = senderSnap.data()
                const ownRequest = data.ownRequests[userData.uid]
                ownRequest.status = 'accepted'

                data.allFriends[userData.uid] = {
                    username: ownRequest.username,
                    photoUrl: ownRequest.photoUrl,
                    timestamp: new Date()
                }
                
                await updateDoc(senderRef, {
                    ownRequests : {
                        ...data.ownRequests
                    },
                    allFriends : {
                        ...data.allFriends
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const denyFriendRequest = async (senderId) => {
        try {
            const recipientRef = doc(db, 'requests', userData.uid)
            const senderRef = doc(db, 'requests', senderId)

            // Update on current users end 
            const recipientSnap = await getDoc(recipientRef)
            if (recipientSnap.exists()) {
                // Update friend Requests
                const data = recipientSnap.data()
                delete data.friendRequest[senderId]
                await updateDoc(recipientRef, {
                    friendRequests : {
                        ...data.friendRequests
                    }
                })
            }

            // Update on Senders End
            const senderSnap = await getDoc(senderRef)
            if (senderSnap.exists()) {
                // Update ownRequests
                const data = senderSnap.data()
                const ownRequest = data.ownRequests[userData.uid]
                ownRequest.status = 'denied'
                
                await updateDoc(senderRef, {
                    ownRequests : {
                        ...data.ownRequests
                    },
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const removeFriend = async (friendsId) => {
        try {
            const currentUserRef = doc(db, 'requests', userData.uid);
            const friendsRef = doc(db, 'requests', friendsId);

            const currentUserSnap = await getDoc(currentUserRef)
            if (currentUserSnap.exists()) {
                const data = currentUserSnap.data()
                delete data.allFriends[friendsId]
                await updateDoc(currentUserRef, {
                    allFriends: {
                        ...data.allFriends
                    }
                })
            }
            
            const friendsSnap = await getDoc(friendsRef)
            if (friendsSnap.exists()) {
                const data = friendsSnap.data()
                delete data.allFriends[userData.uid]
                await updateDoc(friendsRef, {
                    allFriends: {
                        ...data.allFriends
                    }
                })
            }

        } catch (error) {
            console.error(error)
        }
    }

    const openDialog = (key) => {
        setSelectedFriend({ key, username: allFriendsList[key].username });
        setOpenRemoveFriendDialog(true);
    };

    const closeDialog = () => {
        setOpenRemoveFriendDialog(false);
        setSelectedFriend(null);
    };
    
    // TODO: Redesign each section into its own component and use context to avoid prop drilling
    return (
        <Box mt={10}>

            <Typography variant="h6">Send a Friend Request by ID</Typography>
            <Box
                display='flex'
                alignItems='center'
                mb={1}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="UserId"
                    value={friendRequestId}
                    onChange={(e) => setFriendRequestId(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={sendFriendRequest}
                    disabled={loading}
                    sx={{ml: 1}}
                >
                    Send
                </Button>
            </Box>
            {loading &&
                <LinearProgress sx={{mb: 2}}/>
            }

            {/* All Friends */}
            <Box
                mb={1}
                bgcolor={'white'}
                borderRadius={2}
            >
                {/* Header */}
                <Box
                    onClick={() => setHideAllFriends(!hideAllFriends)}
                    bgcolor='white'
                    p={1}
                    display='flex'
                    alignItems='center'
                    borderRadius={2}
                    sx={{
                        cursor : 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            boxShadow: 5
                        },
                    }}
                >
                    {hideAllFriends ?
                        <KeyboardArrowDown sx={{mr : 2}}/>
                    :
                        <KeyboardArrowUp sx={{mr : 2}}/>
                    }
                    
                    <Typography variant="h6" >All Friends</Typography>
                </Box>

                {/* List of Friends */}
                <Collapse in={hideAllFriends}>
                {Object.keys(allFriendsList).length !== 0 ? (
                    <List>
                    {Object.keys(allFriendsList).map((key) => (
                        <>
                        <ListItem 
                            key={key}
                            secondaryAction={
                                <>
                                <IconButton
                                    onClick={() => openDialog(key)}
                                    title="Remove Friend"
                                >
                                    <Delete/>
                                </IconButton>
                                <IconButton
                                    onClick={() => navigator.clipboard.writeText(String(key))}
                                    title="Copy ID"
                                >
                                    <ContentCopy/>
                                </IconButton>
                                </>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar />
                            </ListItemAvatar>
                            <ListItemText
                                primary={allFriendsList[key].username}
                                secondary={allFriendsList[key].status}
                            />
                        </ListItem>
                        
                        {selectedFriend && (
                            <RemoveFriendDialog
                                username={selectedFriend.username}
                                friendKey={selectedFriend.key}
                                open={openRemoveFriendDialog}
                                onClose={closeDialog}
                                removeFriend={removeFriend}
                            />
                        )}
                        </>
                    ))}
                    </List>
                ) : (
                    <Typography
                        variant='h6' 
                        color="textSecondary"
                        textAlign='center'
                        my={1}
                    >
                        No Friends Yet. Send a friend Request by Id in the form above
                    </Typography>
                )}
                </Collapse>

                

            </Box>

            {/* Inbox Label */}
            <Box
                display='flex'
                alignItems='center'
                mt={2}
            >
                <Inbox sx={{mr: 1}}/>
                <Typography variant="h6">Inbox</Typography>
            </Box>

            {/* Friend Requests */}
            <Box
                mb={1}
                bgcolor={'white'}
                borderRadius={2}
            >
                {/* Header */}
                <Box   
                    onClick={() => setHideFriendRequests(!hideFriendRequests)}
                    bgcolor='white'
                    p={1}
                    display='flex'
                    alignItems='center'
                    borderRadius={2}
                    sx={{
                        cursor : 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            boxShadow: 5
                        }
                    }}
                >
                    {hideFriendRequests ?
                        <KeyboardArrowDown sx={{mr : 2}}/>
                    :
                        <KeyboardArrowUp sx={{mr : 2}}/>
                    }
                    
                    <Typography variant="h6">Friend Requests</Typography>
                </Box>

                {/* List of Friends */}
                <Collapse in={hideFriendRequests}>
                {Object.keys(FriendRequestsList).length !== 0 ? (
                    <List>
                    {Object.keys(FriendRequestsList).map((key) => (
                        <ListItem key={key}
                            secondaryAction={
                                <>
                                {FriendRequestsList[key].status !== 'accepted' && 
                                    FriendRequestsList[key].status !== 'denied' &&
                                    <>
                                        <IconButton 
                                            sx={{m: 1}} 
                                            onClick={() => acceptFriendRequest(key)}
                                            title="Accept Friend Request"
                                        >
                                            <Check />
                                        </IconButton>
                                        <IconButton 
                                            sx={{m: 1}} 
                                            onClick={() => denyFriendRequest(key)}
                                            title="Deny Friend Request"
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </>
                                }
                                    <IconButton 
                                        sx={{m: 1}} 
                                        onClick={() => navigator.clipboard.writeText(String(key))}
                                        title="Copy ID"
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </>
                                
                            }
                        >
                            <ListItemAvatar>
                                <Avatar/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={FriendRequestsList[key].username}
                                secondary={FriendRequestsList[key].status}
                            />
                        </ListItem>
                    ))}
                    </List>
                ) : (
                    
                    <Typography
                        variant='h6' 
                        color="textSecondary"
                        textAlign='center'
                        my={1}
                    >
                        No Friend Requests
                    </Typography>
                    
                )}
                
                </Collapse>
            </Box>

            {/* Own Requests */}
            <Box
                mb={1}
                bgcolor={'white'}
                borderRadius={2}
            >
                {/* Header */}
                <Box
                    onClick={() => setHideYourRequests(!hideYourRequests)}
                    bgcolor='white'
                    p={1}
                    display='flex'
                    alignItems='center'
                    borderRadius={2}
                    sx={{
                        cursor : 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            boxShadow: 5
                        },
                    }}
                >
                    {hideYourRequests ?
                        <KeyboardArrowDown sx={{mr : 2}}/>
                    :
                        <KeyboardArrowUp sx={{mr : 2}}/>
                    }
                    <Typography variant="h6">Your Requests</Typography>
                </Box>

                {/* List of Friends */}
                <Collapse in={hideYourRequests}>
                {Object.keys(YourRequestsList).length !== 0 ? (
                    <List>
                    {Object.keys(YourRequestsList).map((key) => (
                        <ListItem
                            key={key}
                            secondaryAction={
                            <IconButton
                                sx={{ m: 1 }}
                                onClick={() => navigator.clipboard.writeText(String(key))}
                                title="Copy ID"
                            >
                                <ContentCopy />
                            </IconButton>
                            }
                        >
                            <ListItemAvatar>
                            <Avatar />
                            </ListItemAvatar>
                            <ListItemText
                            primary={YourRequestsList[key].username}
                            secondary={YourRequestsList[key].status}
                            />
                        </ListItem>
                    ))}
                    </List>
                    ) : (
                        <Typography
                            variant='h6' 
                            color="textSecondary"
                            textAlign='center'
                            my={1}
                        >
                            No Sent Requests
                        </Typography>
                    )}
                </Collapse>
            </Box>

            


        </Box>
    )
}
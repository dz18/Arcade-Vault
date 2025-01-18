import { 
    Box, 
    Typography,
    Button,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    IconButton,
    Collapse,
    TextField,
    Avatar
} from "@mui/material";
import { 
    addDoc,
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    onSnapshot, 
    orderBy, 
    query, 
    where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { 
    Add, 
    Chat, 
    Delete, 
    Edit, 
    FilterAlt, 
    Height, 
    KeyboardDoubleArrowLeft, 
    KeyboardDoubleArrowRight, 
    MoreVert, 
    Send, 
    Sort
} from "@mui/icons-material";
import CreateChatroomModal from "../components/chatrooms/createChatroomModal";
import ManageChatroomModal from "../components/chatrooms/ManageChatroomModal";

export default function ChatroomPage () {

    const {userData} = useAuth()
    const [userMap, setUserMap] = useState({})

    const [chatrooms, setChatrooms] = useState([])
    const [selectedChatroom, setSelectedChatroom] = useState(null)
    const [chatroomMessages, setChatroomMessages] = useState([])
    const [loadingChatMessages, setLoadingChatMessages] = useState(true)
    const [message, setMessage] = useState('')

    const [showChatrooms, setShowChatrooms] = useState(true) 
    const [showCreate, setShowCreate] = useState(false) // Open/closes the create chatroom modal
    const [showManageChatroom, setShowManageChatroom] = useState(false)

    // Fetch all the chatrooms the user is included in
    useEffect(() => {
        setLoadingChatMessages(true)
        const fetchChatrooms = async () => {
            try {
                setLoadingChatMessages(true)
                if (userData?.uid) {
                    const chatroomsRef = collection(db, 'chatrooms')
                    const q = query(chatroomsRef, where('users', 'array-contains', userData.uid))

                    const unsubscribe = onSnapshot(q, async(snapshot) => {
                        const chatrooms = snapshot.docs.reduce((acc, doc) => {
                            const data = { id: doc.id, ...doc.data() }
                            acc[doc.id] = data
                            return acc
                        }, {})
                        console.log(chatrooms)
                        setChatrooms(chatrooms)
                    })
                    return () => unsubscribe()
                }
                setLoadingChatMessages(false)
            } catch (error) {
                console.error('Error fetching chatrooms:', error)
                setLoadingChatMessages(false)
            }
        }
        fetchChatrooms()
    }, [userData])

    // Fetch the chatroom data when a chatroom is selected
    useEffect(() => {
        const fetchMessagesAndUsers = async () => {
            if (selectedChatroom) {
                const messagesRef = collection(db, 'chatrooms', chatrooms[selectedChatroom].id, 'messages');
                const q = query(messagesRef, orderBy('timestamp', 'asc'));

                const unsubscribe = onSnapshot(q, async (snapshot) => {
                    const messages = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        direction: userData.uid === doc.data().uid ? 'sent' : 'received',
                        ...doc.data(),
                    }));

                    setChatroomMessages(messages);
    
                    // Fetch user data for all unique UIDs in the messages
                    const userIds = [...new Set(messages.map((message) => message.uid))];
                    const uidsToFetch = userIds.filter((uid) => !userMap[uid]);
    
                    if (uidsToFetch.length > 0) {
                        const userDocs = await Promise.all(
                            uidsToFetch.map((uid) => getDoc(doc(db, 'users', uid)))
                        );
    
                        const fetchedUserData = userDocs.reduce((acc, doc) => {
                            if (doc.exists()) {
                                acc[doc.id] = doc.data(); // doc.id is the UID
                            }
                            return acc;
                        }, {});
    
                        setUserMap((prev) => ({ ...prev, ...fetchedUserData }));
                    }
                });
    
                return () => unsubscribe();
            } else {
                setChatroomMessages([]);
            }
        };
    
        fetchMessagesAndUsers();
    }, [selectedChatroom, userData, userMap])

    const handleSelectChatroom = (id) => {
        console.log(id)
        setSelectedChatroom(id)
    }
    
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(date))
    }

    const sendMessage = async () => {
        try {
            const newMessage = {
                text : message,
                timestamp : new Date(),
                uid: userData.uid,
            }
            const messageRef = collection(db, 'chatrooms', chatrooms[selectedChatroom].id, 'messages')
            await addDoc(messageRef, newMessage)
            setMessage('')
        } catch (error) {
            console.error(error)
        }
    }

    const openCreateChatroom = () => {
        setShowCreate(true)
    }

    const closeCreateChatroom = () => {
        setShowCreate(false)
    }

    const openManageChatroom = () => {
        setShowManageChatroom(true)
    }
    
    const closeManageChatroom = () => {
        setShowManageChatroom(false)
    }
    
    return (
        <Box mt={10}>

            {/* Chatroom Components */}
            <Box
                mt={1}
                display='flex'
                flexDirection='row'
            >
                {/* Side Nav */}
                <Collapse
                    in={showChatrooms}
                    orientation="horizontal"
                >
                    <Box
                        bgcolor="white"
                        borderRadius={2}
                        boxSizing="border-box"
                        height="75vh"
                        width={250}
                        mr={1}
                        overflow="hidden"
                        display="flex"
                        flexDirection="column"
                    >
                        {chatrooms.length !== 0 ? (
                            <Box 
                                flexGrow={1} 
                                overflow='auto'
                                sx={{
                                    '&::-webkit-scrollbar': {
                                        width: '8px', // Adjust scrollbar width
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#c1c1c1', // Thumb color
                                        borderRadius: '8px', // Rounded corners
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        backgroundColor: '#a8a8a8', // Thumb hover color
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#f1f1f1', // Track color
                                    },
                                }}
                            >
                                <List>
                                    {Object.keys(chatrooms).map((chatroomId, i) => (
                                        <ListItemButton 
                                            key={i}
                                            onClick={() => handleSelectChatroom(chatroomId)}
                                            selected={selectedChatroom === chatroomId ? true : false}
                                            
                                        >
                                            <ListItemIcon>
                                                <Chat />
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <Typography>
                                                    {chatrooms[chatroomId].name}
                                                </Typography>
                                            } />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexGrow={1}
                            >
                                <Typography
                                    align="center"
                                    color="text.secondary"
                                    fontStyle="italic"
                                >
                                    No Chatrooms available
                                </Typography>
                            </Box>
                        )}
                        
                        {/* Chatroom Tools */}
                        <Box
                            p={1}
                            borderTop='1px solid lightgrey'
                            display='flex'
                            alignItems='center'
                            justifyContent='space-evenly'
                        >
                            <IconButton
                                title="Sort Chatrooms"
                                disabled={chatrooms[selectedChatroom]?.admin === userData?.uid ? false : true}
                            >
                                <Sort/>
                            </IconButton>
                            <IconButton
                                onClick={openCreateChatroom}
                                title="Create Chatroom"
                            >
                                <Add/>
                            </IconButton>
                            <IconButton
                                title="Filter Chatrooms"
                                disabled={chatrooms[selectedChatroom]?.admin === userData?.uid ? false : true}
                            >
                                <FilterAlt/>
                            </IconButton>
                        </Box>

                    </Box>
                    <CreateChatroomModal
                        open={showCreate}
                        onClose={closeCreateChatroom}
                    />
                </Collapse>
                

                {/* Chatroom */}
                <Box
                    bgcolor='white'
                    boxSizing='border-box'
                    borderRadius={2}
                    height='75vh'
                    flexGrow={1}
                    overflow='hidden'
                    display='flex'
                    flexDirection='column'
                >

                    {/* Messages Header */}
                    <Box
                        borderBottom='1px solid lightgrey'
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        p={1}
                    >
                        {/* Show/Hide All Chatrooms */}
                        <IconButton
                            onClick={() => setShowChatrooms(!showChatrooms)}
                            title="Hide all chatrooms"
                        >
                            {showChatrooms ? 
                                <KeyboardDoubleArrowLeft/>
                            :
                                <KeyboardDoubleArrowRight/>
                            }
                        </IconButton>

                        {/* Title */}
                        <Typography 
                            align="center"
                            variant="h6"
                            color={chatrooms[selectedChatroom] ? null : "text.secondary"}
                            fontStyle={chatrooms[selectedChatroom] ? null :'italic'}
                            flexGrow={1}
                        >
                            {chatrooms[selectedChatroom] ? chatrooms[selectedChatroom].name :'No chatroom selected'}
                        </Typography>

                        <IconButton
                            onClick={openManageChatroom}
                            disabled={selectedChatroom == null || chatrooms[selectedChatroom]?.admin !== userData?.uid ? true : false}
                            title="Manage Chatroom"
                        >
                            <MoreVert/>
                        </IconButton>
                        <ManageChatroomModal
                            open={showManageChatroom}
                            onClose={closeManageChatroom}
                            selectedChatroom={chatrooms[selectedChatroom]} 
                        />
                    </Box>

                    {/* All Messages */}
                    <Box 
                        display='flex'
                        flexDirection='column'
                        flexGrow={1}
                        overflow='auto'
                        gap={1}
                        pt={1}
                    >
                    {chatroomMessages.map((message, i) => {
                        const user = userMap[message.uid];
                        return (
                            <Box
                                key={i}
                                display='flex'
                                flexDirection='row'
                                alignItems='center'
                                ml={1}
                            >
                                <Avatar
                                    src={user?.photoUrl || ''}
                                    alt={user?.name || 'User'}
                                />
                                <Box ml={1}>
                                    <Box>
                                        <Typography variant="body2" fontWeight='bold'>
                                            {user?.username || 'i hate this'}{' '}
                                            <Typography 
                                                color="text.secondary"
                                                variant="caption"
                                            > 
                                                {message?.timestamp && formatDate(message.timestamp.toDate())}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    
                                    <Typography
                                        boxSizing='border-box'
                                    >
                                        {message.text}
                                    </Typography> 
                                </Box>
                                
                            </Box>
                        )
                    })}
                    </Box>

                    {/* Inputs and stuff */}
                    <Box
                        display='flex'
                        flexDirection='row'
                        p={1}
                        borderTop='1px solid lightgrey'
                    >
                   
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Send a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={selectedChatroom == null ? true : false}
                        />

                        <Button 
                            sx={{ml: 1}}
                            disabled={selectedChatroom == null ? true : false}
                            onClick={sendMessage}
                        >
                            <Send/>
                        </Button>

                    </Box>
                </Box>
            </Box>

            {/* How-To-Use Guide */}                
            <Box mt={5}>
                <Typography 
                    variant="h4"
                    fontWeight='bold'
                >
                    Rules & Instructions
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="subtitle1"
                >
                    Scroll down to read simple to follow rules & instructions 
                </Typography>
                <Typography mt={1}>
                    {/* Enter Instructions here */}
                </Typography>
            </Box>

        </Box>  
    )
}
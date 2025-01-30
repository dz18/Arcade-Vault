import { 
    Box,
    Avatar,
    Typography,
} from "@mui/material"

export default function Message({user, message, key}) {

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

    return (
        <Box
            key={key}
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
}
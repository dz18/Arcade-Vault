import { Cancel, CloudUpload } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    LinearProgress,
    Modal,
    Typography,
} from "@mui/material";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../../../firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";

export default function ProfilePicModal({ open, onClose, currentPhotoUrl }) {

    const {userData} = useAuth()

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        setPreviewUrl(currentPhotoUrl)
    }, [currentPhotoUrl])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemovePicture = () => {
        setFile(null);
        setPreviewUrl("");
    };

    const handleConfirmPicture = async () => {
        if (file) {
            try {
                setUploading(true)
                const storageRef = ref(storage, `photoUrls/${userData.uid}`)
                await uploadBytes(storageRef, file)

                const downloadURL = await getDownloadURL(storageRef)

                const userRef = doc(db, 'users', userData.uid)
                await updateDoc(userRef, {
                    photoUrl : downloadURL
                })
            } catch (error) {
                console.error(error)
            } finally {
                setUploading(false)
                onClose()
            }
        } else {
            setUploading(true)
            try{
                const storageRef = ref(storage, `photoUrls/${userData.uid}`)
                await deleteObject(storageRef)
                const userRef = doc(db, 'users', userData.uid)
                await updateDoc(userRef, {
                    photoUrl : ''
                })
            } catch (error) {
                if(error.code === 'storage/object-not-found') {
                    const userRef = doc(db, 'users', userData.uid)
                    await updateDoc(userRef, {
                        photoUrl : ''
                    })
                } else {
                    console.error(error)
                }
            } finally {
                setUploading(false)
                onClose()
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                position="absolute"
                top="50%"
                left="50%"
                width={400}
                bgcolor="rgb(235, 235, 235)"
                border={1}
                boxShadow={24}
                borderRadius={1}
                overflow="hidden"
                sx={{
                    transform: "translate(-50%, -50%)",
                }}
            >
                {/* Header */}
                <Box
                    display="flex"
                    alignItems="center"
                    borderBottom="1px solid black"
                    px={2}
                    py={1}
                >
                    <Box flexGrow={1}>
                        <Typography>Upload New Profile Picture</Typography>
                        <Typography variant="subtitle2" color="grey">
                            Click on the avatar to upload photo
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <Cancel />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box bgcolor="lightgrey" px={2} py={1}>
                    {/* Avatar with file input */}
                    <Box display="flex" justifyContent="center" px={1} py={2}>
                        <label htmlFor="upload-button">
                            <Avatar
                                src={previewUrl}
                                sx={{
                                    width: 200,
                                    height: 200,
                                    cursor: "pointer",
                                }}
                            />
                        </label>
                        <input
                            id="upload-button"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </Box>

                    {/* Remove Current Picture Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mb: 1 }}
                        color="error"
                        onClick={handleRemovePicture}
                    >
                        Remove Current Picture
                    </Button>

                    {/* Confirm Profile Picture Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleConfirmPicture}
                        startIcon={<CloudUpload />}
                    >
                        Confirm Profile Picture
                    </Button>

                    {uploading &&
                        <LinearProgress sx={{mt: 1}}/>
                    }

                </Box>
            </Box>
        </Modal>
    );
}
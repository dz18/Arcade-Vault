import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle,
    Button
 } from "@mui/material"
import { doc, getDoc } from "firebase/firestore"
import { Fragment, useEffect, useState } from "react"
import { db } from "../../../firebaseConfig"

export default function RemoveFriendDialog ({username, friendKey, open, onClose, removeFriend}) {

    const handleRemoveFriend = () => {
        removeFriend(friendKey)
        onClose()
    }

    return (
        <Fragment>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to remove <b>{username}</b> as your friend. Are you sure you want to continue with this action?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={handleRemoveFriend}
                        variant="outlined"
                        color="error"
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)

    const signUp = async (username, email, password) => {
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password)
            const newUser = credentials.user

            const userData = {
                uid: newUser.uid,
                username,
                email,
                joined: new Date()
            }

            const docRef = doc(db, 'users', newUser.uid)
            await setDoc(docRef, userData)
        } catch (error) {
            console.error('Error Signing Up:', error)
        }
    }

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = async() => {
        await signOut(auth)
        setUser(null)
        setUserData(null)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                // User is SignedIn
                const docRef = doc(db, "users", currentUser.uid);

                // Listen for real-time updates
                const unsubscribeFromSnapshot = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.error("No such document!");
                        setUserData(null);
                    }
                });

                return () => unsubscribeFromSnapshot();
            } else {
                setUserData(null)
            }
            setLoading(false)

        })

        return unsubscribe
    }, [])

    const value = {
        user,
        userData,
        signUp,
        logIn,
        logOut,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
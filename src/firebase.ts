import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, onSnapshot, updateDoc, addDoc, getDocFromServer, getDocs, deleteDoc } from 'firebase/firestore';
import { UserProfile } from './types';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Helper for Google Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Check for pending user with same email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      let role: 'superadmin' | 'admin' | 'operator' = 'operator';
      let assignedProjects: string[] = [];
      let displayName = user.displayName;

      if (user.email === 'datacenter.kartawijaya@gmail.com') {
        role = 'superadmin';
      }

      if (!querySnapshot.empty) {
        // Migrate pending user
        const pendingUser = querySnapshot.docs[0].data();
        role = pendingUser.role;
        assignedProjects = pendingUser.assignedProjects || [];
        displayName = pendingUser.displayName || user.displayName;
      }
      
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        assignedProjects: assignedProjects
      });
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const loginWithCredentials = async (username: string, password: string): Promise<UserProfile> => {
  // Hardcoded Superadmin for initial setup
  if (username === 'kartawijaya' && password === 'km1234') {
    try {
      // Sign in anonymously to get a UID for Firestore rules
      const authResult = await signInAnonymously(auth);
      const uid = authResult.user.uid;
      
      const profile: UserProfile = {
        uid: uid,
        email: 'datacenter.kartawijaya@gmail.com',
        displayName: 'Superadmin Kartawijaya',
        username: 'kartawijaya',
        password: 'km1234',
        role: 'superadmin',
        assignedProjects: []
      };

      // Sync to Firestore so rules can see it
      await setDoc(doc(db, 'users', uid), profile);
      
      return profile;
    } catch (error) {
      console.error("Anonymous Sign-in Error:", error);
      throw error;
    }
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Username atau password salah");
    }
    
    const userData = querySnapshot.docs[0].data() as UserProfile;
    const oldDocId = querySnapshot.docs[0].id;

    // Sign in anonymously to get a UID for Firestore rules
    const authResult = await signInAnonymously(auth);
    const uid = authResult.user.uid;

    // Sync the profile to the new anonymous UID
    const newProfile = { ...userData, uid: uid };
    
    await setDoc(doc(db, 'users', uid), newProfile);
    
    return newProfile;
  } catch (error) {
    console.error("Credential Login Error:", error);
    throw error;
  }
};

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Error handler helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import app from './config';

// Initialize Firestore
const db = getFirestore(app);

// Define RSVP type
export interface RSVPData {
  id?: string;
  name: string;
  email: string;
  attendance: 'yes' | 'no' | 'maybe';
  guests: number;
  message: string;
  createdAt?: Date | Timestamp; // Support both Date and Timestamp for compatibility
}

// Add RSVP to Firestore
export const addRSVP = async (rsvpData: Omit<RSVPData, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      ...rsvpData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding RSVP: ', error);
    throw error;
  }
};

// Get all RSVPs from Firestore
export const getRSVPs = async (): Promise<RSVPData[]> => {
  try {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    
    const rsvps: RSVPData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rsvps.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        attendance: data.attendance,
        guests: data.guests,
        message: data.message,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      });
    });
    
    return rsvps;
  } catch (error) {
    console.error('Error getting RSVPs: ', error);
    throw error;
  }
};
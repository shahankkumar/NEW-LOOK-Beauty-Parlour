import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Your web app's Firebase configuration
// REPLACE these placeholder values with your actual config from the Firebase Console:
// Firebase Console > Project Settings > General > Your Apps > Web SDK configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Jlpje0k9rq7xv6dT2TPwCZZ-M3CDs7M",
  authDomain: "new-look-d18db.firebaseapp.com",
  projectId: "new-look-d18db",
  storageBucket: "new-look-d18db.firebasestorage.app",
  messagingSenderId: "199411613694",
  appId: "1:199411613694:web:6397c253ff713ed4d74aaf",
  measurementId: "G-JWW6FM2CN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

// ==========================================
// FIREBASE SERVICE UTILITIES FOR GALLERY
// ==========================================

/**
 * Uploads a local file (image or video) to Firebase Storage and returns the download URL
 * @param {File} file - The file object from input type="file"
 * @returns {Promise<string>} The public download URL of the uploaded file
 */
export const uploadMediaToStorage = async (file) => {
  try {
    // Generate a unique filename using timestamp
    const fileExtension = file.name.split('.').pop();
    const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    // Upload bytes to Cloud Storage
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get and return the public URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    throw error;
  }
};

/**
 * Adds a new item to the Firestore gallery collection
 * @param {Object} item - { title, category, imagePathOrUrl, isVideo, storagePath }
 */
export const addGalleryItemToFirestore = async (item) => {
  try {
    const galleryCol = collection(db, 'gallery');
    await addDoc(galleryCol, {
      title: item.title,
      category: item.category,
      image: item.image, // Download URL or web link URL
      isVideo: item.isVideo,
      storagePath: item.storagePath || null, // Saved so we can delete the file from Storage later if needed
      likes: '0',
      comments: '0',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Firestore Add Document Error:", error);
    throw error;
  }
};

/**
 * Fetches all gallery items from Firestore sorted by creation date (newest first)
 */
export const fetchGalleryItemsFromFirestore = async () => {
  try {
    const galleryCol = collection(db, 'gallery');
    const q = query(galleryCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Firestore Fetch Error:", error);
    throw error;
  }
};

/**
 * Deletes a gallery item from Firestore (and its file from Storage if applicable)
 * @param {string} docId - The Firestore document ID
 * @param {string} storagePath - The Storage file reference path (optional)
 */
export const deleteGalleryItem = async (docId, storagePath) => {
  try {
    // 1. Delete document from Firestore
    const docRef = doc(db, 'gallery', docId);
    await deleteDoc(docRef);

    // 2. Delete file from Storage if it was a file upload
    if (storagePath) {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Firebase Deletion Error:", error);
    throw error;
  }
};

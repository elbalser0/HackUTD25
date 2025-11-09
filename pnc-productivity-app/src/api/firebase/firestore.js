// Firestore operations with fallback to mock
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

// Check if we're using mock Firebase
const useMockAuth = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true' || 
                   !process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
                   process.env.EXPO_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key_here';

// PRD Operations
export const createPRD = async (prdData) => {
  if (useMockAuth) {
    const mockId = 'prd_' + Date.now();    return mockId;
  }
  
  try {
    const docRef = await addDoc(collection(db, 'prds'), {
      ...prdData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getPRDs = async (userId) => {
  if (useMockAuth) {    return [];
  }
  
  try {
    const q = query(
      collection(db, 'prds'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Backlog Operations
export const createBacklogItem = async (backlogData) => {
  if (useMockAuth) {
    const mockId = 'backlog_' + Date.now();    return mockId;
  }
  
  try {
    const docRef = await addDoc(collection(db, 'backlog'), {
      ...backlogData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getBacklog = async (workspaceId) => {
  if (useMockAuth) {    return [];
  }
  
  try {
    const q = query(
      collection(db, 'backlog'), 
      where('workspaceId', '==', workspaceId),
      orderBy('priority', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const updateBacklogItem = async (id, updateData) => {
  if (useMockAuth) {    return Promise.resolve();
  }
  
  try {
    const docRef = doc(db, 'backlog', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};

// Workspace Operations
export const createWorkspace = async (workspaceData) => {
  if (useMockAuth) {
    const mockId = 'workspace_' + Date.now();    return mockId;
  }
  
  try {
    const docRef = await addDoc(collection(db, 'workspaces'), {
      ...workspaceData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getWorkspaces = async (userId) => {
  if (useMockAuth) {    return [
      {
        id: 'demo-workspace',
        name: 'PNC Demo Project',
        description: 'Sample workspace for testing',
        members: [userId],
        createdAt: new Date()
      }
    ];
  }
  
  try {
    const q = query(
      collection(db, 'workspaces'), 
      where('members', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Feedback Operations
export const createFeedback = async (feedbackData) => {
  if (useMockAuth) {
    const mockId = 'feedback_' + Date.now();    return mockId;
  }
  
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getFeedback = async (workspaceId) => {
  if (useMockAuth) {    return [];
  }
  
  try {
    const q = query(
      collection(db, 'feedback'), 
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Document Operations
export const createDocument = async (userId, documentData) => {
  if (useMockAuth) {
    const mockId = 'doc_' + Date.now();    return { id: mockId, ...documentData, userId, createdAt: new Date() };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      ...documentData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...documentData, userId, createdAt: new Date() };
  } catch (error) {
    throw error;
  }
};

export const getDocuments = async (userId) => {
  if (useMockAuth) {    return [];
  }
  
  try {
    const q = query(
      collection(db, 'documents'), 
      where('userId', '==', userId)
      // orderBy removed temporarily - add index in Firebase Console to enable sorting
      // orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = Date.now();
      if (data.createdAt) {
        // Handle Firestore Timestamp
        if (data.createdAt.toMillis) {
          createdAt = data.createdAt.toMillis();
        } else if (data.createdAt.getTime) {
          createdAt = data.createdAt.getTime();
        } else if (typeof data.createdAt === 'number') {
          createdAt = data.createdAt;
        }
      }
      return { 
        id: doc.id, 
        ...data,
        createdAt
      };
    });
    
    // Sort in JavaScript instead of Firestore query
    return docs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  if (useMockAuth) {    return Promise.resolve();
  }
  
  try {
    const docRef = doc(db, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};
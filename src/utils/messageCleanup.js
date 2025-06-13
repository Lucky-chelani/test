import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  Timestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';

/**
 * Deletes expired messages based on either:
 * 1. An explicit expiresAt timestamp field, or
 * 2. Messages older than 8 hours based on timestamp field
 * 
 * This function should be called periodically, or could be
 * implemented as a Firebase Cloud Function
 */
export const cleanupExpiredMessages = async () => {
  try {
    // Calculate current timestamp
    const now = new Date();
    const currentTimestamp = Timestamp.fromDate(now);
    
    // Calculate timestamp for 8 hours ago (fallback for messages without expiresAt)
    const eightHoursAgo = new Date();
    eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
    const cutoffTimestamp = Timestamp.fromDate(eightHoursAgo);
    
    // Query all chatroom messages collections
    const chatroomsRef = collection(db, 'chatrooms');
    const chatroomsSnapshot = await getDocs(chatroomsRef);
    
    const results = {
      totalRooms: chatroomsSnapshot.size,
      processedRooms: 0,
      expiredMessagesDeleted: 0,
      oldMessagesDeleted: 0,
      errors: []
    };
    
    // For each chatroom
    for (const chatroomDoc of chatroomsSnapshot.docs) {
      try {
        const chatroomId = chatroomDoc.id;
        const chatroomData = chatroomDoc.data();
        
        // Get the messages subcollection
        const messagesRef = collection(db, 'chatrooms', chatroomId, 'messages');
        
        // Find messages with expiresAt in the past
        const expiredMessagesQuery = query(
          messagesRef, 
          where('expiresAt', '<', currentTimestamp)
        );
        
        const expiredMessagesSnapshot = await getDocs(expiredMessagesQuery);
        const expiredPromises = expiredMessagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        
        // Find messages without expiresAt but older than 8 hours
        const oldMessagesQuery = query(
          messagesRef, 
          where('timestamp', '<', cutoffTimestamp)
        );
        
        const oldMessagesSnapshot = await getDocs(oldMessagesQuery);
        const oldPromises = oldMessagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        
        // Wait for all deletions to complete
        await Promise.all([...expiredPromises, ...oldPromises]);
        
        results.expiredMessagesDeleted += expiredMessagesSnapshot.size;
        results.oldMessagesDeleted += oldMessagesSnapshot.size;
        
        // If any messages were deleted, update the message count in the room document
        if (expiredMessagesSnapshot.size > 0 || oldMessagesSnapshot.size > 0) {
          // Get current message count
          const currentMessagesQuery = query(messagesRef);
          const currentSnapshot = await getDocs(currentMessagesQuery);
          
          await updateDoc(doc(db, 'chatrooms', chatroomId), {
            messageCount: currentSnapshot.size
          });
        }
        
        results.processedRooms++;
      } catch (err) {
        console.error(`Error processing room ${chatroomDoc.id}:`, err);
        results.errors.push({
          roomId: chatroomDoc.id,
          error: err.message
        });
      }
    }
    
    console.log(`Message cleanup completed:`, results);
    return results;
  } catch (error) {
    console.error('Error in cleanup process:', error);
    throw error;
  }
};

/**
 * Helper function to check if message auto-deletion is due
 * This can be used in components that display messages
 */
export const checkMessageCleanupDue = async () => {
  // Get timestamp of last cleanup from localStorage
  const lastCleanup = localStorage.getItem('lastMessageCleanup');
  const now = new Date().getTime();
  
  // If never cleaned up or last cleanup was over 1 hour ago
  if (!lastCleanup || (now - parseInt(lastCleanup)) > 60 * 60 * 1000) {
    try {
      const results = await cleanupExpiredMessages();
      localStorage.setItem('lastMessageCleanup', now.toString());
      return results;
    } catch (error) {
      console.error('Scheduled message cleanup failed:', error);
      return { error: error.message };
    }
  }
  
  return { status: 'Cleanup not due yet' };
};

/**
 * Perform message cleanup for a specific room
 */
export const cleanupRoomMessages = async (roomId) => {
  try {
    if (!roomId) throw new Error('Room ID is required');
    
    // Current timestamp
    const now = new Date();
    const currentTimestamp = Timestamp.fromDate(now);
    
    // 8 hours ago timestamp
    const eightHoursAgo = new Date();
    eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
    const cutoffTimestamp = Timestamp.fromDate(eightHoursAgo);
    
    // Get the messages collection for this room
    const messagesRef = collection(db, 'chatrooms', roomId, 'messages');
    
    // Query for expired messages (by expiresAt field)
    const expiredMessagesQuery = query(
      messagesRef, 
      where('expiresAt', '<', currentTimestamp)
    );
    
    // Query for old messages (by timestamp field)
    const oldMessagesQuery = query(
      messagesRef, 
      where('timestamp', '<', cutoffTimestamp)
    );
    
    // Execute both queries
    const [expiredSnapshot, oldSnapshot] = await Promise.all([
      getDocs(expiredMessagesQuery),
      getDocs(oldMessagesQuery)
    ]);
    
    // Delete all expired/old messages
    const deletePromises = [
      ...expiredSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...oldSnapshot.docs.map(doc => deleteDoc(doc.ref))
    ];
    
    await Promise.all(deletePromises);
    
    // Update room's message count if any messages were deleted
    const deletedCount = expiredSnapshot.size + oldSnapshot.size;
    
    if (deletedCount > 0) {
      // Get updated message count
      const currentMessagesQuery = query(messagesRef);
      const currentSnapshot = await getDocs(currentMessagesQuery);
      
      // Update room document
      await updateDoc(doc(db, 'chatrooms', roomId), {
        messageCount: currentSnapshot.size
      });
    }
    
    return {
      roomId,
      expiredMessagesDeleted: expiredSnapshot.size,
      oldMessagesDeleted: oldSnapshot.size,
      totalDeleted: deletedCount
    };
  } catch (error) {
    console.error(`Error cleaning up messages for room ${roomId}:`, error);
    throw error;
  }
};

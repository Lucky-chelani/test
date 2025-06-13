import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const initializeChatrooms = async () => {  const chatrooms = [
    {
      id: 'himalayan',
      name: 'Himalayan Explorers',
      description: 'Talk all things Himalayas!',
      members: [],
      createdAt: new Date(),
      featured: true, // This one is featured
    },
    {
      id: 'patagonia',
      name: 'Patagonia Trekkers',
      description: 'Share Patagonia tips and plans.',
      members: [],
      createdAt: new Date(),
      featured: false,
    },
    {
      id: 'sahyadri',
      name: 'Sahyadri Hikers',
      description: 'Connect with local hikers.',
      members: [],
      createdAt: new Date(),
      featured: false,
    },
    {
      id: 'alpine',
      name: 'Alpine Adventurers',
      description: 'For lovers of the Alps.',
      members: [],
      createdAt: new Date(),
      featured: true, // This one is featured
    },
  ];

  try {
    for (const room of chatrooms) {
      const roomRef = doc(db, 'chatrooms', room.id);
      const roomDoc = await getDoc(roomRef);
        if (!roomDoc.exists()) {
        await setDoc(roomRef, {
          ...room,
          createdAt: new Date().toISOString(), // Convert Date to string for Firestore
          members: [], // Ensure members array exists
          featured: room.featured || false // Ensure featured flag exists
        });
        console.log(`Created chatroom: ${room.name}`);
      } else {
        console.log(`Chatroom already exists: ${room.name}`);
      }
    }
    console.log('Chatrooms initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing chatrooms:', error);
    return false;
  }
}; 
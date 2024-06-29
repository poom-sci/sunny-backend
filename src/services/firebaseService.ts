// import { getDatabase, ref, set, update } from "firebase/database";
import firebase from "src/loaders/firebase"; // สมมติว่าคุณมี Firebase initialization ในไฟล์นี้
// import admin from 'src/loaders/firebase-admin';

const db = firebase.database();

export const createOrUpdateChat = async (chatId: string, chatData: any) => {
  const chatRef = db.ref(`Chat/${chatId}`);
  await chatRef.set({
    uid: chatData.uid,
    date: chatData.date,
    created_at: chatData.createdAt,
    updated_at: chatData.updatedAt || new Date().toISOString() // Ensure updated_at is set
  });
};

export const createMessage = async (
  chatId: string,
  messageId: string,
  messageData: any
) => {
  const messageRef = db.ref(`Chat/${chatId}/messages/${messageId}`);
  await messageRef.set({
    text: messageData.text,
    created_at: messageData.createdAt || new Date().toISOString(),
    updated_at: messageData.updatedAt || new Date().toISOString(), // Ensure updated_at is set
    created_by: messageData.createdBy,
    status: messageData.status
  });

  await messageRef.update({
    updated_at: new Date().toISOString(), // Ensure updated_at is set
    created_at: new Date().toISOString() // Ensure updated_at is set
  });
};

export const updateMessageStatus = async (
  chatId: string,
  messageId: string,
  status: string,
  text?: string
) => {
  const messageRef = db.ref(`Chat/${chatId}/messages/${messageId}`);
  if (text) {
    await messageRef.update({
      status: status,
      text: text,
      updated_at: new Date().toISOString() // Ensure updated_at is set
    });
  } else {
    await messageRef.update({
      status: status,
      updated_at: new Date().toISOString() // Ensure updated_at is set
    });
  }
};

export const getChatData = async (chatId: string) => {
  const chatRef = db.ref(`Chat/${chatId}`);
  const snapshot = await chatRef.once("value");
  return snapshot.val();
};

export const getMessageData = async (chatId: string, messageId: string) => {
  const messageRef = db.ref(`Chat/${chatId}/messages/${messageId}`);
  const snapshot = await messageRef.once("value");
  return snapshot.val();
};

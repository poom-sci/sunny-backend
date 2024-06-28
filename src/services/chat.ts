import chatDomain from "src/database/domain/chat";
import summary from "src/database/domain/summary";
import message from "src/database/domain/message";
import { publishToQueue } from "src/services/rabbit";
import {
  createOrUpdateChat,
  createMessage,
  updateMessageStatus
} from "src/services/firebaseService";
import axios from "axios";

export const getTodayChat = async (uid: string, date: string) => {
  let today = new Date().toISOString().split("T")[0]; // รูปแบบ 'YYYY-MM-DD'
  if (date) {
    today = date;
  }

  const oldChat = await chatDomain.getChatsByFilter({
    uid,
    date: today
  });

  if (oldChat.length > 0) {
    return oldChat[0];
  } else {
    const chatData = await chatDomain.upsertChat({
      uid: uid,
      date: today,
      createdBy: "system",
      isActive: true
    });
    // console.log("asdas", chatData);

    await createOrUpdateChat(chatData.id, chatData);

    return chatData;
  }
};

export const createSendMessageByUser = async (
  uid: string,
  chatId: string,
  text: string,
  date?: string
) => {
  let today = new Date().toISOString().split("T")[0]; // รูปแบบ 'YYYY-MM-DD'
  if (date) {
    today = date;
  }

  // create message in pending status
  const createdMessage = await message.createMessage({
    uid,
    chatId,
    date: today,
    text,
    status: "pending",
    createdBy: "user"
  });

  // create message in Firebase
  await createMessage(chatId, createdMessage.id, createdMessage);

  // publish message to message processing
  await publishToQueue("message-processing", {
    messageId: createdMessage.id,
    uid: uid,
    chatId: chatId,
    text: text
  });

  return createdMessage;
};

export const processMessageByUser = async (
  messageId: string,
  uid: string,
  chatId: string,
  text: string
) => {
  let today = new Date().toISOString().split("T")[0]; // รูปแบบ 'YYYY-MM-DD'
  // if (date) {
  //   today = date;
  // }

  // update message status to processing
  const updatedMessage = await message.updateMessageStatus(
    messageId,
    "processing"
  );

  // create answer
  const createdMessageAnswer = await message.createMessage({
    uid,
    chatId,
    date: today,
    text: "",
    status: "processing",
    createdBy: "system"
  });

  // create answer message in Firebase
  await createMessage(chatId, createdMessageAnswer.id, createdMessageAnswer);

  let answer = "";
  try {
    // update message status in Firebase
    await updateMessageStatus(chatId, messageId, "processing");

    // call chatbot api to get response
    const response = await axios.request({
      baseURL: "http://0.0.0.0:8081",
      method: "POST",
      url: "/multi-chain",

      data: {
        name: "poom",
        messages: [{ role: "user", content: text }]
      }
    });

    console.log("response", response.data.response);
    answer = response.data.response.content;

    // update message status
    const updatedSystemMessage = await message.updateMessage(
      createdMessageAnswer.id,
      {
        text: answer,
        status: "success"
      }
    );

    // update message status in Firebase
    await updateMessageStatus(chatId, createdMessageAnswer.id, "success");

    // publish message to message success if success
  } catch (error) {
    console.log("erre", error);
    await publishToQueue("message-failed", {
      messageId: updatedMessage.id,
      uid: uid,
      chatId: chatId
    });

    // update message status
    const updatedSystemMessage = await message.updateMessage(
      createdMessageAnswer.id,
      {
        text: "error",
        status: "failed"
      }
    );

    // update message status in Firebase
    await updateMessageStatus(chatId, createdMessageAnswer.id, "failed");
    return "";
  } finally {
    await publishToQueue("message-success", {
      messageId: updatedMessage.id,
      uid: uid,
      chatId: chatId,
      text: answer
    });
  }

  // publish message to failed status if failed

  return updatedMessage;
};

export const updateSuccessMessage = async (
  messageId: string,
  uid: string,
  chatId: string,
  answer: string
) => {
  let date = new Date().toISOString().split("T")[0]; // รูปแบบ 'YYYY-MM-DD'

  // update message status to success
  const updatedMessage = await message.updateMessage(messageId, {
    status: "success"
  });

  // update message status in Firebase
  await updateMessageStatus(chatId, messageId, "success");

  return updatedMessage;
};

export const updateFailedMessage = async (
  messageId: string,
  uid: string,
  chatId: string
) => {
  // update message status to failed
  const updatedMessage = await message.updateMessageStatus(messageId, "failed");

  // update message status in Firebase
  await updateMessageStatus(chatId, messageId, "failed");

  return updatedMessage;
};

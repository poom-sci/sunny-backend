import chatDomain from "src/database/domain/chat";
import summary from "src/database/domain/summary";
import message from "src/database/domain/message";
import personal from "src/database/domain/personal";
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

  // console.log("oldChat", uid);

  const oldChat = await chatDomain.getChatsByFilter({
    uid,
    date: today
  });

  // console.log("---", oldChat);

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
  await publishToQueue("message-processing1", {
    messageId: createdMessage.id,
    uid: uid,
    chatId: chatId,
    text: text
  });

  return createdMessage;
};

export const createSummaryChat = async (uid: string, date?: string) => {
  try {
    let today = new Date().toISOString().split("T")[0]; // รูปแบบ 'YYYY-MM-DD'
    if (date) {
      today = date;
    }

    const user = await personal.getPersonalByFirebaseUid(uid);
    if (!user) {
      throw new Error("user not found");
    }

    const oldChat = await chatDomain.getChatsByFilter({
      uid,
      date: today
    });

    console.log("asdfasdf", oldChat);

    if (oldChat.length > 0) {
      const chatTodayMessage = await message.getMessagesByChatId(oldChat[0].id);

      const chatTodayMap = chatTodayMessage.map((message) => {
        if (message.status == "success") {
          if (message.createdBy == "system") {
            return "โดย sunny: " + message.text;
          } else {
            return "โดย " + user.userName + ": " + message.text;
          }
        }
        return "";
      });

      const summaryText = chatTodayMap.join("\n");
      console.log("----1");
      const response = await axios.request({
        baseURL: "https://typhoon-service-3undgy4acq-as.a.run.app",
        method: "POST",
        url: "/summarize_dialy_chat",

        data: {
          user_name: user.userName,
          chat_today: summaryText
        }
      });
      console.log("----2", response);

      const responseColorOfTheDay = await axios.request({
        baseURL: "https://typhoon-service-3undgy4acq-as.a.run.app",
        method: "POST",
        url: "/color_of_the_day",

        data: {
          user_name: user.userName,
          chat_today_summary: response.data.chat_summary
        }
      });
      console.log("----3");

      // console.log("response", response);

      console.log("test", response.data.chat_summary);

      // console.log()

      console.log(
        "adfasdf",
        responseColorOfTheDay.data.major_mood,
        responseColorOfTheDay.data.minor_mood
      );

      const summaryData = await summary.createSummary({
        uid,
        chatId: oldChat[0].id,
        date: today,
        color: responseColorOfTheDay.data.major_mood,
        color1: responseColorOfTheDay.data.minor_mood,
        summary: response.data.chat_summary,
        isActive: true
      });
      return summaryData;
    } else {
      throw new Error("chat not found");
    }
  } catch (error) {
    console.log("erre", error);
  }
};

export const getAllChatsSummary = async (uid: string) => {
  const allChat = await chatDomain.getChatsByFilter({
    uid
  });

  const allChatMap = allChat.map((chat) => {
    return chat.id;
  });

  const allChatSummary = await summary.getAllSummariesByListOfChatId(
    allChatMap
  );

  return allChatSummary;
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
    // console.log("asdasdas", uid);
    const user = await personal.getPersonalByFirebaseUid(uid);
    if (!user) {
      throw new Error("user not found");
    }

    console.log("asdfasdf", user);

    // update message status in Firebase
    await updateMessageStatus(chatId, messageId, "processing");

    // call chatbot api to get response
    const response = await axios.request({
      baseURL: "https://typhoon-service-3undgy4acq-as.a.run.app",
      method: "POST",
      url: "/chat",

      data: {
        chatId: chatId,
        input_text: text,
        user_name: user.userName,
        personality:
          "ชอบสี" +
          user.color +
          "อายุ" +
          user.age +
          " เพศ" +
          user.gender +
          " สนใจให้ sunny เป็น" +
          user.sunnyCategory,

        selected_mood: "string"
      }
    });

    console.log("response", response.data.response);
    answer = response.data.response;

    console.log("answer", answer);

    // update message status
    const updatedSystemMessage = await message.updateMessage(
      createdMessageAnswer.id,
      {
        text: answer,

        status: "success"
      }
    );
    console.log("updatedSystemMessage", updatedSystemMessage);
    // update message status in Firebase
    await updateMessageStatus(
      chatId,
      createdMessageAnswer.id,
      "success",
      answer
    );

    // publish message to message success if success
  } catch (error) {
    console.log("erre", error);
    await publishToQueue("message-failed1", {
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
    await publishToQueue("message-success1", {
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

import * as rabbitService from "src/services/rabbit";

import { processMessageByUser } from "src/services/chat";

export default async () => {
  rabbitService.subscribeQueue(
    "message-processing1",
    async (data: {
      messageId: string;
      uid: string;
      chatId: string;
      text: string;
    }) => {
      await processMessageByUser(
        data.messageId,
        data.uid,
        data.chatId,
        data.text
      );
      return;
    }
  );
};

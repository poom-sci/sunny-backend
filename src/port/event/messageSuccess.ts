import * as rabbitService from "src/services/rabbit";

import { updateSuccessMessage } from "src/services/chat";

export default async () => {
  rabbitService.subscribeQueue(
    "message-success1",
    async (data: {
      messageId: string;
      uid: string;
      chatId: string;
      text: string;
    }) => {
      await updateSuccessMessage(
        data.messageId,
        data.uid,
        data.chatId,
        data.text
      );
      return;
    }
  );
};

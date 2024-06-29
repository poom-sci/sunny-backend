import * as rabbitService from "src/services/rabbit";

import { updateFailedMessage } from "src/services/chat";

export default async () => {
  rabbitService.subscribeQueue(
    "message-failed1",
    async (data: {
      messageId: string;
      uid: string;
      chatId: string;
      text: string;
    }) => {
      await updateFailedMessage(data.messageId, data.uid, data.chatId);
      return;
    }
  );
};

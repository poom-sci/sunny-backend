// import { auth } from "src/loaders/firebase";
import notification from "src/database/domain/notification";

const upsertNotificationToken = async (uid: string, token: string) => {
  const oldNoti = await notification.getNotificationsByTokenId(token);

  if (oldNoti.length > 0 && oldNoti[0].uid == uid) {
    return;
  }

  const noti = await notification.createNotification({
    uid,
    notificationTokenId: token
  });

  return "success";
};

export { upsertNotificationToken };

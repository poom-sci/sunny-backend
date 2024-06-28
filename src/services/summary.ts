import chatDomain from "src/database/domain/chat";
import summary from "src/database/domain/summary";
import axios from "axios"; // สมมติว่าใช้ axios สำหรับการเรียก API

interface ChatSummaryResponse {
  summary: string;
  color: string;
}

export const createSummary = async (uid: string, date: string) => {
  try {
    // ดึงข้อมูล chat ตาม uid
    const chat = await chatDomain.getChatByUid(uid);

    if (!chat) {
      throw new Error("Chat not found");
    }

    // สมมติว่ามี API endpoint สำหรับการสรุปแชท
    // const apiUrl = "https://api.example.com/summarize-chat";

    // เรียก API เพื่อสรุปแชท
    // const response = await axios.post<ChatSummaryResponse>(apiUrl, {
    //   chatId: chat.id,
    //   date: date
    // });

    // const { summary: chatSummary, color } = response.data;
    const chatSummary = "test summary";
    const color = "red";

    // สร้างหรืออัปเดต summary
    const createdSummary = await summary.upsertSummary({
      uid: uid,
      date: date,
      color: color,
      summary: chatSummary
    });

    if (!createdSummary) {
      throw new Error("Failed to create or update summary");
    }

    return {
      success: true,
      message: "Summary created successfully",
      summary: createdSummary
    };
  } catch (error) {
    console.error("Error creating summary:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      summary: null
    };
  }
};

import dayjs from "dayjs";
import type { Label, Note, User } from "@/types";

export const mockUser: User = {
  id: "demo-user",
  fullName: "Nguyen Minh Anh",
  email: "demo@noteflow.vn",
  avatarUrl: "",
  preferences: {
    theme: "light",
<<<<<<< HEAD
    defaultView: "grid",
    language: "vi",
    fontSize: "16",
    noteColor: "#FFFFFF",
=======
    defaultView: "list",
    language: "vi",
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  },
};

export const mockLabels: Label[] = [
  { id: "work", name: "Công việc", color: "#3673f5", noteCount: 6 },
  { id: "study", name: "Học tập", color: "#6d4ef6", noteCount: 4 },
  { id: "idea", name: "Ý tưởng", color: "#2eb872", noteCount: 3 },
  { id: "personal", name: "Cá nhân", color: "#ff7a2f", noteCount: 2 },
];

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Kế hoạch dự án",
    content:
      "1. Mục tiêu\nXây dựng ứng dụng quản lý ghi chú đơn giản, dễ sử dụng.\n\n2. Công việc chính\n- Phân tích yêu cầu\n- Thiết kế giao diện\n- Tích hợp backend Node.js và MySQL\n\n3. Tiến độ\n[x] Phân tích\n[x] Wireframe\n[ ] Kiểm thử",
    noteDate: dayjs().format("YYYY-MM-DD"),
    isPinned: true,
    isDeleted: false,
    isPasswordProtected: false,
    images: [],
    labels: [mockLabels[0]],
    updatedBy: "Nguyen Minh Anh",
    updatedAt: dayjs().toISOString(),
  },
  {
    id: "2",
    title: "Ôn tập React",
    content: "useState, useEffect, props, state, suspense, form actions.",
    noteDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    isPinned: false,
    isDeleted: false,
    isPasswordProtected: false,
    images: [],
    labels: [mockLabels[1]],
    updatedBy: "Nguyen Minh Anh",
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "3",
    title: "Ý tưởng sản phẩm",
    content: "Ứng dụng note có widget lịch, chia sẻ theo link và chế độ offline.",
    noteDate: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
    isPinned: false,
    isDeleted: false,
    isPasswordProtected: true,
    images: [],
    labels: [mockLabels[2]],
    updatedBy: "Nguyen Minh Anh",
    updatedAt: dayjs().subtract(2, "day").toISOString(),
  },
];

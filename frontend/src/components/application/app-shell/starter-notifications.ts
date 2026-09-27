import { RiDownloadCloud2Line, RiGitPullRequestLine, RiShieldCheckLine } from "@remixicon/react";

import type { NotificationCenterItem } from "@/components/application/notification-center/notification-center";

/** Isi awal kotak masuk. Tiga belum dibaca, sesuai badge sidebar dan bel. */
export const STARTER_NOTIFICATIONS: NotificationCenterItem[] = [
  {
    id: "mention-notes",
    category: "mentions",
    group: "Hari ini",
    title: "Livia menyebut Anda",
    description: "Bisakah Anda meninjau status kosong yang baru sebelum dasbor dirilis?",
    timestamp: "2 mnt",
    unread: true,
    avatar: { initials: "LS", alt: "Livia Saris", color: "pink" },
    actions: [
      { id: "reply", label: "Balas", variant: "primary" },
      { id: "view", label: "Lihat utas", variant: "secondary" },
    ],
  },
  {
    id: "backup-ready",
    category: "system",
    group: "Hari ini",
    title: "Cadangan workspace siap",
    description: "Cadangan malam tadi selesai dan siap diunduh.",
    timestamp: "18 mnt",
    unread: true,
    status: "success",
    icon: RiDownloadCloud2Line,
    actions: [{ id: "download", label: "Unduh", variant: "secondary" }],
  },
  {
    id: "review-request",
    category: "activity",
    group: "Hari ini",
    title: "Permintaan tinjauan untuk perubahan composer",
    description: "Mert membuka pull request yang menyentuh composer chat dan indikator thinking.",
    timestamp: "1 jam",
    unread: true,
    icon: RiGitPullRequestLine,
    actions: [{ id: "review", label: "Tinjau", variant: "primary" }],
  },
  {
    id: "key-rotated",
    category: "system",
    group: "Kemarin",
    title: "API key diputar",
    description: "Kunci provider model diganti. Deployment ikut pada build berikutnya.",
    timestamp: "1 h",
    status: "information",
    icon: RiShieldCheckLine,
  },
  {
    id: "mention-launch",
    category: "mentions",
    group: "Kemarin",
    title: "Aspen menyebut Anda",
    description: "Daftar periksa rilis sudah beres dari sisi saya. Ada yang tersisa dari sisi Anda?",
    timestamp: "1 h",
    avatar: { initials: "AL", alt: "Aspen Lubin", color: "blue" },
  },
];

export const STARTER_UNREAD_COUNT = STARTER_NOTIFICATIONS.filter((item) => item.unread).length;

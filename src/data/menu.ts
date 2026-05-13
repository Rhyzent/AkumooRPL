import katsuBento from "@/assets/katsu-bento.jpeg";
import beefBento from "@/assets/beef-bento.jpeg";
import karaageBento from "@/assets/karaage-bento.jpeg";
import katsuBox from "@/assets/katsu-box.jpeg";
import karaageBox from "@/assets/karaage-box.jpeg";
import katsudonBox from "@/assets/katsudon-box.jpeg";
import geprekMatah from "@/assets/geprek-matah.jpeg";
import geprekKorek from "@/assets/geprek-korek.jpeg";
import dimsumGoreng from "@/assets/dimsum-goreng.jpeg";
import sarapanGeprek from "@/assets/sarapan-geprek.jpeg";
import sarapanKatsu from "@/assets/sarapan-katsu.jpeg";
import sarapanNasgor from "@/assets/sarapan-nasgor.jpeg";
import sarapanNasgorSpesial from "@/assets/sarapan-nasgor-spesial.jpeg";
import sarapanKaraage from "@/assets/sarapan-karaage.jpeg";
import sarapanSalad from "@/assets/sarapan-salad.jpeg";

export type MenuCategory = "Bento" | "Geprek" | "Sarapan" | "Cemilan";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  badge?: string;
}

export const menuItems: MenuItem[] = [
  // BENTO
  {
    id: "katsu-bento",
    name: "Katsu Bento",
    description: "Bento ayam katsu crispy dengan saus khas Jepang, nasi pulen, dan pelengkap segar.",
    price: 24000,
    image: katsuBento,
    category: "Bento",
    badge: "Best Seller",
  },
  {
    id: "beef-bento",
    name: "Beef Bento",
    description: "Irisan daging sapi gurih bumbu teriyaki, disajikan dengan nasi hangat ala bento Jepang.",
    price: 25000,
    image: beefBento,
    category: "Bento",
  },
  {
    id: "karaage-bento",
    name: "Karaage Bento",
    description: "Ayam karaage juicy ala Jepang dengan balutan tepung renyah, lengkap dalam satu kotak bento.",
    price: 24000,
    image: karaageBento,
    category: "Bento",
  },
  {
    id: "katsu-box",
    name: "Katsu Box",
    description: "Versi hemat dari Katsu Bento — ayam katsu + nasi dalam kemasan praktis.",
    price: 18000,
    image: katsuBox,
    category: "Bento",
  },
  {
    id: "karaage-box",
    name: "Karaage Box",
    description: "Karaage juicy + nasi hangat dalam ukuran box, pas untuk makan siang cepat.",
    price: 18000,
    image: karaageBox,
    category: "Bento",
  },
  {
    id: "katsudon-box",
    name: "Katsudon Box",
    description: "Katsu disiram saus telur khas katsudon di atas nasi hangat. Comfort food ala Jepang.",
    price: 21000,
    image: katsudonBox,
    category: "Bento",
  },

  // GEPREK
  {
    id: "geprek-sambal-matah",
    name: "Ayam Geprek Sambal Matah",
    description: "Ayam geprek crispy dengan sambal matah segar khas Bali. Wangi & bikin nagih.",
    price: 17000,
    image: geprekMatah,
    category: "Geprek",
    badge: "Favorit",
  },
  {
    id: "geprek-sambal-korek",
    name: "Ayam Geprek Sambal Korek",
    description: "Ayam geprek dengan sambal korek pedas mantap, cocok untuk pecinta pedas.",
    price: 17000,
    image: geprekKorek,
    category: "Geprek",
  },

  // SARAPAN
  {
    id: "sarapan-ayam-geprek",
    name: "Ayam Geprek (Sarapan)",
    description: "Menu sarapan hemat di stand kami. Bisa pesan via delivery (+1K dari harga menu).",
    price: 10000,
    image: sarapanGeprek,
    category: "Sarapan",
    badge: "Hemat",
  },
  {
    id: "sarapan-chicken-katsu",
    name: "Chicken Katsu (Sarapan)",
    description: "Chicken katsu hangat untuk sarapan. Bisa pesan via delivery (+1K dari harga menu).",
    price: 10000,
    image: sarapanKatsu,
    category: "Sarapan",
  },
  {
    id: "sarapan-nasgor-sapi",
    name: "Nasi Goreng Sapi",
    description: "Nasi goreng sapi gurih untuk awali hari. Bisa pesan via delivery (+1K dari harga menu).",
    price: 11000,
    image: sarapanNasgor,
    category: "Sarapan",
  },
  {
    id: "sarapan-nasgor-sapi-spesial",
    name: "Nasi Goreng Sapi Spesial",
    description: "Versi spesial dengan topping tambahan. Bisa pesan via delivery (+1K dari harga menu).",
    price: 12000,
    image: sarapanNasgorSpesial,
    category: "Sarapan",
  },
  {
    id: "sarapan-chicken-karaage",
    name: "Chicken Karaage (Sarapan)",
    description: "Karaage juicy untuk sarapan. Bisa pesan via delivery (+1K dari harga menu).",
    price: 12000,
    image: sarapanKaraage,
    category: "Sarapan",
  },
  {
    id: "sarapan-nasi-daun-jeruk",
    name: "Nasi Daun Jeruk Ayam",
    description: "Nasi wangi daun jeruk dengan ayam gurih. Bisa pesan via delivery (+1K dari harga menu).",
    price: 12000,
    image: sarapanGeprek,
    category: "Sarapan",
  },
  {
    id: "sarapan-salad-buah",
    name: "Salad Buah",
    description: "Salad buah segar & menyehatkan. Bisa pesan via delivery (+1K dari harga menu).",
    price: 10000,
    image: sarapanSalad,
    category: "Sarapan",
  },

  // CEMILAN
  {
    id: "dimsum-goreng-klemer",
    name: "Dimsum Goreng Klemer",
    description: "Cemilan dimsum goreng klemer renyah di luar, lembut di dalam. Pas untuk teman santai.",
    price: 21000,
    image: dimsumGoreng,
    category: "Cemilan",
  },
];

export const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

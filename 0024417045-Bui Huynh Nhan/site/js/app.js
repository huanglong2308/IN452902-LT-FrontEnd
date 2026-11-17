// ========================================================
// Bùi Huỳnh Nhãn - MSSV: 0024417045
// Môn: Lập trình Front End (IN4529) - Câu 2: API & JavaScript
// ========================================================

const API_URL = "http://localhost:4000";

// Đổi giờ UTC sang giờ Việt Nam (vd: 08:00 12/09/2026)
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Danh sách 24 ảnh tương ứng 24 sự kiện theo ID trong CSDL
const EVENT_IMAGES = [
  "img/1-workshop-git-github.jpg",
  "img/2-dthu-code-war.jpg",
  "img/3-hoi-thao-ai.jpg",
  "img/4-hackathon-24h.jpg",
  "img/5-chu-nhat-xanh.jpg",
  "img/6-hien-mau-nhan-dao.jpg",
  "img/7-tiep-suc-mua-thi.jpg",
  "img/8-xuan-yeu-thuong.jpg",
  "img/9-english-speaking-club.jpg",
  "img/10-halloween-english-night.jpg",
  "img/11-luyen-thi-ielts.jpg",
  "img/12-debate-contest.jpg",
  "img/13-dem-nhac-chao-tan-sv.jpg",
  "img/14-bieu-dien-van-nghe.jpg",
  "img/15-giang-sinh-acoustic.jpg",
  "img/16-tuyen-thanh-vien-ban-nhac.jpg",
  "img/17-giao-huu-bong-da.jpg",
  "img/18-khai-mac-dthu-cup.jpg",
  "img/19-tap-huan-trong-tai.jpg",
  "img/20-chung-ket-dthu-cup.jpg",
  "img/21-quan-ly-thoi-gian.jpg",
  "img/22-viet-cv-phong-van.jpg",
  "img/23-thuyet-trinh-tu-tin.jpg",
  "img/24-lam-viec-nhom.jpg",
];

const FALLBACK_IMAGE = "img/event.svg";

// Chọn ảnh theo đuôi ID sự kiện
const pickImage = (id) => {
  const num = parseInt(id.slice(-4), 10);
  if (!Number.isNaN(num) && num >= 1 && num <= EVENT_IMAGES.length) {
    return EVENT_IMAGES[num - 1];
  }
  return FALLBACK_IMAGE;
};

const form = document.querySelector("#search-form");
const keywordInput = document.querySelector("#keyword");
const statusEl = document.querySelector("#status");
const listEl = document.querySelector("#event-list");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

// Câu 2a: Hàm formatSeats(event) trả về "Còn 12/40 chỗ", hoặc "Hết chỗ" khi đã đủ
const formatSeats = (event) => {
  const left = event.capacity - event.registeredCount;
  return left > 0 ? `Còn ${left}/${event.capacity} chỗ` : "Hết chỗ";
};

// Câu 2b: Hàm renderEvents(events) tạo card bằng createElement, setAttribute/textContent, rồi replaceChildren
const renderEvents = (events) => {
  const cards = events.map((event) => {
    const card = document.createElement("article");
    card.className = "card";

    // Hình ảnh minh hoạ
    const img = document.createElement("img");
    img.setAttribute("src", pickImage(event.id));
    img.setAttribute("alt", `Hình minh hoạ ${event.name}`);
    img.addEventListener(
      "error",
      () => img.setAttribute("src", FALLBACK_IMAGE),
      { once: true },
    );

    // Tiêu đề sự kiện
    const title = document.createElement("h2");
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      `event-detail.html?id=${encodeURIComponent(event.id)}`,
    );
    link.textContent = event.name;
    title.append(link);

    // Thời gian tổ chức
    const timeP = document.createElement("p");
    const time = document.createElement("time");
    time.setAttribute("datetime", event.startTime);
    time.textContent = formatDateTime(event.startTime);
    timeP.append(time);

    // Địa điểm
    const locationP = document.createElement("p");
    locationP.textContent = event.location;

    // Số chỗ ngồi / Nhãn hết chỗ
    const seatsP = document.createElement("p");
    const seatsText = formatSeats(event);
    if (seatsText === "Hết chỗ") {
      const badge = document.createElement("span");
      badge.className = "badge-full";
      badge.textContent = seatsText;
      seatsP.append(badge);
    } else {
      seatsP.textContent = seatsText;
    }

    card.append(img, title, timeP, locationP, seatsP);
    return card;
  });

  listEl.replaceChildren(...cards);
};

// Câu 2c: Hàm async loadEvents(keyword)
const loadEvents = async (keyword = "") => {
  const params = new URLSearchParams({ pageSize: "50" });
  if (keyword !== "") params.set("q", keyword);

  statusEl.textContent = "Đang tải…";

  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    renderEvents(data.items);

    statusEl.textContent =
      data.items.length === 0
        ? "Không có sự kiện nào khớp từ khoá."
        : `Tìm thấy ${data.totalCount} sự kiện`;
  } catch (error) {
    listEl.replaceChildren();
    statusEl.textContent = "Không tải được dữ liệu, vui lòng thử lại.";
  }
};

// Xử lý gửi form tìm kiếm
form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadEvents(keywordInput.value.trim());
});

// Xử lý menu toggle trên thiết bị di động
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Nạp dữ liệu ban đầu
loadEvents();

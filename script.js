// ==========================================
// 1. DATA STATE & VARIABEL GLOBAL
// ==========================================
let cartCount = 0;
let cartTotal = 0;
let wishlistItems = new Set(); // Set biar nama nggak dobel

// DOM Elements
const categoryItems = document.querySelectorAll("#category-list li");
const productCards = document.querySelectorAll(".card");
const searchInput = document.getElementById("search-input");
const noResultsMsg = document.getElementById("no-results");
const shelfTitle = document.getElementById("shelf-title");

const cartBadge = document.getElementById("cart-badge");
const cartItemsText = document.getElementById("cart-items");
const cartTotalText = document.getElementById("cart-total");

// ==========================================
// 2. SISTEM KERANJANG BELANJA (CART)
// ==========================================
const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Mencegah klik nembus ke kartu (Quickview)

    const price = parseInt(btn.getAttribute("data-price"));
    const name = btn.getAttribute("data-name");

    cartCount++;
    cartTotal += price;
    updateCartUI();

    // Efek visual klik tombol
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.backgroundColor = "#10b981"; // Hijau sukses
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      btn.style.backgroundColor = "";
    }, 1000);
  });
});

function updateCartUI() {
  cartBadge.innerText = cartCount;
  cartItemsText.innerText = `${cartCount} Items in Cart`;
  cartTotalText.innerText = `Total: Rp ${cartTotal.toLocaleString("id-ID")}`;
}

// ==========================================
// 3. SISTEM WISHLIST (HEART BUTTON)
// ==========================================
const wishlistBtns = document.querySelectorAll(".wishlist-btn");
const wishlistUI = document.getElementById("wishlist-items");
const wishlistCountUI = document.getElementById("wishlist-count");

wishlistBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const card = btn.closest(".card");
    const itemName = card.getAttribute("data-name");
    const icon = btn.querySelector("i");

    if (icon.classList.contains("fa-regular")) {
      // Tambah ke wishlist
      icon.classList.replace("fa-regular", "fa-solid");
      wishlistItems.add(itemName);
    } else {
      // Hapus dari wishlist
      icon.classList.replace("fa-solid", "fa-regular");
      wishlistItems.delete(itemName);
    }
    renderWishlist();
  });
});

function renderWishlist() {
  wishlistUI.innerHTML = "";
  wishlistCountUI.innerText = `(${wishlistItems.size})`;

  if (wishlistItems.size === 0) {
    wishlistUI.innerHTML =
      '<li style="color:#9ca3af; border:none;">Wishlist kosong</li>';
    return;
  }

  wishlistItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fa-solid fa-heart"></i> ${item}`;
    wishlistUI.appendChild(li);
  });
}
renderWishlist(); // Panggil saat pertama buka web

// ==========================================
// 4. FILTER KATEGORI & LIVE SEARCH
// ==========================================
function filterProducts() {
  const activeCategory = document
    .querySelector(".active-category")
    .getAttribute("data-filter");
  const searchQuery = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    const cardName = card.getAttribute("data-name").toLowerCase();

    // Cek apakah kartu cocok dengan kategori DAN cocok dengan tulisan pencarian
    const matchCategory =
      activeCategory === "all" || cardCategory === activeCategory;
    const matchSearch = cardName.includes(searchQuery);

    if (matchCategory && matchSearch) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Tampilkan pesan jika kosong
  if (visibleCount === 0) {
    noResultsMsg.style.display = "block";
  } else {
    noResultsMsg.style.display = "none";
  }
}

// Event Klik Kategori
categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    categoryItems.forEach((i) => i.classList.remove("active-category"));
    item.classList.add("active-category");

    const filterName = item.innerText;
    shelfTitle.innerText =
      filterName === "All Collection" ? "Trending This Week" : filterName;

    filterProducts();
  });
});

// Event Ngetik di Search Bar
searchInput.addEventListener("input", filterProducts);

// ==========================================
// 5. MODAL QUICKVIEW (KLIK KARTU)
// ==========================================
const quickviewModal = document.getElementById("quickview-modal");
const closeQvBtn = document.getElementById("close-quickview");
let currentQvPrice = 0;
let currentQvName = "";

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Ambil data dari kartu yang diklik
    const imgUrl = card.querySelector("img").src;
    const title = card.querySelector("h3").innerText;
    const priceStr = card.querySelector("p").innerText;
    const priceVal = card.querySelector(".add-btn").getAttribute("data-price");
    const category = card.getAttribute("data-category");

    // Masukkan ke modal
    document.getElementById("qv-img").src = imgUrl;
    document.getElementById("qv-title").innerText = title;
    document.getElementById("qv-price").innerText = priceStr;
    document.getElementById("qv-category-tag").innerText = category;

    currentQvPrice = parseInt(priceVal);
    currentQvName = title;

    quickviewModal.classList.add("active");
  });
});

closeQvBtn.addEventListener("click", () =>
  quickviewModal.classList.remove("active"),
);

// Tombol Tambah ke Keranjang di dalam Quickview
document.getElementById("qv-add-to-cart").addEventListener("click", () => {
  cartCount++;
  cartTotal += currentQvPrice;
  updateCartUI();
  quickviewModal.classList.remove("active");
});

// ==========================================
// 6. MODAL CHECKOUT
// ==========================================
const checkoutModal = document.getElementById("checkout-modal");
const openCheckoutBtn = document.getElementById("open-checkout");
const closeCheckoutBtn = document.getElementById("close-btn");
const checkoutForm = document.getElementById("checkout-form");
const orderSummary = document.getElementById("order-summary");

openCheckoutBtn.addEventListener("click", () => {
  if (cartCount === 0) {
    alert("Keranjang belanja Anda masih kosong!");
    return;
  }
  orderSummary.innerHTML = `<strong>Total Items:</strong> ${cartCount} <br> <strong>Subtotal:</strong> Rp ${cartTotal.toLocaleString("id-ID")}`;
  checkoutModal.classList.add("active");
});

closeCheckoutBtn.addEventListener("click", () =>
  checkoutModal.classList.remove("active"),
);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Pembayaran berhasil diproses! Terima kasih telah berbelanja di TOK.`);

  // Reset keranjang setelah sukses
  cartCount = 0;
  cartTotal = 0;
  updateCartUI();
  checkoutModal.classList.remove("active");
  checkoutForm.reset();
});

// Tutup modal kalau klik area luar
window.addEventListener("click", (e) => {
  if (e.target === quickviewModal) quickviewModal.classList.remove("active");
  if (e.target === checkoutModal) checkoutModal.classList.remove("active");
});

// ==========================================
// 7. RESPONSIVE SIDEBAR MOBILE
// ==========================================
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

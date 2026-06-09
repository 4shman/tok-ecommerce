document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const addButtons = document.querySelectorAll(".add-btn");
  const wishlistBtns = document.querySelectorAll(".wishlist-btn");
  const wishlistList = document.querySelector(".wishlist-list");
  const productCards = document.querySelectorAll(".card");
  const categoryItems = document.querySelectorAll("#category-list li");

  // Keranjang
  let totalItems = 0;
  let totalPrice = 0;

  // Filter Kategori
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((li) => li.classList.remove("active-category"));
      item.classList.add("active-category");
      const filterValue = item.getAttribute("data-filter");
      productCards.forEach((card) => {
        if (
          filterValue === "all" ||
          filterValue === card.getAttribute("data-category")
        ) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Wishlist
  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".card");
      const title = card.querySelector("h3").textContent;
      btn.classList.toggle("active");

      if (btn.classList.contains("active")) {
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        const li = document.createElement("li");
        li.textContent = title;
        li.setAttribute("data-title", title);
        wishlistList.appendChild(li);
      } else {
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        wishlistList.querySelectorAll("li").forEach((item) => {
          if (item.getAttribute("data-title") === title) item.remove();
        });
      }
    });
  });

  // Add to Cart
  addButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      totalItems++;
      totalPrice += parseInt(btn.getAttribute("data-price"));
      document.getElementById("cart-items").textContent = `${totalItems} Items`;
      document.getElementById("cart-total").textContent =
        `Total: Rp ${totalPrice}`;
    });
  });

  // Quick View (Klik Card)
  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".add-btn") || e.target.closest(".wishlist-btn"))
        return;
      document.getElementById("qv-img").src = card.querySelector("img").src;
      document.getElementById("qv-title").textContent =
        card.querySelector("h3").textContent;
      document.getElementById("quickview-modal").classList.add("active");
    });
  });

  document
    .getElementById("close-quickview")
    .addEventListener("click", () =>
      document.getElementById("quickview-modal").classList.remove("active"),
    );
  document
    .querySelector(".checkout-btn")
    .addEventListener("click", () =>
      document.getElementById("checkout-modal").classList.add("active"),
    );
  document
    .getElementById("close-btn")
    .addEventListener("click", () =>
      document.getElementById("checkout-modal").classList.remove("active"),
    );
});

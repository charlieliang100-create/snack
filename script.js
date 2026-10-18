const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const menuIcon = toggle?.querySelector(".material-symbols-rounded");
const cartList = document.querySelector("[data-cart-list]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartTotal = document.querySelector("[data-cart-total]");
const cart = new Map();

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

const renderCart = () => {
  if (!cartList || !cartEmpty || !cartTotal) return;

  cartList.replaceChildren();
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.priceCents * item.quantity;
    total += itemTotal;

    const row = document.createElement("li");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("span");
    name.className = "cart-item-name";
    name.textContent = item.name;
    const meta = document.createElement("span");
    meta.className = "cart-item-meta";
    meta.textContent = `${item.quantity} × ${formatPrice(item.priceCents)} = ${formatPrice(itemTotal)}`;
    details.append(name, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${item.name} from cart`);
    removeButton.dataset.removeFromCart = item.name;
    const removeIcon = document.createElement("span");
    removeIcon.className = "material-symbols-rounded";
    removeIcon.setAttribute("aria-hidden", "true");
    removeIcon.textContent = "delete";
    removeButton.append(removeIcon);

    row.append(details, removeButton);
    cartList.append(row);
  });

  cartEmpty.hidden = cart.size > 0;
  cartTotal.textContent = formatPrice(total);
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  if (menuIcon) menuIcon.textContent = isOpen ? "close" : "menu";
});

nav?.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  if (menuIcon) menuIcon.textContent = "menu";
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    const name = addButton.dataset.name;
    const priceCents = Math.round(Number(addButton.dataset.price) * 100);
    const item = cart.get(name);

    if (item) {
      item.quantity += 1;
    } else {
      cart.set(name, { name, priceCents, quantity: 1 });
    }

    renderCart();
    return;
  }

  const removeButton = event.target.closest("[data-remove-from-cart]");
  if (removeButton) {
    cart.delete(removeButton.dataset.removeFromCart);
    renderCart();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
renderCart();

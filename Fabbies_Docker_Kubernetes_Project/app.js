(() => {
  if (sessionStorage.getItem("fabbiesDemoLoggedIn") !== "yes") {
    window.location.replace("index.html");
    return;
  }

  const user = sessionStorage.getItem("fabbiesDemoUser") || "Customer";
  document.getElementById("welcomeText").textContent = `Hi, ${user}`;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("fabbiesDemoLoggedIn");
    sessionStorage.removeItem("fabbiesDemoUser");
    window.location.href = "index.html";
  });

  const menu = [
    {id:"v1",name:"Chapathi",category:"Vegetarian",price:15,emoji:"🫓",desc:"Soft, fresh chapathi"},
    {id:"v2",name:"Porotta",category:"Vegetarian",price:18,emoji:"🥞",desc:"Flaky Kerala porotta"},
    {id:"v3",name:"Meals",category:"Vegetarian",price:100,emoji:"🍛",desc:"Traditional Kerala meals"},
    {id:"v4",name:"Paneer Curry",category:"Vegetarian",price:120,emoji:"🧀",desc:"Creamy paneer curry"},
    {id:"v5",name:"Dosa",category:"Vegetarian",price:50,emoji:"🥘",desc:"Crispy dosa"},
    {id:"v6",name:"Veg Biryani",category:"Vegetarian",price:130,emoji:"🍚",desc:"Aromatic vegetable biryani"},
    {id:"v7",name:"Payasam",category:"Vegetarian",price:60,emoji:"🍮",desc:"Traditional sweet dessert"},
    {id:"n1",name:"Chicken Fry",category:"Non-Vegetarian",price:180,emoji:"🍗",desc:"Spiced chicken fry"},
    {id:"n2",name:"Chicken Biryani",category:"Non-Vegetarian",price:160,emoji:"🍛",desc:"Flavourful chicken biryani"},
    {id:"n3",name:"Beef Capsa",category:"Non-Vegetarian",price:190,emoji:"🥘",desc:"Kerala-style beef dish"},
    {id:"d1",name:"Tea",category:"Drinks",price:15,emoji:"☕",desc:"Hot tea"},
    {id:"d2",name:"Coffee",category:"Drinks",price:25,emoji:"☕",desc:"Fresh coffee"},
    {id:"d3",name:"Coca-Cola",category:"Drinks",price:40,emoji:"🥤",desc:"Chilled soft drink"},
    {id:"d4",name:"Pepsi",category:"Drinks",price:40,emoji:"🥤",desc:"Chilled soft drink"},
    {id:"d5",name:"7UP",category:"Drinks",price:40,emoji:"🥤",desc:"Lemon-lime soft drink"},
    {id:"i1",name:"Vanilla Ice Cream",category:"Ice Cream",price:50,emoji:"🍨",desc:"Classic vanilla"},
    {id:"i2",name:"Chocolate Ice Cream",category:"Ice Cream",price:60,emoji:"🍫",desc:"Chocolate flavour"},
    {id:"i3",name:"Strawberry Ice Cream",category:"Ice Cream",price:60,emoji:"🍓",desc:"Strawberry flavour"},
    {id:"i4",name:"Butterscotch Ice Cream",category:"Ice Cream",price:65,emoji:"🍦",desc:"Butterscotch flavour"}
  ];

  let activeCategory = "All";
  const cart = new Map();
  const categories = ["All", "Vegetarian", "Non-Vegetarian", "Drinks", "Ice Cream"];
  const tabs = document.getElementById("categoryTabs");
  const grid = document.getElementById("menuGrid");

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "category-tab" + (category === activeCategory ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      [...tabs.children].forEach(tab => tab.classList.toggle("active", tab.textContent === category));
      renderMenu();
    });
    tabs.appendChild(button);
  });

  function renderMenu() {
    grid.replaceChildren();
    menu.filter(item => activeCategory === "All" || item.category === activeCategory).forEach(item => {
      const card = document.createElement("article");
      card.className = "food-card";
      const emoji = document.createElement("div"); emoji.className = "food-emoji"; emoji.textContent = item.emoji;
      const title = document.createElement("h3"); title.textContent = item.name;
      const desc = document.createElement("p"); desc.textContent = item.desc;
      const bottom = document.createElement("div"); bottom.className = "food-bottom";
      const price = document.createElement("strong"); price.textContent = money(item.price);
      const add = document.createElement("button"); add.className = "add-btn"; add.textContent = "+ Add";
      add.setAttribute("aria-label", `Add ${item.name} to cart`);
      add.addEventListener("click", () => {
        const current = cart.get(item.id);
        cart.set(item.id, { ...item, qty: current ? current.qty + 1 : 1 });
        renderCart();
      });
      bottom.append(price, add);
      card.append(emoji, title, desc, bottom);
      grid.appendChild(card);
    });
  }

  function money(value) {
    return new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR"}).format(value);
  }

  function renderCart() {
    const target = document.getElementById("cartItems");
    target.replaceChildren();
    if (cart.size === 0) {
      const empty = document.createElement("p"); empty.className = "empty-state"; empty.textContent = "Your cart is empty. Choose something delicious!";
      target.appendChild(empty);
    }
    let total = 0, count = 0;
    cart.forEach(item => {
      total += item.price * item.qty; count += item.qty;
      const row = document.createElement("div"); row.className = "cart-row";
      const info = document.createElement("div"); info.className = "cart-info";
      const name = document.createElement("strong"); name.textContent = item.name;
      const subtotal = document.createElement("span"); subtotal.textContent = money(item.price * item.qty);
      info.append(name, subtotal);
      const controls = document.createElement("div"); controls.className = "cart-controls";
      const minus = document.createElement("button"); minus.className = "qty-btn"; minus.textContent = "−"; minus.setAttribute("aria-label", `Reduce ${item.name}`);
      minus.addEventListener("click", () => { if (item.qty <= 1) cart.delete(item.id); else item.qty--; renderCart(); });
      const qty = document.createElement("span"); qty.textContent = item.qty;
      const plus = document.createElement("button"); plus.className = "qty-btn"; plus.textContent = "+"; plus.setAttribute("aria-label", `Increase ${item.name}`);
      plus.addEventListener("click", () => { item.qty++; renderCart(); });
      const remove = document.createElement("button"); remove.className = "remove-btn"; remove.textContent = "Remove";
      remove.addEventListener("click", () => { cart.delete(item.id); renderCart(); });
      controls.append(minus, qty, plus, remove);
      row.append(info, controls); target.appendChild(row);
    });
    document.getElementById("cartCount").textContent = `${count} item${count === 1 ? "" : "s"}`;
    document.getElementById("cartTotal").textContent = money(total);
  }

  document.getElementById("orderForm").addEventListener("submit", event => {
    event.preventDefault();
    const result = document.getElementById("orderResult");
    if (cart.size === 0) {
      result.hidden = false; result.textContent = "Please add at least one food item before placing an order."; result.className = "order-result error-box";
      return;
    }
    const order = {
      customer: document.getElementById("customerName").value.trim(),
      contact: document.getElementById("contact").value.trim(),
      date: document.getElementById("deliveryDate").value,
      time: document.getElementById("deliveryTime").value,
      location: document.getElementById("location").value.trim(),
      customization: document.getElementById("customization").value.trim(),
      notes: document.getElementById("notes").value.trim(),
      items: [...cart.values()].map(item => ({name:item.name,qty:item.qty,price:item.price})),
      total: [...cart.values()].reduce((sum,item) => sum + item.price * item.qty,0)
    };
    const orderId = "FAB-" + Date.now().toString().slice(-6);
    // Store only in this browser session for demonstration; no server/database is used.
    sessionStorage.setItem("fabbiesLastOrder", JSON.stringify({orderId,...order}));
    result.hidden = false; result.className = "order-result success-box";
    result.replaceChildren();
    const heading = document.createElement("h3"); heading.textContent = `Order summary · ${orderId}`;
    const details = document.createElement("p");
    details.textContent = `${order.customer} · ${order.contact} · Delivery: ${order.date} at ${order.time} · ${order.location}`;
    const list = document.createElement("ul");
    order.items.forEach(item => { const li = document.createElement("li"); li.textContent = `${item.name} × ${item.qty} — ${money(item.price * item.qty)}`; list.appendChild(li); });
    const total = document.createElement("strong"); total.textContent = `Total: ${money(order.total)}`;
    const extra = document.createElement("p"); extra.textContent = `Customization: ${order.customization || "None"}. Notes: ${order.notes || "None"}.`;
    const warning = document.createElement("p"); warning.className = "small-note"; warning.textContent = "Demo confirmation only: this order is stored in session storage, not in a server database.";
    result.append(heading, details, list, total, extra, warning);
    cart.clear(); renderCart();
  });

  const dateInput = document.getElementById("deliveryDate");
  const today = new Date(); dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  renderMenu(); renderCart();
})();

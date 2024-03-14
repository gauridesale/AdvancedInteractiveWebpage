let shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let generateShop = () => {
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, ogprice, desc, img } = x;
      let search = basket.find((x) => x.id === id) || [];
      return `      
   <div id=product-id-${id}  class="card">
  <img src="${img}" class="card-img-top" alt="" style="width:220px;height:280px">
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <p class="card-text">${desc}</p>
    <div class="price-quantity" style="font-size:10px">
      <h6 class="fw-bold">Rs. ${price}</h6>
      <h6 class="text-muted">Rs. <strike>${ogprice}</strike></h6>
      <p class="text-success pt-2">(${((ogprice - price) / 100).toFixed(2)}% OFF)</p>
      <div id=${id} class="quantity" style="display: none;"></div>
    </div>
    <button onclick="add_to_cart(${id})" class="btn btn-success px-5">Add to Cart</button>
  </div>
</div>

    `;
    })
    .join(""));
};

generateShop();
//add to cart
let add_to_cart = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }


  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
//
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }


  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon = basket.map((x) => x.item).reduce((x, y) => x + y, 0);

};

calculation();

document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  let searchInput = document.getElementById("searchInput").value.toLowerCase();
  let filteredItems = shopItemsData.filter(item => {
    return item.name.toLowerCase().includes(searchInput) || item.desc.toLowerCase().includes(searchInput);
  });
  renderFilteredItems(filteredItems);

  // Scroll to the collection section
  document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
});

function renderFilteredItems(items) {
  let shopDiv = document.getElementById("shop");
  if (items.length > 0) {
    shopDiv.innerHTML = items.map(item => {
      let search = basket.find(x => x.id === item.id);
      let discountPercentage = ((item.ogprice - item.price) / item.ogprice) * 100;
      let roundedDiscount = Math.round(discountPercentage);
      return `
              <div id="product-id-${item.id}" class="item">
                  <img width="220" height="282.562" src="${item.img}" alt="">
                  <div class="details">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <div class="price-quantity" style="width:188px; margin-top:-5px">
                    <h6 class="fw-bold">Rs. ${item.price} </h6>               
                    <h6 class="">Rs.<strike class="">${item.ogprice} </strike>  </h6> 
                    <p class="text-success" style="font-size:13px ;padding-top:8px";> (${roundedDiscount}% OFF)</p>               
                        
              <div id=${item.id} class="quantity" style="display:none">     
              </div>
              
              </div>
              <div onclick="add_to_cart(${item.id})"class="btn text-light" style="background-color: rgb(96, 216, 96);"> Add to Cart</div>
          </div>
        </div>
              `;
    }).join("");
  } else {
    shopDiv.innerHTML = "<p>No matching items found.</p>";
  }
}


//Filter for category btn

let filterItems = (category) => {
  // Clear previous content in the shop
  shop.innerHTML = "";

  // Filter items based on the provided category
  let filteredItems = shopItemsData.filter(item => {
    return category === "All" || item.category === category;
  });

  // Generate and display the filtered items
  shop.innerHTML = filteredItems
    .map((x) => {
      let { id, name, price, desc, img } = x;
      let search = basket.find((x) => x.id === id) || [];
      return `
        <div id=product-id-${id} class="item">
            <img width="220" height="282.562" src=${img} alt="">
            <div class="details">
              <h5>${name}</h5>
              <p>${desc}</p>
              <div class="price-quantity">
                <h6 class="fw-bold">Rs. ${price} </h6>
                <div class="buttons">
                  <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                  <div id=${id} class="quantity">
                  ${search.item === undefined ? 0 : search.item}
                  </div>
                  <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>
                </div>
                <div class="btn text-light" style="background-color: rgb(96, 216, 96);"> Add to Cart</div>
            </div>
          </div>
        `;
    })
    .join("");
};

// Event listeners for filter buttons
document.querySelectorAll(".filter-button-group button").forEach(button => {
  button.addEventListener("click", () => {
    // Remove 'active' class from all buttons
    document.querySelectorAll(".filter-button-group button").forEach(btn => {
      btn.classList.remove("active-filter-btn");
    });
    // Add 'active' class to the clicked button
    button.classList.add("active-filter-btn");
    // Filter items based on the category and display them
    filterItems(button.textContent.trim());
  });
});

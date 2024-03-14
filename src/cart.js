let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon = basket.map((x) => x.item).reduce((x, y) => x + y, 0);

};

calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
        <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-4 col-sm-6">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${search.img}" style="width:180px;height:150px" class="img-fluid rounded-start" alt="${search.name}">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <div class="title-price-x">
                      <h5 class="card-title">${search.name}<i onclick="removeItem(${id})" class="bi bi-x-lg ms-5"></i></h5>
                    </div>
                    <div class="buttons mt-3 d-flex align-items-center">
                      <i onclick="decrement(${id})" class="bi bi-dash-lg mx-1"></i>
                      <div id="${id}" class="quantity mx-1">${item}</div>
                      <i onclick="increment(${id})" class="bi bi-plus-lg mx-1"></i>
                    </div>
                    <h6 class="mt-4 ms-1">₹ ${item * search.price}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      

      
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <div div class="conatiner-fluid" style = "margin:80px 0 200px " >
    <div class="conatiner add-to-cart text-center" >
        <i class="bi bi-cart cart-icon" style="font-size: 80px;"></i>
    </div>
    <div class="container text-center">
        <p class="fw-bold">Hey, it feels so light</p>
        <p  >There's nothing in your bag. Let's add items</p>
        <a href="index.html" class="btn text-light" style="background-color: rgb(96, 216, 96);margin-top:10px">Home</a>
    </div>
    </div>
    
</ >
  `;
  }
};

generateCartItems();

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

  generateCartItems();
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
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    // console.log(amount);
    label.innerHTML = `
  <h4  class="total" > Total Amount: ₹ ${amount}</h4 >
    <button class="checkout text-light px-5 py-2" >PLACE ORDER</button>
`;
  } else return;
};

TotalAmount();
//<button onclick="clearCart()" class="removeAll mx-5">Clear Cart</button>

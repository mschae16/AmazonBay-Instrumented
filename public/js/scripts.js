const shoppingCartArray = [];

const fetchAll = (path, appendMethod) => {
  fetch(`/api/v1/${path}`)
    .then( response => {
      if (response.status !== 200) {
        console.log(response);
      }
      return response;
    })
    .then( response => response.json() )
    .then( parsedResponse => {
      return parsedResponse.map( object => appendMethod(object) )
    })
    .catch( error => console.log(error) );
}

const appendItem = (itemObject) => {
  const { id, item_name, item_description, item_image, item_price } = itemObject;

  $('.items-list')
    .append(
      `<li
        class='item-card'
        data-id='${id}' data-item='${item_name}' data-price='${item_price}'
      >
        <div class='item-name-container'>
          <h3 class='item-name'>${item_name}</h3>
        </div>
        <div class='item-info-container'>
          <p class='item-description'>${item_description}</p>
        </div>
        <div class='item-img-container'>
          <img class='item-img' src=${item_image} alt='${item_name} image' />
        </div>
        <div class='item-price-container'>
          <p class='item-price'>Price: $${item_price}</p>
        </div>
        <button class='add-item-btn'>Add To Cart</button>
      </li>`
    );
}

const loadInventory = () => {
  fetchAll('inventory', appendItem);
}

const addItemToCart = (e) => {
  const item = $(e.target).closest('.item-card');
  const itemObject = $(item).data();
  shoppingCartArray.push(itemObject);
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCartArray));
}

const purchaseItems = () => {
  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
  console.log(shoppingCart);
}

const slideLeft = () => {
  $('.shopping-cart-container').toggleClass('open-cart');
}

const slideRight = () => {
  $('.order-history-container').toggleClass('open-orders');
}

$('.nav-cart').on('click', slideLeft);
$('.nav-orders').on('click', slideRight);
$('.purchase-btn').on('click', purchaseItems);
$('.items-list').on('click', '.add-item-btn', addItemToCart);
$(window).on('load', loadInventory);

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
      `<li class='item-card' data-id='item-${id}'>
        <h3 class='item-name'>${item_name}</h3>
        <img class='item-img' src=${item_image} alt='${item_name} image' />
        <p class='item_description'>${item_description}</p>
        <p class='item-price'>Price: $${item_price}</p>
        <button class='add-item-btn'>Add To Cart</button>
      </li>`
    );
}

const loadInventory = () => {
  fetchAll('inventory', appendItem);
};

$(window).on('load', loadInventory);

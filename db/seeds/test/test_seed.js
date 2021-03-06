exports.seed = (knex, Promise) => {
  return knex('inventory').del()
    .then(() => {
      return knex('inventory').insert([
        {
          id: 1,
          item_name: 'Disrupt surfboard', item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://www.disruptsports.com/wp-content/uploads/2016/05/DisruptSports_Surfboard__0000s_0001s_0002s_0006_xBaked-Bean-Floral-Front0001.jpg',
          item_price: 179.75
         },
        {
          id: 2,
          item_name: 'Sky 6 Foamie Surfboard, Blue', item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTsBoii8PejNtWliOPtcwv_elPKuYdDambfkSI6fcNNchUypDhWbI_8jGCHYQ&usqp=CAE',
          item_price: 70.69
        },
        {
          id: 3,
          item_name: 'Landshark Surfboard', item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://www.disruptsports.com/wp-content/uploads/2016/05/DisruptSports_Surfboard__0000s_0001s_0002s_0006_xBaked-Bean-Floral-Front0001.jpg',
          item_price: 150.75
        },
        {
          id: 4,
          item_name: 'Jimmy Styks Puffer Inflatable SUP Paddleboard',
          item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://images-na.ssl-images-amazon.com/images/I/71W-HrYpxiL._SY679_.jpg',
          item_price: 599.99
        },
        {
          id: 5,
          item_name: 'surfboard1', item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://www.disruptsports.com/wp-content/uploads/2016/05/DisruptSports_Surfboard__0000s_0001s_0002s_0006_xBaked-Bean-Floral-Front0001.jpg',
          item_price: 268.25
        },
        {
          id: 6,
          item_name: 'Scott Burke Soft Surfboard, White/Red',
          item_description: 'Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun.',
          item_image: 'https://images-na.ssl-images-amazon.com/images/I/41c4f68WsyL.jpg',
          item_price: 219.15
        }
      ]);
    });
};

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'AmazonBay';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// ENDPOINTs

app.get('/api/v1/inventory', (request, response) => {
  database('inventory').select()
    .then(inventory => {
      if (!inventory.length) {
        return response.status(404).json({ error: 'No inventory could be found.' });
      } else {
        return inventory;
      }
    })
    .then(inventory => response.status(200).json(inventory))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/order_history', (request, response) => {
  database('order_history').select()
    .then(orders => {
      if (!orders.length) {
        return response.status(404).json({ error: 'No orders could be found.' });
      } else {
        return orders;
      }
    })
    .then(orders => response.status(200).json(orders))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/order_history', (request, response) => {
  const order = request.body;
  if (!order.order_total) {
      return response
        .status(422)
        .send({ error: 'Expected format: { order_total: <Decimal> } You\'re missing a the order_total property.' });
  }

  database('order_history').insert({ order_total: order.order_total }, '*')
    .then(order => response.status(201).json(order))
    .catch(error => response.status(500).json({ error }));
});

module.exports = app;

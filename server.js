const appmetrics = require('appmetrics');
const monitoring = appmetrics.monitor();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

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

monitoring.on('cpu', (cpu) => {
  const postData = `cpu_percentage,host=AmazonBay process=${cpu.process},system=${cpu.system} ${cpu.time}`;

  const options = {
    port: 8186,
    path: '/write?precision=ms',
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
});

// monitoring.on('http', (request) => {
//   console.log({ request });
// });

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

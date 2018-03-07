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

// INSTRUMENTATION

const options = {
  port: 8186,
  path: '/write?precision=ms',
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
};

// monitoring.on('initialized', function (env) {
//   env = monitoring.getEnvironment();
//   for (var entry in env) {
//       console.log(entry + ':' + env[entry]);
//   };
// });

monitoring.on('cpu', (cpu) => {
  const postData = `cpu_percentage,host=AmazonBay process=${cpu.process},system=${cpu.system} ${cpu.time}`;

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

monitoring.on('eventloop', (eventLoop) => {
  const postData = `event_loop_latency,host=AmazonBay min=${eventLoop.latency.min},max=${eventLoop.latency.max},avg=${eventLoop.latency.avg} ${eventLoop.time}`;

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

monitoring.on('gc', (gc) => {
  const postData = `gc,host=AmazonBay,type=${gc.type} size=${gc.size},used=${gc.used},duration=${gc.duration} ${gc.time}`;

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

monitoring.on('memory', (memory) => {
  const postData = `memory,host=AmazonBay physical_total=${memory.physical_total},physical_used=${memory.physical_used},physical_free=${memory.physical_free},virtual=${memory.virtual},private=${memory.private},physical=${memory.physical} ${memory.time}`;

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

monitoring.on('http', (request) => {
  const postData = `HTTP_requests,host=AmazonBay,method=${request.method},url=${request.url} duration=${request.duration}  ${request.time}`;

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

monitoring.on('postgres', (postgres) => {
  const postData = `Postgres_queries,host=AmazonBay duration=${postgres.duration} ${postgres.time}`;

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

// ENDPOINTS

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

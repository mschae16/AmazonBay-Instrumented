# AmazonBay-Instrumented

This project is a simple e-commerce application built in 8 hours with frontend user interface (HTML, CSS, jQuery) and the backend built out with Node/Express, PostgreSQL, and Knex. Users have the ability to view order history, add items to the shopping cart, and checkout or "purchase" the order.  The order will then appear in the Order History menu.

## To Use

Clone down this repo

`npm install`

You will need to manually create the databases: amazonbay and amazonbay_test

Run `psql`

`# CREATE DATABASE amazonbay;`

`# CREATE DATABASE amazonbay_test;`

To quit: `\q`

Run `knex migrate:latest` to get the latest migration.

Run `knex seed:run` to seed the databases with sample data.

Run `node server.js` to start the server and navigate to localhost:3000 to view the app.

Run `npm test` to run the test suite.

## Images
![Landing Page](landing-page.png)

#### Author

This application was created by Margo Schaedel

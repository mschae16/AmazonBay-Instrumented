exports.seed = (knex, Promise) => {
  return knex('order_history').del()
    .then(() => {
      return knex('order_history').insert([
        {id: 1, order_total: 135.75},
        {id: 2, order_total: 554.99},
        {id: 3, order_total: 249.75}
      ]);
    });
};

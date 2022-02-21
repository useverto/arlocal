import { knex, Knex } from 'knex';

export const connect = (): Knex => {
  return knex({
    client: 'pg',
    connection: process.env.DB_CONN_STRING
  });
};

import knex from 'knex';
import pg from 'pg';
import config from './knexfile.js';

pg.types.setTypeParser(1082, (v) => v);
export default knex(config);

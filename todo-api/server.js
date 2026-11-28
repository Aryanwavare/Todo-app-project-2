import 'dotenv/config';
import Fastify from 'fastify';
import db from './db.js';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

const app = Fastify({ logger: true });
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in .env');

await app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await app.register(jwt, { secret: process.env.JWT_SECRET });

const authenticate = async (req) => {
  await req.jwtVerify();
};

// ----- Validation rules (same rules as your tables) -----
const idParams = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'integer', minimum: 1 } },
};

const fields = {
  title: { type: 'string', minLength: 1, maxLength: 200 },
  description: { type: ['string', 'null'] },
  status: { type: 'string', enum: ['pending', 'completed'] },
  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
  due_date: { type: ['string', 'null'], format: 'date' },
};

const createSchema = {
  body: { type: 'object', required: ['title'], properties: { ...fields }, additionalProperties: false },
};

const listSchema = {
  querystring: {
    type: 'object',
    properties: { status: fields.status, priority: fields.priority },
  },
};

const updateSchema = {
  params: idParams,
  body: { type: 'object', minProperties: 1, properties: fields, additionalProperties: false },
};

 

// ----- Error handler -----
app.setErrorHandler((err, req, reply) => {
  if (err.code === '23503') return reply.code(400).send({ error: 'user_id does not exist' });
  if (err.validation) return reply.code(400).send({ error: err.message });
  if (err.statusCode && err.statusCode < 500) return reply.code(err.statusCode).send({ error: err.message });
  req.log.error(err);
  reply.code(500).send({ error: 'Internal Server Error' });
});

// ----- CREATE -----
app.post('/api/tasks', { schema: createSchema, onRequest: [authenticate] }, async (req, reply) => {
  const [task] = await db('tasks')
  .insert({
    ...req.body,
    status: req.body.status ?? 'pending',
    user_id: req.user.id
  })
  .returning('*');
  return reply.code(201).send(task);
});

app.get('/api/tasks', { schema: listSchema, onRequest: [authenticate] }, async (req) => {
  return db('tasks').where({ ...req.query, user_id: req.user.id }).orderBy('id');
});

app.put('/api/tasks/:id', { schema: updateSchema, onRequest: [authenticate] }, async (req, reply) => {
  const [task] = await db('tasks')
    .where({ id: req.params.id, user_id: req.user.id })
    .update({ ...req.body, updated_at: db.fn.now() })
    .returning('*');
  if (!task) return reply.code(404).send({ error: 'Task not found' });
  return task;
});

app.delete('/api/tasks/:id', { schema: { params: idParams }, onRequest: [authenticate] }, async (req, reply) => {
  const deleted = await db('tasks').where({ id: req.params.id, user_id: req.user.id }).del();
  if (!deleted) return reply.code(404).send({ error: 'Task not found' });
  return reply.code(204).send();
});

// ----- Start -----
try {
  await app.listen({ port: Number(process.env.PORT) || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
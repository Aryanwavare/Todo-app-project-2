import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';
import db from './db.js';

const app = Fastify({ logger: true });
await app.register(cors,{ origin: 'http://localhost:4200',methods: ['GET','POST','PUT','DELETE'] } );

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
  body: {
    type: 'object',
    required: ['user_id', 'title'],
    properties: { user_id: { type: 'integer', minimum: 1 }, ...fields },
    additionalProperties: false,
  },
};

const updateSchema = {
  params: idParams,
  body: { type: 'object', minProperties: 1, properties: fields, additionalProperties: false },
};

const listSchema = {
  querystring: {
    type: 'object',
    properties: {
      user_id: { type: 'integer', minimum: 1 },
      status: fields.status,
      priority: fields.priority,
    },
  },
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
app.post('/api/tasks', { schema: createSchema }, async (req, reply) => {
  const [task] = await db('tasks').insert(req.body).returning('*');
  return reply.code(201).send(task);
});

// ----- READ -----
app.get('/api/tasks', { schema: listSchema }, async (req) => {
  return db('tasks').where(req.query).orderBy('id');
});

// ----- UPDATE -----
app.put('/api/tasks/:id', { schema: updateSchema }, async (req, reply) => {
  const [task] = await db('tasks')
    .where({ id: req.params.id })
    .update({ ...req.body, updated_at: db.fn.now() })
    .returning('*');
  if (!task) return reply.code(404).send({ error: 'Task not found' });
  return task;
});

// ----- DELETE -----
app.delete('/api/tasks/:id', { schema: { params: idParams } }, async (req, reply) => {
  const deleted = await db('tasks').where({ id: req.params.id }).del();
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
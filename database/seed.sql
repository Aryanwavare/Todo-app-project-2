-- Replace the placeholder with the bcrypt hash from Dhanraj's code before committing
INSERT INTO users (name, email, password_hash) VALUES
  ('Test User', 'test@example.com', '$2b$10$80hpmPkZev8JcGpvsAUIDu1Q3OkbCqbrXNH1LYMW2a9y8R2PyW/o6');

INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
  (1, 'Set up development environment', 'Install PostgreSQL and Node.js', 'completed', 'high', '2026-12-01'),
  (1, 'Design login screen', 'Coordinate with Ankit', 'pending', 'medium', '2026-12-05'),
  (1, 'Write API tests', NULL, 'pending', 'low', NULL);
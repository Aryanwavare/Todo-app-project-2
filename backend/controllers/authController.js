
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pool = require("../config/db");

const localDataFile = path.join(__dirname, "..", "data", "users.json");

function readLocalUsers() {
  try {
    return JSON.parse(fs.readFileSync(localDataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalUsers(users) {
  fs.mkdirSync(path.dirname(localDataFile), { recursive: true });
  fs.writeFileSync(localDataFile, JSON.stringify(users, null, 2));
}

async function databaseAvailable() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "todo-app-development-secret-change-me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        message: "Name must be between 1 and 100 characters.",
      });
    }

    if (
      cleanEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;

    if (await databaseAvailable()) {
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [cleanEmail]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }

      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [cleanName, cleanEmail, passwordHash]
      );
      user = result.rows[0];
    } else {
      const users = readLocalUsers();
      if (users.some((item) => item.email === cleanEmail)) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }

      user = {
        id: crypto.randomUUID(),
        name: cleanName,
        email: cleanEmail,
        created_at: new Date().toISOString(),
        password_hash: passwordHash,
      };
      users.push(user);
      writeLocalUsers(users);
    }

    const token = createToken(user);
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    return res.status(201).json({
      message: "Registration successful.",
      user: publicUser,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user;

    if (await databaseAvailable()) {
      const result = await pool.query(
        `SELECT id, name, email, password_hash, created_at
         FROM users
         WHERE email = $1`,
        [cleanEmail]
      );
      user = result.rows[0];
    } else {
      user = readLocalUsers().find((item) => item.email === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
};

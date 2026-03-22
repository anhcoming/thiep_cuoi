import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  let db: Database.Database;
  try {
    db = new Database("wedding.db");
    // Initialize database
    db.exec(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        side TEXT,
        guests INTEGER,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // Fallback or handle error - for now we just log it
  }

  app.use(express.json());

  // Email transporter configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // API routes
  app.post("/api/rsvp", async (req, res) => {
    const { name, phone, side, guests, message } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    try {
      // Save to database
      const stmt = db.prepare(`
        INSERT INTO rsvps (name, phone, side, guests, message)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(name, phone, side, guests, message);

      // Send email notification (non-blocking for the response)
      const targetEmail = side === 'Nhà Trai' ? 'anhcoming@gmail.com' : 'ngatpt.test@gmail.com';
      
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: targetEmail,
          subject: `Xác nhận tham dự đám cưới - ${name} (${side})`,
          text: `
            Thông tin xác nhận tham dự mới:
            - Họ tên: ${name}
            - Số điện thoại: ${phone || 'Không có'}
            - Phía: ${side}
            - Số người tham dự: ${guests}
            - Lời chúc: ${message || 'Không có'}
          `
        };

        // We don't await here to ensure the RSVP is confirmed even if email fails
        transporter.sendMail(mailOptions).then(() => {
          console.log(`Email sent to ${targetEmail}`);
        }).catch((err) => {
          console.error("Failed to send email notification:", err.message);
          if (err.message.includes("Application-specific password required")) {
            console.error("HINT: You need to use a Gmail App Password in your EMAIL_PASS secret.");
          }
        });
      } else {
        console.warn("Email credentials not set. Skipping email notification.");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error saving RSVP to database:", error);
      res.status(500).json({ error: "Failed to process RSVP" });
    }
  });

  app.get("/api/rsvps", (req, res) => {
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    try {
      const rsvps = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all();
      res.json(rsvps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

const storageDir = path.join(__dirname, "storage");
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

function cleanValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value).replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, 4000);
}

function pickValue(data, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== "") {
      return cleanValue(data[key]);
    }
  }
  return "";
}

function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

const requiredByType = {
  contact: ["name", "email", "subject", "message"],
  home_contact: ["name", "email", "message"],
  sidebar_contact: ["name", "email", "message"],
  hero_flight_search: ["name", "email", "from", "to", "departure_date"],
  sidebar_flight_search: ["name", "email", "from", "to", "departure_date"],
};

function buildFields(data, req) {
  const formType = pickValue(data, ["formType", "form_type"]);
  const name = pickValue(data, ["name", "fullName", "full_name"]);
  const email = pickValue(data, ["email"]);
  const phone = pickValue(data, ["phone"]);
  const subject = pickValue(data, ["subject"]);
  const message = pickValue(data, ["message"]);
  const destination = pickValue(data, ["destination"]);
  const from = pickValue(data, ["from"]);
  const to = pickValue(data, ["to"]);
  const departureDate = pickValue(data, ["departureDate", "departure_date"]);
  const returnDate = pickValue(data, ["returnDate", "return_date"]);
  const passengers = pickValue(data, ["passengers"]);
  const cabinClass = pickValue(data, ["cabinClass", "cabin_class"]);
  const tripType = pickValue(data, ["tripType", "trip_type"]);
  const pageUrl = pickValue(data, ["pageUrl", "page_url"]);

  return {
    formType,
    fields: {
      submitted_at: formatTimestamp(),
      form_type: formType,
      name,
      email,
      phone,
      subject,
      message,
      destination,
      from,
      to,
      departure_date: departureDate,
      return_date: returnDate,
      passengers,
      cabin_class: cabinClass,
      trip_type: tripType,
      page_url: pageUrl,
      ip: cleanValue(req.ip || req.headers["x-forwarded-for"] || ""),
      user_agent: cleanValue(req.headers["user-agent"] || ""),
    },
  };
}

function validateFields(formType, fields) {
  const required = requiredByType[formType] || ["email"];
  const missing = [];
  for (const field of required) {
    switch (field) {
      case "name":
        if (!fields.name) missing.push("name");
        break;
      case "email":
        if (!fields.email) missing.push("email");
        break;
      case "subject":
        if (!fields.subject) missing.push("subject");
        break;
      case "message":
        if (!fields.message) missing.push("message");
        break;
      case "from":
        if (!fields.from) missing.push("from");
        break;
      case "to":
        if (!fields.to) missing.push("to");
        break;
      case "departure_date":
        if (!fields.departure_date) missing.push("departureDate");
        break;
      default:
        break;
    }
  }
  return missing;
}

function appendCsv(fields) {
  const csvPath = path.join(storageDir, "submissions.csv");
  const exists = fs.existsSync(csvPath);
  const header = Object.keys(fields).join(",") + "\n";
  const row = Object.values(fields)
    .map((value) => {
      const escaped = String(value ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    })
    .join(",") + "\n";

  if (!exists) {
    fs.writeFileSync(csvPath, header + row, { encoding: "utf8" });
  } else {
    fs.appendFileSync(csvPath, row, { encoding: "utf8" });
  }

  return csvPath;
}

function writeXlsFromCsv(csvPath) {
  const xlsPath = path.join(storageDir, "submissions.xls");
  const content = fs.readFileSync(csvPath, "utf8");
  const rows = content.split(/\r?\n/).filter(Boolean).map((line) => {
    const cells = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        cells.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells;
  });

  let html = '<html><head><meta charset="UTF-8"></head><body><table border="1">';
  rows.forEach((row, rowIndex) => {
    html += "<tr>";
    row.forEach((cell) => {
      const tag = rowIndex === 0 ? "th" : "td";
      const safe = String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      html += `<${tag}>${safe}</${tag}>`;
    });
    html += "</tr>";
  });
  html += "</table></body></html>";

  fs.writeFileSync(xlsPath, html, { encoding: "utf8" });
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing");
  }

  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

async function sendNotificationEmail(fields) {
  const transporter = createTransporter();
  const to = process.env.MAIL_TO || "info@vukatravels.co.uk";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "info@vukatravels.co.uk";
  const replyTo = fields.email || from;

  const subject = `[Website] ${String(fields.form_type || "Form").replace(/_/g, " ")} submission`;
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`);

  await transporter.sendMail({
    to,
    from,
    replyTo,
    subject,
    text: lines.join("\n"),
  });
}

async function handleSubmission(req, res) {
  const data = req.body || {};

  if (data.website) {
    return res.status(200).json({ ok: true });
  }

  const { formType, fields } = buildFields(data, req);
  if (!formType) {
    return res.status(400).json({ error: "Missing form type" });
  }

  const missing = validateFields(formType, fields);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  try {
    const csvPath = appendCsv(fields);
    writeXlsFromCsv(csvPath);
    await sendNotificationEmail(fields);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Email failed" });
  }
}

app.post(["/api/submit", "/api/submit.php"], (req, res) => {
  handleSubmission(req, res);
});

const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

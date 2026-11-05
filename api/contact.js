/*
 * Werbeanfragen – Vercel Serverless Function (POST /api/contact)
 * Verschickt das Formular per Resend (https://resend.com) als E-Mail.
 *
 * Benötigte Environment Variables (in Vercel unter Settings → Environment Variables):
 *   RESEND_API_KEY      API-Key von Resend
 *   CONTACT_TO_EMAIL    Empfänger, mehrere mit Komma trennen
 *   CONTACT_FROM_EMAIL  Absender auf einer bei Resend verifizierten Domain,
 *                       z. B. "Kühnert & Schroeder <formular@kuehnertundschroeder.de>"
 */

const LIMITS = { name: 120, company: 160, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function readBody(req) {
  // Vercel parst JSON und application/x-www-form-urlencoded automatisch in req.body
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return Object.fromEntries(new URLSearchParams(req.body)); }
  }
  return {};
}

function validate(body) {
  const data = {
    name: clean(body.name, LIMITS.name),
    company: clean(body.company, LIMITS.company),
    email: clean(body.email, LIMITS.email),
    message: clean(body.message, LIMITS.message),
  };
  const errors = [];
  if (!data.name) errors.push("name");
  if (!data.company) errors.push("company");
  if (!EMAIL_RE.test(data.email)) errors.push("email");
  if (!data.message) errors.push("message");
  return { data, errors };
}

async function sendMail({ name, company, email, message }) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    throw new Error("Kontaktformular nicht konfiguriert: RESEND_API_KEY, CONTACT_TO_EMAIL und CONTACT_FROM_EMAIL setzen.");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: email,
      subject: `Werbeanfrage Kühnert & Schroeder: ${company}`,
      text: [
        "Neue Anfrage über kuehnertundschroeder.de",
        "",
        `Name:    ${name}`,
        `Firma:   ${company}`,
        `E-Mail:  ${email}`,
        "",
        message,
      ].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend antwortet mit ${res.status}: ${await res.text()}`);
}

module.exports = async function handler(req, res) {
  const wantsJson = String(req.headers["content-type"] || "").includes("application/json");
  const reply = (status, outcome) => {
    if (wantsJson) return res.status(status).json({ ok: status < 300, ...(outcome || {}) });
    // Versand ohne JavaScript: zurück zur Startseite mit Rückmeldung
    res.statusCode = 303;
    res.setHeader("Location", `/?anfrage=${status < 300 ? "gesendet" : "fehler"}#werbung`);
    return res.end();
  };

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const body = readBody(req);

  // Honeypot: Menschen sehen dieses Feld nicht. Bots bekommen ein „ok“, es wird aber nichts verschickt.
  if (clean(body.website, 200)) return reply(200);

  const { data, errors } = validate(body);
  if (errors.length) return reply(400, { errors });

  try {
    await sendMail(data);
    return reply(200);
  } catch (err) {
    console.error(err);
    return reply(500);
  }
};

module.exports.validate = validate;

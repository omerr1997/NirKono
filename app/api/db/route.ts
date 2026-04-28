import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    return Response.json(
      { ok: false, message: "Database environment variable is not configured." },
      { status: 503 }
    );
  }

  const sql = neon(connectionString);
  const result = await sql`
    SELECT
      'hello from NirKono DB' AS message,
      NOW() AS checked_at
  `;

  return Response.json({ ok: true, ...result[0] });
}

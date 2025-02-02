import { db } from '@vercel/postgres'

const client = await db.connect()

export async function GET() {
  try {
    const output = await client.sql`
    SELECT
        invoices.amount, customers.name
    FROM invoices
    JOIN customers
        ON invoices.customer_id = customers.id
    WHERE
        invoices.amount = 666
    `

    return Response.json({
      data: output.rows,
    })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}

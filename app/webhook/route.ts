import { put } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    // get the body of the request
    const body = await req.json()
    const { url } = await put(
      'articles/blob.txt',
      JSON.stringify(body),
      { access: 'public' }
    )
    const webhook_url = process.env.DISCORD_WEBHOOK!
    await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Bot',
        content: `New image has been posted! ${url}`,
      }),
    })

    return Response.json(
      {
        data: url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : error,
      },
      { status: 500 }
    )
  }
}

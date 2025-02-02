import { put } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    // get the body of the request
    const body = await req.json()
    const image = body.output[0].image
    const id = body.id
    const prompt = body.input.prompt

    // convert image from base64 string to buffer
    const imageBuffer = Buffer.from(image, 'base64')

    const { url } = await put(
      `images/${id}.png`,
      imageBuffer,
      {
        access: 'public',
      }
    )
    const webhook_url = process.env.DISCORD_WEBHOOK!
    await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Bot',
        // content: `${prompt} has been posted! ${url}`,
        embeds: [
          {
            image: {
              url: url,
            },
          },
        ],
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

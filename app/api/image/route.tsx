export async function POST(req: Request) {
  try {
    // get the body of the request
    const body = await req.json()
    console.log(body)
    const prompt = body.prompt

    const runpod_url = process.env.RUNPOD_FLUX_URL! + '/run'
    const RUNPOD_FLUX_SERVERLESS_KEY =
      process.env.RUNPOD_FLUX_SERVERLESS_KEY!

    console.log('runpod_url', runpod_url)
    console.log(
      'RUNPOD_FLUX_SERVERLESS_KEY',
      RUNPOD_FLUX_SERVERLESS_KEY
    )

    const response = await fetch(runpod_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RUNPOD_FLUX_SERVERLESS_KEY}`,
      },
      body: JSON.stringify({
        input: {
          prompt,
        },
        webhook:
          'https://nextjs-dashboard-tutorial-zeta-eight.vercel.app/webhook',
      }),
    })

    return Response.json(
      {
        data: await response.json(),
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

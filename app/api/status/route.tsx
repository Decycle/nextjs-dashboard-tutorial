export async function GET(req: Request) {
  try {
    // get the body of the request
    const query = new URL(req.url).searchParams
    const id = query.get('id') || ''

    const runpod_url =
      process.env.RUNPOD_FLUX_URL! + '/status/' + id
    const RUNPOD_FLUX_SERVERLESS_KEY =
      process.env.RUNPOD_FLUX_SERVERLESS_KEY!

    const response = await fetch(runpod_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RUNPOD_FLUX_SERVERLESS_KEY}`,
      },
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

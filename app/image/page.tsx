'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [id, setId] = useState('')
  const [image, setImage] = useState('')

  const healthCheck = async () => {
    const response = await fetch(`/api/status?id=${id}`)
    const data = await response.json()
    console.log(data)
    if (data.data.status === 'COMPLETED') {
      const imageBuffer = Buffer.from(
        data.data.output[0].image,
        'base64'
      )
      setImage(imageBuffer.toString('base64'))
      setId('')
    }
  }

  const submit = async () => {
    const response = await fetch('/api/image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    setId(data.data.id)
  }

  useEffect(() => {
    if (id) {
      const interval = setInterval(() => {
        healthCheck()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [id])

  return (
    <main className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>
        Image Generator
      </h1>
      <textarea
        className='w-6/12 h-6/12 p-4 mb-4 border border-gray-300 rounded-md'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className='px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-gray-400'
        onClick={submit}
        disabled={!prompt || id !== ''}>
        Generate Image
      </button>
      {id && (
        <p className='mt-4'>
          Generating image with ID: {id}...
        </p>
      )}
      {image && (
        <img
          className='mt-4'
          src={`data:image/png;base64,${image}`}
        />
      )}
    </main>
  )
}

export async function notify(message: string) {
  const url = process.env.WEBHOOK_URL
  if (!url) return false
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    })
    return true
  } catch {
    return false
  }
}



// Placeholder API route for contact form submissions.
// In production, connect to your mail service or queue.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, subject, message } = req.body || {}
  console.log('Contact submission:', { name, email, subject, message })
  return res.status(200).json({ ok: true })
}

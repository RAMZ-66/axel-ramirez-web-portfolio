// Simple test API route
export default async function handler(req, res) {
  console.log('=== TEST API CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Test API is working',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'POST request received',
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

import { login } from '../logic/controllers/accessController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return login(req, res);
  }
  res.status(405).end();
}

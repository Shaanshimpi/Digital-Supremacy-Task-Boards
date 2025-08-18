import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Method not allowed' });
  }

  const { db, client } = await connectToDatabase();

  if (!client.isConnected()) {
    return res.status(500).send({ message: 'Database connection failed' });
  }

  try {
    const { token, userId, email, boardId } = req.body;

    if (!token || !userId || !email || !boardId) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Store the invite token in database (same as email system)
    await db.collection('token').insertOne({
      token,
      userId,
      status: 'valid',
      email,
      boardId,
      createdAt: new Date()
    });

    res.status(200).send({
      message: 'Invite token generated successfully',
      token
    });
  } catch (error) {
    console.error('Generate invite error:', error);
    res.status(500).send({ message: 'Server error' });
  }
}

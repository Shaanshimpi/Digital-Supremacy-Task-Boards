import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { compare } from 'bcrypt';
import { serialize } from 'cookie';

import { sign } from 'jsonwebtoken';

const KEY = process.env.JWT_SECRET_KEY;

const isUserExists = async (db, email) => {
  const user = await db.collection('users').findOne({ email: email });

  if (user) {
    return user;
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check any field is empty
    if (!email || !password) {
      res.status(400).send({ error: 'email or password is missing' });
      return;
    }

    try {
      console.log('Login attempt for email:', email);

      if (!KEY) {
        console.error('JWT_SECRET_KEY is not defined');
        res.status(500).send({ error: 'Server configuration error' });
        return;
      }

      const { db, client } = await connectToDatabase();
      console.log('Database connection status:', client.isConnected());

      if (client.isConnected()) {
        const userDetail = await isUserExists(db, email);
        console.log('User found:', !!userDetail);

        if (userDetail) {
          console.log('Comparing passwords...');
          const isMatched = await compare(password, userDetail.password);
          console.log('Password match:', isMatched);

          if (isMatched === true) {
            const claim = { id: userDetail._id, email: userDetail.email };
            const token = sign({ user: claim }, KEY, { expiresIn: '1h' });

            res.setHeader(
              'Set-Cookie',
              serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 24 * 1000,
                sameSite: 'strict',
                path: '/'
              })
            );

            console.log('Login successful for user:', userDetail._id);
            res.send({ message: 'success', token, id: userDetail._id, status: 200 });
          } else {
            console.log('Password mismatch for user:', email);
            res.status(404).send({ error: 'Invalid username or password' });
          }
        } else {
          console.log('User not found:', email);
          res.status(404).send({ error: 'Invalid username or password' });
        }
      } else {
        console.error('Database connection failed');
        res.status(500).send({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Login error details:', error);
      console.error('Error stack:', error.stack);
      res.status(500).send({ error: 'Server error', details: error.message });
    }
  } else {
    res.status(405).send({ error: 'Method not allowed' });
  }
}

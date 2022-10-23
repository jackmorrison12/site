import { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json({ test: 'test' });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: (err as Error).message });
  }
};

export default handler;

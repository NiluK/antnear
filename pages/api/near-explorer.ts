import { transactions } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).send({ id: [], error: "Only POST requests allowed" });
    return;
  }
  const body = req.body
  if (body.account_id === undefined) {
    res.status(400).send({ error: "account_id is required" });
    return;
  }
  const transactions = await prisma.transactions.findMany({
    where: { OR: [
      { signer_account_id: body.account_id },
      { receiver_account_id: body.account_id }
    ]},
    take: 100,
  });
  res.status(200).json(toJson(transactions))
}

function toJson(transactions: transactions[]) {
  if (transactions !== undefined) {
      return JSON.stringify(transactions, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
          .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
  }
}

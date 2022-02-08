import * as nearAPI from "near-api-js";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).send({ id: [], error: "Only POST requests allowed" });
    return;
  }
  const body = JSON.parse(req.body)
  if (body.account_id === undefined) {
    res.status(400).send({ error: "account_id is required" });
    return;
  }
  const { connect, keyStores } = nearAPI;

  const config = {
    networkId: "testnet",
    keyStore: new keyStores.InMemoryKeyStore(), // this is optional but it is needed to avoid type error
    nodeUrl: `${process.env.NODE_URL}`, // use backtick format to avoid type error on config
    walletUrl: process.env.WALLET_URL,
    helperUrl: process.env.HELPER_URL,
    explorerUrl: process.env.EXPLORER_URL,
    headers: {},
  };
  const near = await connect(config);
  const account = await near.account(body.account_id);
  const accountState = await account.state();
  res.status(200).json(accountState)
}


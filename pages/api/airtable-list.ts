// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  records: string;
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE
  );
  const names: any = [];
  try {
    console.log(req.method);
    if (req.method !== "POST") {
      res.status(400).send({ records: "", error: "Only POST requests allowed" });
      return;
    }
    const body = req.body;
    if (body.account_id === undefined) {
      res.status(400).send({ records: "", error: "account_id is required" });
      return;
    }
    const records = await base(process.env.AIRTABLE_TABLE)
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 30,
        view: "Grid view",
        filterByFormula: `OR({signer_account_id} = '${body.account_id}', {receiver_account_id} = '${body.account_id}')`
        // fields: ["transaction_hash","included_in_block_hash","included_in_chunk_hash","index_in_chunk","block_timestamp","signer_account_id","signer_public_key","nonce","receiver_account_id","signature","converted_into_receipt_id","receipt_conversion_gas_burnt","receipt_conversion_tokens_burnt"]
      }).all();
    res.status(200).json({ records, error: "" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ records: "", error: "failed to load data" });
  }
}

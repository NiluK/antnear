// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE
  );
  const ids: Array<string> = [];
  if (req.method !== "POST") {
    res.status(400).send({ error: "Only POST requests allowed" });
    return;
  }
  const body = req.body;
  if (body.ids === undefined) {
    res.status(400).send({ error: "ids is required" });
    return;
  }
  try {
    base(process.env.AIRTABLE_TABLE).destroy(body.ids, function(
      err: any, 
      deletedRecords: any
    ) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err });
        return;
      }
      res.status(200).json({ message: 'Deleted' + deletedRecords.length + 'records' });
    });
  } catch (err) {
    res.status(500).json({ error: err});
  }
}

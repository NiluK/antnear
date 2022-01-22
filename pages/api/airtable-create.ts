// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: string;
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    "appZJm9vl67EuISuq"
  );
  const ids: any = [];
  if (req.method !== "POST") {
    res.status(400).send({ id: "", error: "Only POST requests allowed" });
    return;
  }
  try {
    base(process.env.AIRTABLE_TABLE).create(req.body, function (
      err: any,
      records: any
    ) {
      if (err) {
        console.error(err);
        res.status(500).json({ id: "", error: "failed to create data" });
      }
      records.forEach(function (record: any) {
        console.log(record.getId());
        ids.push(record.getId());
      });
      res.status(200).json({ id: ids, error: "" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ id: "", error: "failed to create data" });
  }
}

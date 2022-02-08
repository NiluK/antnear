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
    const records = await base(process.env.AIRTABLE_TABLE)
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 30,
        view: "Grid view",
        fields: ["Name", "Notes", "Status"]
      }).all();
    res.status(200).json({ records, error: "" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ records: "", error: "failed to load data" });
  }
}

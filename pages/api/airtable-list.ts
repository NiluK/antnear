// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
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
    const results = await base(process.env.AIRTABLE_TABLE)
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 30,
        view: "Grid view",
      })
      .eachPage(function page(records: any, fetchNextPage: any) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record: any) {
          names.push(record.get("Name"));
        });
        res.status(200).json({ name: names, error: "" });
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      });
  } catch (err) {
    res.status(500).json({ name: "", error: "failed to load data" });
  }
}

// const { connectToDatabase } = require("../../../lib/mongodb");
// const ObjectId = require("mongodb").ObjectId;

import { fetchUser } from "../../../../../../lib/googleadapter";
const { connectToDatabase } = require("../../../../../../lib/mongodb");

export default async function handler(req, res) {
  // switch the methods
  //   const { db } = await connectToDatabase();
  switch (req.method) {
    //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
    case "POST": {
      try {
        const responseJson = await fetchUser(req);
        if (typeof responseJson.error !== "undefined") {
          return res.status(401).json({
            success: false,
            errors: [{ message: "Invalid Authentication Token" }],
          });
        }

        // TODO: Move this to a cron-job somewhere else? Possibly keep it here, too.
        await fetch('https://ithem.cs.vt.edu/api/scheduled/poll');

        let { db } = await connectToDatabase();
        if (
          typeof req.body.triggerFields === "undefined" ||
          typeof req.body.triggerFields.name === "undefined"
        ) {
          return res.status(400).json({
            success: false,
            errors: [{ message: "Missing TriggerFields or TriggerFields Key" }],
          });
        }
        // handle limit 1 or 0
        let limit = 50;
        if (typeof req.body.limit !== "undefined") {
          limit = req.body.limit;
          if (limit == 0)
            return res.status(200).json({
              data: [],
              success: true,
            });
        }
        // handle missing triggerfield

        let events = await db
          .collection("events")
          .find({
            $and: [
              { email: responseJson.email },
              { name: req.body.triggerFields.name },
              { status: "true" },
            ],
          })
          .sort({ created_at: -1 })
          .limit(limit)
          .toArray();

        return res.status(200).json({
          data: JSON.parse(JSON.stringify(events)),
          success: true,
        });
      } catch (error) {
        return res.json({
          message: new Error(error).message,
          success: false,
        });
      }
    }
    case "GET": {
      return res.json("outlet_handler");
    }
  }
}

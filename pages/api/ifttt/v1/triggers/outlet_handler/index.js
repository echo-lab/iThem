// const { connectToDatabase } = require("../../../lib/mongodb");
// const ObjectId = require("mongodb").ObjectId;

import { fetchUser } from "../../../../../../lib/googleadapter"
const { connectToDatabase } = require("../../../../../../lib/mongodb");

export default async function handler(req, res) {
    // switch the methods
  //   const { db } = await connectToDatabase();
    switch (req.method) {
      //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
      case "POST": {
        try {
          //   console.log(req.data)
          const responseJson = await fetchUser(req)
          let { db } = await connectToDatabase();
          console.log(responseJson.email);

          let outlets = await db
          .collection("events")
          .find({$and: [{ email: responseJson.email }, {name: req.body.triggerFields.name}]})
          .sort({ created_at: -1 })
          .toArray();

          return res.status(200).json({
            data: JSON.parse(JSON.stringify(outlets)),
            success: true,
          });
        } catch (error) {
          return res.json({
            message: new Error(error).message,
            success: false,
          });
        }
      }
    }
  }
  
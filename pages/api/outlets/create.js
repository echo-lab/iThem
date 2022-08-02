const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
// const db = require('../../../lib/mongodb');
export default async function handler(req, res) {
  // switch the methods
  const { db } = await connectToDatabase();
  switch (req.method) {
    //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
    case "POST": {
      try {
        let outlets = await db.collection("outlets").insertOne({
          label: req.query.name,
          email: req.query.email,
          name: req.query.name,
          data: req.query.name,
          description: req.query.description,
          createdAt: new Date(),
        });
        return res.json({
          message: JSON.parse(JSON.stringify(outlets)),
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

const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  // switch the methods
  let { db } = await connectToDatabase();

  switch (req.method) {
    //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
    case "POST": {
      try {
        let outlets = await db.collection("outlets").updateOne(
          {
            _id: new ObjectId(req.query.id),
          },
          { $set: { status: req.query.status } }
        );
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

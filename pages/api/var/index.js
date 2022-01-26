const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  // switch the methods
  let { db } = await connectToDatabase();

  switch (req.method) {
    case "GET": {
      try {
        // connect to the database
        // fetch the posts
        let variables = await db
          .collection("variables")
          .find({ email: req.query.email })
          .sort({ published: -1 })
          .toArray();
        // return the posts
        return res.json({
          message: JSON.parse(JSON.stringify(variables)),
          success: true,
        });
      } catch (error) {
        // return the error
        return res.json({
          message: new Error(error).message,
          success: false,
        });
      }
    }

    case "DELETE": {
      try {
        let inlets = await db.collection("variable").deleteOne({
          _id: new ObjectId(req.query.id), 
        });
        return res.json({
          message: JSON.parse(JSON.stringify(inlets)),
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

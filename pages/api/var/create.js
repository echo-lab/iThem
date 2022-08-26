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
        let val = req.query.value;

        // TODO: we can maybe get rid of this, because it should all be validated on the front-end... lol
        switch (req.query.type) {
          case "boolean":
            if (!["true", "false"].includes(val)) {
              throw `invalid boolean value: ${val}`;
            }
            // I think we don't want to store it as a bool....
            // val = (val === "true");
            break;
          case "double":
            if (isNaN(parseFloat(val))) {
              throw `invalid double value: ${val}`;
            }
            val = parseFloat(val);
            break;
          case "int":
            if (isNaN(parseInt(val))) {
              throw `invalid int value: ${val}`;
            }
            val = parseInt(val);
            break;
          case "string":
            break;
          default:
            throw `Unrecognized type: ${req.query.type}`;
        }
        
        let variables = await db.collection("variables").insertOne({
          email: req.query.email,
          name: req.query.name,
          type: req.query.type,
          value: val,
          createdAt: new Date(),
        });
        return res.json({
          message: JSON.parse(JSON.stringify(variables)),
          success: true,
        });
      } catch (error) {
        return res.status(400).json({
          message: new Error(error).message,
          success: false,
        });
      }
    }
  }
}

const { connectToDatabase } = require("../../../../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
export default async function handler(req, res) {
  // switch the methods
  const { db } = await connectToDatabase();
  switch (req.method) {
    case "POST": {
      const email = req.body.actionFields.data.email;

      let inlet = await db
        .collection("inlets")
        .find({
          $and: [{ email: email }, { name: req.body.actionFields.inlet }],
        })
        .toArray();

      let outlets = await db
        .collection("outlets")
        .find({
          $and: [{ email: email }],
        })
        .toArray();

      let variables = await db
        .collection("variables")
        .find({
          $and: [{ email: email }],
        })
        .toArray();

      const load = (value) => {
        const found = variables.find((elm) => elm.name == value);
        if (typeof found === "undefined")
          return res.status(400).json({
            success: false,
            errors: [
              { message: "In Function 'load', variable used does not exist" },
            ],
          });
        else {
          switch (found.type) {
            case "int":
              return +found.value;
            case "double":
              return +found.value;
            case "boolean":
              return found.value == "TRUE";
            default:
              return found.value;
          }
        }
      };

      const save = (value, name) => {
        const found = variables.find((elm) => elm.name == name);
        if (typeof found === "undefined")
          return res.status(400).json({
            success: false,
            errors: [
              { message: "In Function 'save', variable used does not exist" },
            ],
          });
        else {
          fetch(
            `https://ithem.cs.vt.edu/api/var/update?id=${found._id}&value=${value}`,
            {
              method: "POST",
            }
          );
        }
      };

      const program = (name) => {
        const found = outlets.find((elm) => elm.name == name);
        if (typeof found === "undefined")
          return res.status(400).json({
            success: false,
            errors: [
              {
                message: "In Function 'Program', variable used does not exist",
              },
            ],
          });
        else {
          fetch(
            `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${name}`,
            {
              method: "POST",
            }
          );
        }
      };

      if (inlet.length != 1)
        return res.status(400).json({
          success: false,
        });
      eval(inlet[0].code);

      try {
        return res.status(200).json({
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

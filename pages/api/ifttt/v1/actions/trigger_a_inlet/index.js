const { connectToDatabase } = require("../../../../../../lib/mongodb");
import { fetchUser } from "../../../../../../lib/googleadapter";
const { NodeVM, VM } = require("vm2");

const ObjectId = require("mongodb").ObjectId;
export default async function handler(req, res) {
  // switch the methods
  const { db } = await connectToDatabase();
  switch (req.method) {
    case "POST": {
      let email;
      let actionFields;
      let data;
      if ("authorization" in req.headers) {
        const responseJson = await fetchUser(req);
        if (typeof responseJson.error !== "undefined") {
          return res.status(401).json({
            success: false,
            errors: [{ message: "Invalid Authentication Token" }],
          });
        }
        if (typeof req.body.actionFields === "undefined") {
          return res.status(400).json({
            success: false,
            errors: [{ message: "Missing ActionFields Key" }],
          });
        }

        email = responseJson.email;
        actionFields = req.body.actionFields;

        data = actionFields.data;
      } else {
        email = req.query.email;

        const body = JSON.parse(req.body);
        actionFields = body.actionFields;
        data = actionFields.data;
      }

      let inlet = await db
        .collection("inlets")
        .find({
          $and: [{ email: email }, { name: actionFields.inlet }],
        })
        .toArray();

      if (inlet.length != 1)
        return res.status(400).json({
          success: false,
          errors: [{ message: "Missing ActionFields Inlet" }],
        });

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

      const ithemLoad = (value) => {
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

      const ithemSave = (value, name) => {
        const found = variables.find((elm) => elm.name == name);
        console.log(found);
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
      let eventID = -1;
      const ithemCall = (name) => {
        const found = outlets.find((elm) => elm.name == name);
        // if there're two outlets/variables that have the same name, only one of them will be called.
        if (typeof found === "undefined")
          return res.status(400).json({
            success: false,
            errors: [
              {
                message:
                  "In Function 'ithemCall', variable used does not exist",
              },
            ],
          });
        else {
          const msg = "Outlet Triggered By IFTTT";
          const type = "outlet";
          fetch(
            `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${name}&note=${msg}&type=${type}`,
            {
              method: "POST",
            }
          ).then((res) => {
            eventID = res._id;
          });
        }
      };

      const vm = new VM({
        allowAsync:true,
        sandbox: { ithemLoad, ithemCall, ithemSave, data, setTimeout: setTimeout, setInterval:setInterval, setImmediate:setImmediate },
      });

      const handleInletLog = (inlet) => {
        const msg = "Inlet Ran By IFTTT";
        const type = "inlet";
        fetch(
          `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${inlet.name}&note=${msg}&type=${type}`,
          {
            method: "POST",
          }
        );
      };

      handleInletLog(inlet[0]);
      // eval(inlet[0].code);
      vm.run(inlet[0].code);
      // console.log("--------------------");
      try {
        return res.status(200).json({
          success: true,
          data: [
            {
              id: eventID,
            },
          ],
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

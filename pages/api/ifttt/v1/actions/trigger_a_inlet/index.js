const { connectToDatabase } = require("../../../../../../lib/mongodb");
import { fetchUser } from "../../../../../../lib/googleadapter";
const { NodeVM, VM } = require("vm2");

const ObjectId = require("mongodb").ObjectId;
export default async function handler(req, res) {
  if (req.method !== "POST") return;

  const { db } = await connectToDatabase();

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
      console.error("1) Missing req.body.actionFields. req.body is: ", req.body);
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

  if (inlet.length != 1) {
    return res.status(400).json({
      success: false,
      errors: [{ message: "Missing ActionFields Inlet" }],
    });
  }

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

  // variables stored as strings... so lets fix that here.
  variables.forEach(v => {
    if (v.type === "boolean") {
      v.value = v.value === "true";
    } else if (v.type === "int") {
      v.value = parseInt(v.value);
    } else if (v.type === "double") {
      v.value = parseFloat(v.value);
    }
  });

  ////////////////////////////////////////////////////////////////////
  // Define our API Functions: ithemLoad, ithemSave, and ithemCall. //
  ////////////////////////////////////////////////////////////////////
  const ithemLoad = (value) => {
    const found = variables.find((elm) => elm.name == value);
    if (typeof found === "undefined") {
      throw `Error: ithemLoad("${value}": state "${value}" does not exist.)`;
    }
    return found.value;
  };

  const ithemSave = (val, name) => {
    const found = variables.find((elm) => elm.name == name);
    // console.log(found);
    // console.error(name, ":", found);
    if (typeof found === "undefined") {
      throw Error(`Error: ithemSave(): state "${name}" does not exist.)`);
    }

    const type = found.type;
    if (type === "boolean" && !(true === val || false === val)) {
      throw Error(`ithemSave(${val}, "${name}") failed: ${val} is not a boolean.`);
    } else if (["int", "double"].includes(type) && typeof val !== "number") {
      throw Error(`ithemSave(${val}, "${name}") failed: ${val} is not a number.`);
    } else if (type === "int") {
      val = parseInt(val);
    } 

    // Would be good to actually await here, but it makes throwing errors problematic, so....
    // Let's just update the value and hope the fetch() works!
    found.value = val;
    fetch(
      `https://ithem.cs.vt.edu/api/var/update?id=${found._id}&value=${val}`,
      {
        method: "POST",
      }
    );
  };

  let eventID = -1;
  let fStatus = 0;
  const ithemCall = (name, data) => {
    const found = outlets.find((elm) => elm.name == name);
    fStatus = found;

    // if there're two outlets/variables that have the same name, only one of them will be called.
    if (typeof found === "undefined") {
      throw `ithemCall() error: outlet "${name}" does not exist`;
    } else {
      const msg =
        found.status === "true"
          ? "Outlet Ran Manually by iThemCall(). [Passing on to IFTTT]"
          : "Disabled Outlet Ran Manually by iThemCall().";

      const type = "outlet";
      fetch(
        `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${name}&note=${msg}&type=${type}&data=${data}&status=${found.status}`,
        {
          method: "POST",
        }
      ).then((res) => {
        eventID = res._id;
      });
    }
  };

  let _log = [];
  const ithemLog = function(...args) {
    _log.push(
      args.map(s => typeof s === "object" ? JSON.stringify(s) : "" + s).join(" ")
    );
  };


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
  if (!req.query.editor) handleInletLog(inlet[0]);

  const vm = new VM({
    allowAsync: true,
    sandbox: {
      ithemLoad,
      ithemCall,
      ithemSave,
      ithemLog,
      data,
      setTimeout: setTimeout,
      setInterval: setInterval,
      setImmediate: setImmediate,
    },
  });

  try {
    vm.run(inlet[0].code);
    return res.status(200).json({
      success: true,
      ithemLog: _log,
      data: [
        {
          id: eventID,
        },
        // {
        //   foundstatus: fStatus,
        // },
      ],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      ithemLog: _log,
      error: (typeof error === "object" && error.message) ? error.message : error,
    });
  }
}

import { fetchUser } from "../../../../../../../../lib/googleadapter";
const { connectToDatabase } = require("../../../../../../../../lib/mongodb");

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "POST": {
      const responseJson = await fetchUser(req);
      // console.log(responseJson)

      if (responseJson.error)
        res.status(401).json({ errors: [responseJson.error] });
      else {
        let { db } = await connectToDatabase();

        let outlets = await db
          .collection("outlets")
          .find({ email: responseJson.email })
          .sort({ published: -1 })
          .toArray();
        const newIFTTTReponseObj = outlets.map(
          ({ name, description, ...e }) => ({
            ...e,
            label: name,  // Could be description?
            value: name,
          })
        );
        res.json({
          data: JSON.parse(JSON.stringify(newIFTTTReponseObj)),
          success: true,
        });
      }

    }
  }
}

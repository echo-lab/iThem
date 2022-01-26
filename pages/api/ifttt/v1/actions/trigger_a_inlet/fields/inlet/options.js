
import { fetchUser } from "../../../../../../../../lib/googleadapter"
const { connectToDatabase } = require("../../../../../../../../lib/mongodb");


export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {

          const responseJson = await fetchUser(req)
          console.log(responseJson)

          if(responseJson.error)
          res.status(401).json({errors:[responseJson.error]})
        //   const email = responseJson.email
          else 
          {
            let { db } = await connectToDatabase();

            let inlets = await db
            .collection("inlets")
            .find({ email: responseJson.email })
            .sort({ published: -1 })
            .toArray();
          // return the posts
            res.json({
            data: JSON.parse(JSON.stringify(inlets)),
            success: true,
          });
          }
          

        //   res.status(200).json({email:responseJson.email})
        //   if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
        //   res.status(200).json({})
        //   else 
        //   res.status(401).json({})
  
      }
    }
  }
import { fetchUser } from "../../../../../lib/googleadapter";
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "GET": {
        const responseJson = await fetchUser(req)
        if('error' in responseJson)
          res.status(responseJson.error.code).json({errors:[responseJson.error]})
        else res.status(200).json({data: {...responseJson, name:responseJson.email}})
      }
    }
  }
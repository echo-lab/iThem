
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "GET": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({})
          else 
          res.status(401).json({})
  
      }
    }
  }
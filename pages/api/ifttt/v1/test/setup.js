
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({
            "data": {
              "accessToken": "ya29.A0ARrdaM9gxH97_GO0YelM5lq84ER611bA0JGvE-CWusCJ9U9Y_cpcRVfy8rDwuRiEeChGZZbwu81GJkaLAx5b0Wr8P_1PHXYORs-TjpJsAHb7tLwWW6rGuJXXJY3HqRVwGtEIj4fSstzKzccs0uP61946UzZaZ-uQVj4",
              "samples": {
                "triggers": {
                  "outlet_handler": {
                    "name": "outlet4"
                  },
                },
                "actions": {
                  "trigger_a_inlet":{
                    "inlet":"1",
                    "data":"test"
                  }
                },
                "actionRecordSkipping": {
                  "post_a_photo": {
                    "album": "Sports",
                    "url": "http://example.com/foo/jpg",
                    "description": ""
                  }
                }
              }
            }
          })
          else 
          res.status(401).json({})
  
      }
    }
  }
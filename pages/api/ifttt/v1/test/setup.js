
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({
            "data": {
              "accessToken": "ya29.A0ARrdaM8Jw9N_k-HpbQ5whViN0xyh52wiznck8s5qnJcjnIxFtLIcij2tzZ-6Mj3iG3GPw_PSoHLGLe35ieVva9nq1oEZzObMITIkA_0Njwq2OIF3J92csHLforQjr66C1ZVDE3tsLz7neN2eEoswlh2a1x_lOXYJ2cSv",
              "samples": {
                "triggers": {
                  "outlet_handler": {
                    "name": "TweetMoreThanTen"
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
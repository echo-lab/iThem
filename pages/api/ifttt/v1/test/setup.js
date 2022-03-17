
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({
            "data": {
              "accessToken": "ya29.A0ARrdaM-Nq1tB20qDRSQWoUKt5EAFFhsjuV5CekMnR70VpY1QlH-fywCn3BVqbKZl4Gbd49Qd4dUCb8rWToGqkFlqWwqA9vrKhEn9kyY99n3ZoCuYL8794RYIuxyAz00pgxTQczY8lT3I0k4QTL6BFMQaVf0JRr0LACCqxQ",
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
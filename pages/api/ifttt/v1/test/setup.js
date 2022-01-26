
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({
            "data": {
              "accessToken": "taSvYgeXfM1HjVISJbUXVBIw1YUkKABm",
              "samples": {
                "triggers": {
                  "any_new_photo_in_category": {
                    "category": "Nature"
                  },
                  "any_new_photo_in_album": {
                    "album": "Italy"
                  }
                },
                "triggerFieldValidations": {
                  "any_new_photo_in_album": {
                    "album": {
                      "valid": "Italy",
                      "invalid": "AlbumDoesNotExist"
                    }
                  }
                },
                "actions": {
                  "post_a_photo": {
                    "album": "Sports",
                    "url": "http://example.com/foo/jpg",
                    "description": "AT&T Park"
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
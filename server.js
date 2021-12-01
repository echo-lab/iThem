const {ObjectId} = require('mongodb');
var express = require("express");
var bodyParser   = require('body-parser');
var passport = require("passport");
const session = require("express-session");
const path = require('path');
require('./auth');
//var User = require('./user');
let app = express();
let dbo = null;
let VERBOSE = true;

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// required for passport
app.use(session({ secret: 'somethingsecret' }));
app.use(passport.initialize());
app.use(passport.session());

//var absolutePath = "/Documents/Fall2021/Research/Tests"
// this is for local running
var absolutePath = __dirname
console.log(absolutePath);

//make way for some custom css, js and images
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/ithem";

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;

  dbo = db.db("ithem");
  if(VERBOSE)console.log("Database created!");

  // of outlets collection does not exist create it
  dbo.listCollections({name: "outlets"}).next(function(err, collinfo) {
    if (collinfo) {
      console.log("Collection outlets exists");
    } else {
      dbo.createCollection("outlets", function(err, res) {
        if (err) throw err;
        if(VERBOSE)console.log("Collection outlets created!");
      });
    }
  })

  // of inlets collection does not exist create it
  dbo.listCollections({name: "inlets"}).next(function(err, collinfo) {
    if (collinfo) {
      console.log("Collection inlets exists");
    } else {
      dbo.createCollection("inlets", function(err, res) {
        if (err) throw err;
        if(VERBOSE)console.log("Collection inlets created!");
      });
    }
  })

});

let writeOKResponse = function(res, message, data){
  let obj = {
    status: "OK",
    message: message,
    data: data
  };
  if(VERBOSE)console.log("writeOKResponse:" + message);

  res.writeHead(200, {'Content-type': 'application/json'});
  res.end(JSON.stringify(obj));
}

let writeOKEmptyResponse = function(res, message, data){
  let obj = {
    status: "OK",
    message: message,
    data: data
  };
  if(VERBOSE)console.log("writeOKEmptyResponse:" + message);

  res.writeHead(204, {'Content-type': 'application/json'});
  res.end(JSON.stringify(obj));
}

let writeBadRequestResponse = function(res, message){
  if(VERBOSE)console.log("writeBadRequestResponse:" + message);
  res.writeHead(400, {'Content-type': 'text/plain'});
  res.end(message);
}

let insertDocument = function(db, collectionName, data, callback) {
  db.collection(collectionName).insertOne( data, function(err, result) {
    if(VERBOSE)console.log("insertDocument: Inserted a document into the "+collectionName+" collection. : " + data._id);
    if(callback)callback(data);
  });
};

app.get('/', function(req, res) {
    res.sendFile(path.join(absolutePath + '/../iThem/public/index.html'));
});

app.get('/main', isLoggedIn, function(req, res) {
    res.sendFile(path.join(absolutePath + '/../iThem/public/ithem.html'));
});

app.get('/about', function(req, res) {
    res.send("IThem is a service to combine one to one, many to one, one to many, and many to many trigger action pairs");
});

//outlet endpoints
app.get('/addoutlet/:outletName/:description', isLoggedIn, function (req, res) {
  console.log("test addoutlet");
  let outlet = req.body;

  if(!req.params.outletName) {
    writeBadRequestResponse(res, "addoutlet: Outlet name not defined");
    return;
  }

  if(typeof(req.params.outletName) != "string") {
    writeBadRequestResponse(res, "addoutlet: Outlet name must be string");
    return;
  }

  if(!req.params.description) {
    writeBadRequestResponse(res, "addoutlet: Description not defined");
    return;
  }

  let result = dbo.collection("outlets").find( {useremail : req.user.email, outletName: req.params.outletName} ).count().then(function(result) {
    console.log(result);
    if (result > 0) {
      writeBadRequestResponse(res, "addoutlet: Outlet name already exists");
      return;
    } else {
      // outlet.userID = ,
      outlet.useremail = req.user.email, // used as userID
      outlet.outletName = req.params.outletName,
      outlet.description= req.params.description,
      outlet.createdAt = new Date(),
      outlet.updatedAt = new Date();

      insertDocument(dbo, "outlets", outlet, function(data){
        writeOKResponse(res, "addoutlet: Added Successfully", outlet);
      });
    }
  });
});

app.get('/fetchoutlet', isLoggedIn, function (req, res) {
  console.log("test fetchoutlet");

  dbo.collection("outlets").countDocuments(function(err, count) {
    if (count == 0) {
      writeOKEmptyResponse(res, "fetchoutlet: Fetched Successfully", "Collection is empty");
    } else {
      dbo.collection("outlets").find( {useremail : req.user.email} ).toArray().then((ans) => {
        writeOKResponse(res, "fetchoutlet: Fetched Successfully", ans);
      });
    }
  });
});

app.get('/findoutletbyname/:outletName', isLoggedIn, function (req, res) {
  console.log("test fetchoutlet");

  if(!req.params.outletName) {
    writeBadRequestResponse(res, "findoutletbyname: Outlet name not defined");
    return;
  }

  if(typeof(req.params.outletName) != "string") {
    writeBadRequestResponse(res, "findoutletbyname: Outlet name must be string");
    return;
  }

  let result = null;
  dbo.collection("outlets").findOne( {useremail : req.user.email, outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeOKEmptyResponse(res, "fetchoutlet: Fetched Successfully, nothing to fetch", result);
      } else {
        console.log(result);
        writeOKResponse(res, "fetchoutlet: Fetched Successfully", result);
      }

    } else {
      result = "error";
      console.log(result + " found");
    }
  });

});

app.get('/updateoutlet/:outletName/:newOutletName', isLoggedIn, function (req, res) {
  console.log("test updateoutlet");

  if(!req.params.outletName) {
    writeBadRequestResponse(res, "updateOutlet: Existing Outlet name not defined");
    return;
  }
  if(typeof(req.params.outletName) != "string") {
    writeBadRequestResponse(res, "updateOutlet: Existing Outlet name must be string");
    return;
  }
  if(!req.params.newOutletName) {
    writeBadRequestResponse(res, "updateOutlet: New Outlet name not defined");
    return;
  }
  if(typeof(req.params.newOutletName) != "string") {
    writeBadRequestResponse(res, "updateOutlet: New Outlet name must be string");
    return;
  }

  let result = null;
  dbo.collection("outlets").findOne( {useremail : req.user.email, outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeBadRequestResponse(res, "updateOutlet: Existing outlet not found");
        return;
      }
      dbo.collection("outlets").updateOne( {'useremail' : req.user.email, 'outletName': req.params.outletName}, {$set:{'outletName':req.params.newOutletName, 'updatedAt': new Date()}}, function(err, item) {
        if (!err) {
          console.log("1 document updated");
          let updatedResult = null;
          dbo.collection("outlets").findOne( {useremail : req.user.email, outletName: req.params.newOutletName}, function(err, item) {
            if (!err) {
              updatedResult = item;
              if (typeof updatedResult === 'undefined') {
                writeBadRequestResponse(res, "updateOutlet: Updated Outlet not found");
                return;
              } else {
                console.log(updatedResult);
                writeOKResponse(res, "updateOutlet: Updated Successfully", updatedResult);
              }

            } else {
              result = "error";
              console.log(result + " found");
            }
          });
        } else {
          result = "error";
          throw err;
        }
      });
    } else {
      result = "error";
      throw err;
    }
  });

});

app.get('/removeoutlet/:outletName', isLoggedIn, function (req, res) {
  console.log("test removeoutlet");
  if(!req.params.outletName) {
    writeBadRequestResponse(res, "removeoutlet: Outlet name not defined");
    return;
  }

  if(typeof(req.params.outletName) != "string") {
    writeBadRequestResponse(res, "removeoutlet: Outlet name must be string");
    return;
  }
  // get named outlet from collection
  let result = null;
  dbo.collection("outlets").findOne( {useremail : req.user.email, outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined' || result === null) {
        writeBadRequestResponse(res, "removeoutlet: Outlet does not exist");
        return;
      } else {
        console.log(result);
        var query = {useremail : req.user.email, outletName: req.params.outletName};
        dbo.collection("outlets").deleteOne(query, function(err, obj) {
          if (err) throw err;
          writeOKResponse(res, "removeoutlet: Outlet Removed Successfully", result);
        })
      }

    } else {
      result = "error";
    }
  });


});

//inlet endpoints
app.get('/addinlet/:inletName/:description', isLoggedIn, function (req, res) {
  console.log("test addinlet");
  let inlet = req.body;

  if(!req.params.inletName) {
    writeBadRequestResponse(res, "addinlet: Inlet name not defined");
    return;
  }

  if(typeof(req.params.inletName) != "string") {
    writeBadRequestResponse(res, "addinlet: Inlet name must be string");
    return;
  }

  if(!req.params.description) {
    writeBadRequestResponse(res, "addinlet: Description not defined");
    return;
  }

  let result = dbo.collection("inlets").find( {useremail : req.user.email, inletName: req.params.inletName} ).count().then(function(result) {
    console.log(result);
    if (result > 0) {
      writeBadRequestResponse(res, "addinlet: Inlet name already exists");
      return;
    } else {
      // outlet.userID = ,
      inlet.useremail = req.user.email, // used as userID
      inlet.inletName = req.params.inletName,
      inlet.description= req.params.description,
      inlet.createdAt = new Date(),
      inlet.updatedAt = new Date();

      insertDocument(dbo, "inlets", inlet, function(data){
        writeOKResponse(res, "addinlet: Added Successfully", inlet);
      });
    }
  });
});

app.get('/fetchinlet', isLoggedIn, function (req, res) {
  console.log("test fetchinlet");

  dbo.collection("inlets").countDocuments(function(err, count) {
    if (count == 0) {
      writeOKEmptyResponse(res, "fetchinlet: Fetched Successfully", "Collection is empty");
    } else {
      dbo.collection("inlets").find( {useremail : req.user.email} ).toArray().then((ans) => {
        writeOKResponse(res, "fetchinlet: Fetched Successfully", ans);
      });
    }
  });
});

app.get('/updateinlet/:inletName/:newInletName', isLoggedIn, function (req, res) {
  console.log("test updateinlet");

  if(!req.params.inletName) {
    writeBadRequestResponse(res, "updateInlet: Existing Inlet name not defined");
    return;
  }
  if(typeof(req.params.inletName) != "string") {
    writeBadRequestResponse(res, "updateInlet: Existing Inlet name must be string");
    return;
  }
  if(!req.params.newInletName) {
    writeBadRequestResponse(res, "updateInlet: New Inlet name not defined");
    return;
  }
  if(typeof(req.params.newInletName) != "string") {
    writeBadRequestResponse(res, "updateInlet: New Inlet name must be string");
    return;
  }

  let result = null;
  dbo.collection("inlets").findOne( {useremail : req.user.email, inletName: req.params.inletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeBadRequestResponse(res, "updateInlet: Existing Inlet not found");
        return;
      }
      dbo.collection("inlets").updateOne( {'useremail' : req.user.email, 'inletName': req.params.inletName}, {$set:{'inletName':req.params.newInletName, 'updatedAt': new Date()}}, function(err, item) {
        if (!err) {
          console.log("1 document updated");
          let updatedResult = null;
          dbo.collection("inlets").findOne( {useremail : req.user.email, inletName: req.params.newInletName}, function(err, item) {
            if (!err) {
              updatedResult = item;
              if (typeof updatedResult === 'undefined') {
                writeBadRequestResponse(res, "updateInlet: Updated Inlet not found");
                return;
              } else {
                console.log(updatedResult);
                writeOKResponse(res, "updateInlet: Updated Successfully", updatedResult);
              }

            } else {
              result = "error";
              console.log(result + " found");
            }
          });
        } else {
          result = "error";
          throw err;
        }
      });
    } else {
      result = "error";
      throw err;
    }
  });

});

app.get('/removeinlet/:inletName', isLoggedIn, function (req, res) {
  console.log("test removeinlet");
  if(!req.params.inletName) {
    writeBadRequestResponse(res, "removeinlet: Inlet name not defined");
    return;
  }

  if(typeof(req.params.inletName) != "string") {
    writeBadRequestResponse(res, "removeinlet: Inlet name must be string");
    return;
  }
  // get named outlet from collection
  let result = null;
  dbo.collection("inlets").findOne( {useremail : req.user.email, inletName: req.params.inletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined' || result === null) {
        writeBadRequestResponse(res, "removeinlet: Inlet does not exist");
        return;
      } else {
        console.log(result);
        var query = {useremail : req.user.email, inletName: req.params.inletName};
        dbo.collection("inlets").deleteOne(query, function(err, obj) {
          if (err) throw err;
          writeOKResponse(res, "removeinlet: Inlet Removed Successfully", result);
        })
      }

    } else {
      result = "error";
    }
  });


});

// authentication endpoints
app.get("/auth/google",
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

// Declare the redirect routes as authenticated and failure
app.get("/google/callback",
  passport.authenticate('google', {
    successRedirect: '/authenticated',
    failureRedirect: '/auth/failure',
 })
);

//only if logged in
app.get("/authenticated", isLoggedIn, (req, res) => {
  res.send(`You are authenticated succesfully: Hello ${req.user.displayName}`);

});

//if login fails
app.get("/auth/failure", (req, res) => {
  res.send('You are not logged in, something went wrong');
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get('/oauth2/authorize', (req, res) => {
  console.log("api auth");
  res.send("Grant IFTTT access");
});

app.get('/oauth2/token', (req, res) => {
  console.log("get token");
});

// API endpoints
app.get('/ifttt/v1/status', (req, res) => {
 console.log("Status check!")
 if (req.headers['IFTTT-Service-Key'] == 'iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb') {
  res.sendStatus(200)
 }
 else {
  res.sendStatus(401)
 }
})

app.post('/ifttt/v1/test/setup', (req, res) => {
 console.log("Test Setup check!")

 if (req.headers['IFTTT-Service-Key'] == 'iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb') {
  res.status(200).send({
     "data": {
     }
  })
}

 else {
  res.sendStatus(401)
 }
})

app.post('/ifttt/v1/triggers/new_inlet', (req, res) => {
 console.log("Trigger Check")

if(req.body.limit == '1') {
  res.status(200).send({
     "data": [
      {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00"
      }
    ]
  })

}

else if(req.body.limit == '0') {
  res.status(200).send({
     "data": [
    ]
  })

}

else if (req.headers['IFTTT-Service-Key'] == 'iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb') {
  res.status(200).send({
     "data": [
    {
      "image_url": "http://example.com/images/128",
      "tags": "banksy, brooklyn",
      "posted_at": "2013-11-04T09:23:00-07:00",
      "created_at": "2013-11-04T09:23:00-07:00",
      "meta": {
        "id": "14b9-1fd2-acaa-5df5",
        "timestamp": 1383597267
      }
    },
    {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00",
      "created_at": "2013-11-04T09:23:00-07:00",
      "meta": {
        "id": "ffb27-a63e-18e0-18ad",
        "timestamp": 1383596355
      }
    },
    {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00",
      "created_at": "2013-11-04T09:23:00-07:00",
      "meta": {
        "id": "f27-a63e-18w0-185d",
        "timestamp": 1383596355
      }
    }
  ]
  })


}

  else {
  res.status(401).send({
     "errors": [
       {
         "message": "Something went wrong!"
       }
      ]
  })
  }
})


app.post('/ifttt/v1/queries/list_all_inlets', (req, res) => {
 console.log("Queries check")

if(req.body.limit == '1') {
  res.status(200).send({
     "data": [
      {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00"
      }
    ],
    "cursor": "seijjh24ks"
  })

}


else if (req.headers['IFTTT-Service-Key'] == 'iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb') {
  res.status(200).send({
     "data": [
      {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00"
      },
      {
      "image_url": "http://example.com/images/125",
      "tags": "banksy, nyc",
      "posted_at": "2013-11-04T03:23:00-07:00"
      }
    ]
  })
}

 else {
   res.status(401).send({
     "errors": [
       {
         "message": "Something went wrong!"
       }
      ]
  })
  }
})

app.post('/ifttt/v1/actions/new_outlet', (req, res) => {
 console.log("Actions check")

 if (req.headers['IFTTT-Service-Key'] == 'iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb') {
  res.status(200).send({
     "data": [
      {
      "url": "http://example.com/images/125",
      "id": "xxxx"
      },
    ]
  })
}

   else {
  res.status(401).send({
     "errors": [
       {
         "message": "Something went wrong!"
       }
      ]
  })
 }
})


let server = app.listen(8081, function(){
    let port = server.address().port;
    if(VERBOSE)console.log("Server started at http://localhost:%s", port);
});

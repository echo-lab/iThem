const {ObjectId} = require('mongodb');
var express = require("express");
var bodyParser   = require('body-parser');
var passport = require("passport");
const session = require("express-session");
require('./auth');
let app = express();
let dbo = null;
let VERBOSE = true;

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));

// required for passport
app.use(session({ secret: 'somethingsecret' }));
app.use(passport.initialize());
app.use(passport.session());

//var absolutePath = "/Documents/Fall2021/Research/Tests"
// this is for local running
var absolutePath = __dirname
console.log(absolutePath);

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/iThem";

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;

  dbo = db.db("iThem");
  if(VERBOSE)console.log("Database created!");

  // work out debugging
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
    res.sendFile(path.join(absolutePath + '/../public/index.html'));
});

//outlet endpoints
app.get('/addoutlet/:outletName/:description', function (req, res) {
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

  let result = dbo.collection("outlets").find( {outletName: req.params.outletName} ).count().then(function(result) {
    console.log(result);
    if (result > 0) {
      writeBadRequestResponse(res, "addoutlet: Outlet name already exists");
      return;
    } else {
      // outlet.userID = ,
      // outlet.username = ,
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

app.get('/fetchoutlet', function (req, res) {
  console.log("test fetchoutlet");

  dbo.collection("outlets").count(function(err, count) {
    if (count == 0) {
      writeOKResponse(res, "fetchoutlet: Fetched Successfully", "Collection is empty");
    } else {
      dbo.collection("outlets").find( {} ).toArray().then((ans) => {
        writeOKResponse(res, "fetchoutlet: Fetched Successfully", ans);
      });
    }
  });
});

app.get('/findoutletbyname/:outletName', function (req, res) {
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
  dbo.collection("outlets").findOne( {outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeOKResponse(res, "fetchoutlet: Fetched Successfully, nothing to fetch", result);
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

app.get('/updateoutlet/:outletName/:newOutletName', function (req, res) {
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
  dbo.collection("outlets").findOne( {outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeBadRequestResponse(res, "updateOutlet: Existing outlet not found");
        return;
      }
      dbo.collection("outlets").update( {'outletName': req.params.outletName}, {$set:{'outletName':req.params.newOutletName, 'updatedAt': new Date()}}, function(err, item) {
        if (!err) {
          console.log("1 document updated");
          let updatedResult = null;
          dbo.collection("outlets").findOne( {outletName: req.params.newOutletName}, function(err, item) {
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

app.get('/removeoutlet/:outletName', function (req, res) {
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
  dbo.collection("outlets").findOne( {outletName: req.params.outletName}, function(err, item) {
    if (!err) {
      result = item;
      if (typeof result === 'undefined') {
        writeBadRequestResponse(res, "removeoutlet: Outlet does not exist");
        return;
      } else {
        console.log(result);
        var query = {outletName: req.params.outletName};
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
  res.send('You have logged out');
});


let server = app.listen(8081, function(){
    let port = server.address().port;
    if(VERBOSE)console.log("Server started at http://localhost:%s", port);
});

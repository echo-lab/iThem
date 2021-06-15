
// const { MongoClient } = require('mongodb');

// async function main() {
//     const uri = "mongodb+srv://ithem:echolabuser@cluster0.xmrq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri);
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
//         // Make the appropriate DB calls
//         await listDatabases(client);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // Close the connection to the MongoDB cluster
//         await client.close();
//     }
// }

// main().catch(console.error);

// /**
//  * Print the names of all available databases
//  */
// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };



const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const path = require('path');
//to load all reference files
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true,}));

app.use(bodyParser.json())

//start

mongoose.connect("mongodb+srv://ithem:echolabuser@cluster0.xmrq9.mongodb.net/ithemDB", { useNewUrlParser: true }, { useUnifiedTopology: true });
//create a data schema
const varSchema = {
  name: String,
  type: String,
  value: String
}

const Variable = mongoose.model("Variable", varSchema);

app.get('/main', (req, res) => {
  console.log("go to the main page")
  res.sendFile(path.join(__dirname, '/public/ithem.html'));
  
})

app.post('/main', (req, res) => {
  let newVal = new Variable({
    name:req.body.name,
    type:req.body.type,
    value:req.body.value
  });
  newVal.save();
  res.redirect("/main");
})
//end



app.get('/', (req, res) => {
 console.log("receive signal")
 res.send('Hello IFTTT, this is ruipu requesting\n!')
})

app.get('/ifttt/v1/status', (req, res) => {
 console.log("Status check!")
 if (req.headers['ifttt-channel-key'] == 'MxGOPSFwRInVcQCunZ5nWywNoEX5ToDuoQQNZNDlOj0yLgqmnxeY_djc8qewFamT') {
  res.sendStatus(200)
 }
 else {
  res.sendStatus(401)
 }
})

app.post('/ifttt/v1/test/setup', (req, res) => {
 console.log("Test Setup check!")

 if (req.headers['ifttt-channel-key'] == 'MxGOPSFwRInVcQCunZ5nWywNoEX5ToDuoQQNZNDlOj0yLgqmnxeY_djc8qewFamT') {
  res.status(200).send({
     "data": {
     }
  })
}

 else {
  res.sendStatus(401)
 }
})

app.post('/ifttt/v1/triggers/hello_world', (req, res) => {
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


else if (req.headers['ifttt-channel-key'] == 'MxGOPSFwRInVcQCunZ5nWywNoEX5ToDuoQQNZNDlOj0yLgqmnxeY_djc8qewFamT') {
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


app.post('/ifttt/v1/queries/list_all_things', (req, res) => {
 console.log("Queries check!")

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


else if (req.headers['ifttt-channel-key'] == 'MxGOPSFwRInVcQCunZ5nWywNoEX5ToDuoQQNZNDlOj0yLgqmnxeY_djc8qewFamT') {
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

app.post('/ifttt/v1/actions/create_new_thing', (req, res) => {
 console.log("Actions check!")

 if (req.headers['ifttt-channel-key'] == 'MxGOPSFwRInVcQCunZ5nWywNoEX5ToDuoQQNZNDlOj0yLgqmnxeY_djc8qewFamT') {
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


app.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`)
})

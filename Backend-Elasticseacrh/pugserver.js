const express = require("express");
var client = require("./connection.js");
var inputfile = require("./constituencies.json");
var bulk = [];
var cors = require("cors");
var bodyParser = require('body-parser')


const app = express();
var dataInserted = false;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.set("view engine", "pug");

//For loading the data and displaying the html form
app.get("/", (req, res) => {
  // loading the data into elastic search
  var makebulk = function (constituencylist, callback) {
    for (var current in constituencylist) {
      bulk.push(
        {
          index: {
            _index: "gov",
            _type: "constituencies",
            _id: constituencylist[current].PANO,
          },
        },
        {
          constituencyname: constituencylist[current].ConstituencyName,
          constituencyID: constituencylist[current].ConstituencyID,
          constituencytype: constituencylist[current].ConstituencyType,
          electorate: constituencylist[current].Electorate,
          validvotes: constituencylist[current].ValidVotes,
          regionID: constituencylist[current].RegionID,
          county: constituencylist[current].County,
          region: constituencylist[current].Region,
          country: constituencylist[current].Country,
        }
      );
    }
    callback(bulk);
  };

  var indexall = function (madebulk, callback) {
    client.bulk(
      {
        maxRetries: 5,
        index: "gov",
        type: "constituencies",
        body: madebulk,
      },
      function (err, resp, status) {
        if (err) {
          console.log(err);
        } else {
          callback(resp.items);
        }
      }
    );
  };
  if (!dataInserted) {
    dataInserted = true;
    makebulk(inputfile, function (response) {
      console.log("Bulk content prepared");
      indexall(response, function (response) {
        console.log(response);
      });
    });
  } else {
    console.log("--> Data already inserted");
  }

  // __dirname is the current directory you're in
  res.sendFile(__dirname + "/index.html");
  //res.render("register");
});

//For searching
app.post("/search", (req, res) => {
  //console.log(req.body.name);
  //console.log(req)
  const searchName = req.body.name;
  console.log(searchName)
  const fuzzinessValue = req.body.fuzziness;
  client.search(
    {
      index: "gov",
      type: "constituencies",
      body: {
        query: {
          match: {
            constituencyname: {
              query: searchName,
              fuzziness: fuzzinessValue,
              prefix_length: 1,
            },
          },
        },
      },
    },
    function (error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
        console.log(searchName);
        res.render("latestview", {
          title: "Hey",
          searchItem: searchName,
          data: response["hits"]["hits"],
        });
      }
    }
  ); /*
    .then(
      (r) =>
        res.render("latestview", {
          title: "Hey",
          searchItem: searchName,
          data: r["hits"]["hits"],
        })
      //res.send(r["hits"]["hits"].map((e) => e))
    )
    .catch((e) => {
      console.error(e);
      res.send([]);
    });*/
});

//For adding an entry
app.post("/create", (req, res) => {
  // loading the data into elastic search
  var addingData = function (callback) {
    bulk.push(
      {
        index: {
          _index: "gov",
          _type: "constituencies",
        },
      },
      {
        constituencyname: req.body.constituencyname,
        constituencyID: "E14000530",
        constituencytype: "Borough",
        electorate: 72430,
        validvotes: 46191,
        regionID: "E12000008",
        county: req.body.county,
        region: "South East",
        country: "England",
      }
    );
    callback(bulk);
  };

  var indexall = function (addingData, callback) {
    client.bulk(
      {
        maxRetries: 5,
        index: "gov",
        type: "constituencies",
        body: addingData,
      },
      function (err, resp, status) {
        if (err) {
          console.log(err);
        } else {
          callback(resp.items);
        }
      }
    );
  };

  addingData(function (response) {
    console.log("Bulk content prepared");
    indexall(response, function (response) {
      console.log(response);
    });
  });
  res.send("Record is added");
});



app.get("/hello", (req, res) => {
  res.send("hello")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

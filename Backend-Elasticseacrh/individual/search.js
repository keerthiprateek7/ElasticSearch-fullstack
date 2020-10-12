var client = require("./connection.js");
const term = "Harwich";
client.search(
  {
    index: "gov",
    type: "constituencies",
    body: {
      query: {
        match: {
          constituencyname: {
            query: term,
            fuzziness: 2,
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
      console.log("--- Response ---");
      console.log(response);
      console.log("--- Hits ---");
      response.hits.hits.forEach(function (hit) {
        console.log(hit);
      });
    }
  }
);

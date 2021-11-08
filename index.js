const path = require("path");
const async = require("async");
const newman = require("newman");

const PARALLEL_RUN_COUNT = 25;

const parametersForTestRun = {
  collection: path.join(__dirname, "postman/postman_collection.json"), // your collection
  // environment: path.join(__dirname, 'postman/localhost.postman_environment.json'), //your env
  reporters: "cli",
};

parallelCollectionRun = function (done) {
  newman.run(parametersForTestRun, done);
};

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
  commands.push(parallelCollectionRun);
}

let failed = 0;
let failedMessage = [];
let success = 0;

// Runs the Postman sample collection thrice, in parallel.
async.parallel(commands, (err, results) => {
  err && console.error(err);

  results.forEach(function (result, index) {
    var failures = result.run.failures;
    if (failures.length) {
      failed = failed + 1;
      failedMessage.push(
        `Iteration ${index + 1} - ${failures[0].error.message}`
      );
    } else {
      success = success + 1;
    }
  });
  console.info("");
  console.info("Collection Run Completed");
  console.info("=========================");
  console.info("SUMMARY");
  console.info("");
  console.info("Failed Scenario :", failed);
  console.info("Success Scenario :", success);
  console.info("=========================");
  console.info("DETAIL INFORMATION");
  console.info("");
  console.info("Failed Reason :", JSON.stringify(failedMessage, null, 2));
  console.info("=========================");
});

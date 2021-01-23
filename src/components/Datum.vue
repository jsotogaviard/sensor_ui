<template>
  <div id="datum">
    <Data
      :name="getRooms.config1"
      :data="getRooms.data"
    ></Data>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import csv from "csvtojson";
import Data from "./Data.vue";

AWS.config.update(config.s3);
var s3 = new AWS.S3();

var datum = [];
export default {
  name: "Datum",
  components: {
    Data,
  },
  data: function () {
    return {
      datum: datum
    };
  },
  computed: {
    getDatum() {
      // List all folder in bucket out
      var outParams = {
        Bucket: config.s3.bucket,
        Prefix: config.out,
        Delimiter: "",
      };
      s3.listObjects(outParams, function (err, data) {
        if (err) {
          console.log(JSON.stringify(err));
        } else {

           s3.listObjects(outParams, function (err, data) {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          // Retrieve content of all files
          var tmpData = [];
          var count = 0;
          const filesNumber = data.Contents.length;
          for (var i in data.Contents) {
            var csvFile = data.Contents[i].Key;
            const fileParams = {
              Bucket: config.s3.bucket,
              Key: csvFile,
            };
            // get csv file and create stream
            s3.getObject(fileParams, function (err, data) {
              var string = String.fromCharCode.apply(null, data.Body);
              csv()
                .fromString(string)
                .then((jsonObj) => {
                  count++;
                  tmpData.push(...jsonObj);
                  if (count == filesNumber) {
                    // On the latest call
                    // reo organize data
                    const uniqueMacs = [
                      ...new Set(tmpData.map((item) => item.mac)),
                    ];

                    // Init current data
                    var currentData = {};
                    tmpData.forEach(function (element) {
                      uniqueMacs.forEach(function (mac) {
                        if (!currentData[mac] && element[mac]) {
                          currentData[mac] = element.temperature
                        } 
                      });
                    });

                    // Augment with current data
                    tmpData.forEach(function (element) {
                      uniqueMacs.forEach(function (mac) {
                        if (element[mac]) {
                          currentData[mac] = element.temperature
                        } 
                        Object.assign(element, currentData);
                      });
                    });

                    bleData.push(...tmpData)

                    config1.values = unique;
                  }
                });
            });
          }
        }
        });
        }
        
      });

      return {
        data: bleData,
        config1: config1,
      };
    },
  },
};
</script>

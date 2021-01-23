<template>
  <div id="rooms">
    <D3LineChart
      :config="getRooms.config1"
      :datum="getRooms.data"
    ></D3LineChart>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import csv from "csvtojson";
import { D3LineChart } from "vue-d3-charts";
AWS.config.update(config.s3);
var s3 = new AWS.S3();

var bleData = [];
var config1 = {
  values: [],
  date: {
    key: "time",
    inputFormat: "%m/%d/%Y, %H:%M:%S",
    outputFormat: "%m/%d/%Y, %H:%M:%S",
  },
  points: true,
  axis: {
    yTicks: 3,
  },
};

export default {
  name: "Rooms",
  components: {
    D3LineChart,
  },
  data: function () {
    return {
      data: bleData,
      config1: config1,
    };
  },
  computed: {
    getRooms() {
      // List all files in bucket
      var roomParams = {
        Bucket: config.s3.bucket,
        Prefix: "",
        Delimiter: "",
      };
      s3.listObjects(roomParams, function (err, data) {
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

      return {
        data: bleData,
        config1: config1,
      };
    },
  },
};
</script>

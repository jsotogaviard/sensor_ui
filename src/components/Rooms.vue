<template>
  <div id="rooms">
    <ul id="example-1">

        <D3LineChart :config="getRooms.config1" :datum="getRooms.data"></D3LineChart>
    </ul>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import csv from "csvtojson";
import { D3LineChart } from "vue-d3-charts";
AWS.config.update(config.s3);
var s3 = new AWS.S3();


export default {
  name: "Rooms",
  components: {
    D3LineChart,
  },
  computed: {
    
    getRooms() {
      var params = {
        Bucket: config.s3.bucket,
        Prefix: "",
        Delimiter: "/",
      };

      var roomsName = [];
      s3.listObjects(params, function (err, data) {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          // Retrieve folders
          for (var i in data.CommonPrefixes) {
            var name = data.CommonPrefixes[i].Prefix;
            roomsName.push(name);
          }
        }

        roomsName.forEach(function (room) {
          // Retrieve csv data from rooms
          var currentRoom = {
            name: room,
            data: [],
          };
          var roomParams = {
            Bucket: config.s3.bucket,
            Prefix: room,
            Delimiter: "",
          };

          s3.listObjects(roomParams, function (err, data) {
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              // Retrieve files
              for (var i in data.Contents) {
                var csvFile = data.Contents[i].Key;
                const fileParams = {
                  Bucket: config.s3.bucket,
                  Key: csvFile,
                };
                // get csv file and create stream
                s3.getObject(fileParams, function (err, data) {
                  console.log(data);
                  console.log(err);
                  var string = String.fromCharCode.apply(null, data.Body);
                  // convert csv file (stream) to JSON format data
                  csv()
                    .fromString(string)
                    .then((jsonObj) => {
                      console.log(jsonObj);
                      currentRoom.data.push(jsonObj);
                      //rooms.push(currentRoom);
                    });
                });
              }
            }
          });
        });
      });

      var data = [
        { hours: 238, production: 134, date: 2000 },
        { hours: 938, production: 478, date: 2001 },
        { hours: 1832, production: 1392, date: 2002 },
        { hours: 2092, production: 2343, date: 2003 },
        { hours: 2847, production: 2346, date: 2004 },
        { hours: 2576, production: 2233, date: 2005 },
        { hours: 2524, production: 2325, date: 2006 },
        { hours: 1648, production: 2456, date: 2007 },
        { hours: 2479, production: 2329, date: 2008 },
        { hours: 3200, production: 2438, date: 2009 },
      ];
      // Configuration
      var config1 = {
        values: ["hours", "production"],
        date: {
          key: "date",
          inputFormat: "%Y",
          outputFormat: "%Y",
        },
        points: false,
        axis: {
          yTicks: 3,
        },
      };
      return {
        data: data,
        config1:config1
      };
    },
  },
};
</script>

<template>
  <div id="datum">
    <button @click="reload">Reload</button>
    <div v-for="data in getDatum.datum" :key="data.name + data.data.length">
      <Data :name="data.name" :data="data.data" :sensors="data.sensors"/>
    </div>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import Data from "./Data.vue";
AWS.config.update(config.s3);
var s3 = new AWS.S3();

function buildSensorMap(contents) {
  const uniqueMacs = [...new Set(contents.map((item) => item.Key))];
  const outContents = uniqueMacs.filter(function (str) {
    return str.indexOf(config.s3.out) != -1;
  });
  const sensors = new Set();
  const sensorMap = [];
  outContents.forEach(function (outContent) {
    var array = outContent.split("/");
    sensors.add(array[1]);
  });
  sensors.forEach(function (sensor) {
    const sensorFiles = outContents.filter(function (str) {
      return str.indexOf(sensor) != -1;
    });
    sensorMap.push({
      name: sensor,
      files: sensorFiles,
    });
  });
  return sensorMap;
}

var datum = [];
export default {
  name: "Datum",
  components: {
    Data,
  },
  data: function () {
    return {
      datum: datum,
    };
  },
  methods: {
    reload() {
      this.$forceUpdate();
    },
  },
  computed: {
    getDatum() {
      // List all folder in bucket out
      var bucketParams = {
        Bucket: config.s3.bucket,
        Prefix: "",
        Delimiter: "",
      };
      s3.listObjects(bucketParams, function (err, response) {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          const sensorMap = buildSensorMap(response.Contents);
          sensorMap.forEach(function (sensor) {
            var data = {
              name: sensor.name,
              files: sensor.files,
              data: [],
              sensors: new Set(),
            };
            datum.push(data);
            data.files.forEach(function (file) {
              const fileParams = {
                Bucket: config.s3.bucket,
                Key: file,
              };

              // read data and push it in the data structure
              s3.getObject(fileParams, function (err, response) {
                var string = String.fromCharCode.apply(null, response.Body);
                var jsonString = JSON.parse(string);
                const outContents = new Set()
                 jsonString.content.filter(function (str) {
                  outContents.add(...Object.keys(str) );
                });
                data.sensors.add([
                  ...outContents
                ]);
                data.data.push(...jsonString.content);
                console.log(JSON.stringify(datum));
              });
            });
          });
        }
      });
      return {
        datum: datum,
      };
    },
  },
};
</script>

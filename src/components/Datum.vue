<template>
  <div id="datum">
    <div v-for="data in datum" :key="data.name + data.data.length">
      <Data :name="data.name" :data="data.data" :sensors="data.sensors" />
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

export default {
  name: "Datum",
  components: {
    Data,
  },
  data: function () {
    return {
      datum: null,
    };
  },
  methods: {
    async getSensorData() {
      const tata = []
      this.datum=tata
      var bucketParams = {
        Bucket: config.s3.bucket,
        Prefix: "",
        Delimiter: "",
      };

      const filesInBucket = await s3
        .listObjects(bucketParams)
        .promise()
        .catch((error) => console.log(JSON.stringify(error)));

      const sensorMap = buildSensorMap(filesInBucket.Contents);
      sensorMap.forEach(async function (sensor) {
        var data = {
          name: sensor.name,
          files: sensor.files,
          data: [],
          sensors: new Set(),
        };
        tata.push(data);
        data.files.forEach(async function (d) {
          const fileParams = {
            Bucket: config.s3.bucket,
            Key: d,
          };

          const file = await s3
            .getObject(fileParams)
            .promise()
            .catch((error) => console.log(JSON.stringify(error)));

          var string = String.fromCharCode.apply(null, file.Body);
          var jsonString = JSON.parse(string);
          const outContents = new Set();
          jsonString.content.filter(function (str) {
            outContents.add(...Object.keys(str));
          });
          data.sensors.add([...outContents]);
          data.data.push(...jsonString.content);
        });
      });
    },
  },
  async mounted() {
    // Get sensor data
    await this.getSensorData();
  },
};
</script>

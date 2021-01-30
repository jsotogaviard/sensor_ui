<template>
  <div id="sensors">
    <div v-for="sensor in sensors" :key="sensor.name + sensor.data.length">
      <Sensor :name="sensor.name" :data="sensor.data" />
    </div>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import Sensor from "./Sensor.vue";
AWS.config.update(config.s3);
const s3 = new AWS.S3();

function getOrCreateSensorData(tmpSensors, name) {
  var index = -1;
  for (const idx in tmpSensors) {
    if (tmpSensors[idx].name == name) index = idx;
  }
  if (index == -1) {
    const sensorData =  {
      name: name,
      data: [],
    };
    tmpSensors.push(sensorData)
    return sensorData
  } else {
    return tmpSensors[index]
  }
}

export default {
  name: "Sensors",
  components: {
    Sensor,
  },
  data: function () {
    return {
      sensors: null,
    };
  },
  methods: {
    async getSensors() {
      // Init temp sensors
      // TODO bind it
      const tmpSensors = [];
      this.sensors = tmpSensors;

      // Retrieve all files in bucket
      const filesInBucket = await s3
        .listObjects({ Bucket: config.s3.bucket, Prefix: "", Delimiter: "" })
        .promise()
        .catch((error) => console.log(JSON.stringify(error)));

      // Fill temporary sensors in a structure that contains:
      // the name of the sensor data
      // the files that contain this sensor data
      // the instances that are emitting this sensor data i.e. the rooms
      // The back end structure is
      // out/sensor_data_name/a_file_per_day i.e.
      // - out/temperature/21012020.csv
      // - out/temperature/22012020.csv
      // The file content is the following in json:
      //  "time": "20211301010000",
      //  "a4c138a8554e": "14",
      //  "a4c138ab5905": "14",
      //  "a4c138c70dad": "14",
      //  "a4c138cc430d": "14"
      filesInBucket.Contents.forEach(async (item) => {
        // 0. Filter out Files
        if(!item.Key.startsWith(config.s3.out)) return
        
        // 1. Retrieve the name of the sensor data
        const outFile = item.Key
        const outFileArray = outFile.split("/");
        const sensorName = outFileArray[1];

        // 2. Read sensor data content
        const fileContent = await s3
          .getObject({ Bucket: config.s3.bucket, Key: outFile })
          .promise()
          .catch((error) => console.log(JSON.stringify(error)));

        const fileContentString = String.fromCharCode.apply(
          null,
          fileContent.Body
        );
        const fileContentJson = JSON.parse(fileContentString);

        // 3. Add it to the list
        const tmpSensorData = getOrCreateSensorData(tmpSensors, sensorName);
        tmpSensorData.data.push(...fileContentJson.content);
      });
    },
  },
  async mounted() {
    // Get sensor data
    await this.getSensors();
  },
};
</script>

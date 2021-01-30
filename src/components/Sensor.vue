<template>
  <div id="sensor">
    <D3LineChart
      :config="updateConfig.config"
      :datum="data"
      :title="name"
      :source="name"
    ></D3LineChart>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import { D3LineChart } from "vue-d3-charts";
AWS.config.update(config.s3);

export default {
  name: "Sensor",
  props: ["name", "data"],
  components: {
    D3LineChart,
  },
  computed: {
    updateConfig() {
      const config =  {
        date: {
          key: "time",
          inputFormat: "%Y%d%m%H%M%S",
          outputFormat: "%m/%d/%H:%M:%S",
        },
        color: {
          scheme: "schemeSet1",
        },
        axis: {
          yFormat: ".0f",
          yTicks: 10,
          xTicks: 4,
        },
        points: { visibleSize: 4 },
      }
  
      // Retrieve the instances of sensors
      // present in the data
      if (this.data && this.data[0]) {
        const keys = Object.keys(this.data[0]);
        const index = keys.indexOf("time");
        if (index > -1) {
          keys.splice(index, 1);
        }
        config.values = [...keys];
        
      }
      return {config:config}
    },
  },
};
</script>

<template>
  <div id="data">
    <D3LineChart
      :config="getConfig.config1"
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

var config1 = {
  values: ["a4c138a8554e", "a4c138ab5905", "a4c138cc430d", "a4c138c70dad"],
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
  tooltip: {
    labels: ["a4c138a8554e", "a4c138ab5905", "a4c138cc430d", "a4c138c70dad"],
  },
  points: { visibleSize: 4 },
};

export default {
  name: "Data",
  props: ["name", "data", "sensors"],
  components: {
    D3LineChart,
  },
  data: function () {
    return {
      config1: config1,
    };
  },
  computed: {
    getConfig() {
      //config1.values = [...this.sensors];
      return {
        config1: config1,
      };
    },
  },
};
</script>

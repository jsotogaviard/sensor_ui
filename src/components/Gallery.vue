<template>
  <div id="gallery">
    <Albums v-bind:albums="computeData.albums"></Albums>
    <Images v-bind:images="computeData.images"></Images>
  </div>
</template>

<script>
import config from "../../config";
import AWS from "aws-sdk";
import Images from "./Images.vue";
import Albums from "./Albums.vue";

AWS.config.update(config.s3);
var s3 = new AWS.S3();

var albums = [];
var images = [];
export default {
  name: "Gallery",
  components: {
    Images,
    Albums,
  },
  data() {
    return {
      albums: albums,
      images: images,
    };
  },
  computed: {
    computeData() {
      // Empty objects
      albums.length = 0;
      images.length = 0;

      var album = "";
      if (this.$route.params.pathMatch) {
        album = this.$route.params.pathMatch;
        if (album.substr(album.length - 1, 1) !== "/") {
          album = album + "/";
        }
      }
      var params = {
        Bucket: config.s3.bucket,
        Prefix: album,
        Delimiter: "/",
      };

      s3.listObjects(params, function (err, data) {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          console.log(JSON.stringify(data));

          // Retrieve folders
          for (var i in data.CommonPrefixes) {
            var name = data.CommonPrefixes[i].Prefix;
            albums.push(name);
          }

          // Retrieve files
          for (var j in data.Contents) {
            var image = config.s3.url + data.Contents[j].Key;
            images.push(image);
          }
        }
      });
      return {
        albums: albums,
        images: images,
      };
    },
  },
};
</script>

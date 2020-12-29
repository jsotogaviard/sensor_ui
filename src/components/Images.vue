<template>
  <div>
    <img class="image" v-for="(image, i) in images" :src="image" :key="i" @click="index = i">
    <vue-gallery-slideshow :images="computeData.images" :index="index" @close="index = null"/>
     <div v-for="(album, i) in computeData.albums" v-bind:key="i">
       <button @click="$router.push(album.name)">{{album.name}} _ {{i}} {{$route.params}}</button>
    </div>    
  </div>
</template>

<script>
import VueGallerySlideshow from 'vue-gallery-slideshow';
import config from '../../config';
import AWS from 'aws-sdk';

AWS.config.update(config.s3);
var s3 = new AWS.S3();

var albums=[],images = [];
export default {
  name: 'Bar',
  components: {
    VueGallerySlideshow,
  },
  data() { 
      return {
          albums:albums,
          images:images,
          index: null,
      }
  },
  computed: {
    computeData() {
      console.log(this.$route.params)
      var album='';
      if(this.$route.params.id){
        album = this.$route.params.id
        if (album.substr(album.length - 1, 1) !== '/') {
    album = album + '/';
  }
      }
      var params = {
    Bucket: config.s3.bucket,
     Prefix: album,
    Delimiter: '/'
  };
    
      s3.listObjects(params, function (err, data) {
        if (err) {
          console.log(JSON.stringify(err))
        } else {
          console.log(JSON.stringify(data))
          for (var i in data.CommonPrefixes) {
            var prefix = data.CommonPrefixes[i].Prefix;
            var name = prefix
            var album = {
              'prefix': prefix,
              'name': name
            }
            albums.push(album);
          }
          for (var j in data.Contents) {
              var image = "http://sotochassaignetest.s3-website.us-east-2.amazonaws.com/"+data.Contents[j].Key
            images.push(image);
          }
        }
      });
      return {
        albums:albums,
        images:images
      };
    }
}
}

</script>


<style>
.image {
  width: 100px;
  height: 100px;
  background-size: cover;
  cursor: pointer;
  margin: 5px;
  border-radius: 3px;
  border: 1px solid lightgray;
  object-fit: contain;
}
</style>

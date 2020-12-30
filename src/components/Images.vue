<template>
  <div id=image>
    <div class="imagecss">IMAGES</div>
    <img
      class="image"
      v-for="(image, i) in images"
      :src="image"
      :key="i"
      @click="index = i"
    />
    <vue-gallery-slideshow
      :images="images"
      :index="index"
      @close="index = null"
    />
  </div>
</template>

<script>
import VueGallerySlideshow from "vue-gallery-slideshow";
export default {
  name: "Images",
  components: {
    VueGallerySlideshow,
  },
  props: ['images'],
  data() {
    return {
      index: null,
    };
  }
};
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
.imagecss {
  color: #060354;
  font-family: "Raleway", sans-serif;
  font-size: 62px;
  font-weight: 800;
  line-height: 72px;
  margin: 0 0 24px;
  text-transform: uppercase;
}
</style>

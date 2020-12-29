<template>
  <div id="albums">
    <div>ALBUMS</div>
    <img
      class="image"
      v-for="(album, i) in albums"
      :src="album"
      :key="i"
      @click="goTo(album)"
    />
  </div>
</template>

<script>
export default {
  name: "Albums",
  props: ['albums'],
  methods: { 
    goTo (name) { 
      console.log(name)
      this.$router.replace({name}); 
    } 
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
</style>

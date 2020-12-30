<template>
  <div id="albums">
    <div class="album">ALBUMS</div>
    <a class="folder" @click="goUp()">
      <font-awesome-icon :icon="['fas', 'folder']" />
      ..
    </a>
    <br />
    <a
      class="folder"
      v-for="(album, i) in albums"
      :key="i"
      @click="goTo(album)"
    >
      <font-awesome-icon :icon="['fas', 'folder']" />
      {{ album }}
      <br />
    </a>
  </div>
</template>

<script>
export default {
  name: "Albums",
  props: ["albums"],
  methods: {
    goTo(name) {
      this.$router.replace("/" + name);
    },
    goUp() {
      var currentRoute = this.$router.currentRoute.fullPath;
      if (currentRoute.substr(0, 1) == "/") {
        currentRoute = currentRoute.substr(1, currentRoute.length);
      }
      if (currentRoute.substr(currentRoute.length-1, 1) == "/") {
        currentRoute = currentRoute.substr(0, currentRoute.length - 1);
      }
      var split = currentRoute.split("/");
      if (split.length > 1) {
        split = split.slice(0, split.length - 1).join("/");
      } else {
        split = "";
      }
      console.log(split);
      this.$router.replace("/" + split);
    },
  },
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
.folder {
  font-size: 18px;
  color: blue;
  cursor: pointer;
}
.album {
  color: #060354;
  font-family: "Raleway", sans-serif;
  font-size: 62px;
  font-weight: 800;
  line-height: 72px;
  margin: 0 0 24px;
  text-transform: uppercase;
}
</style>

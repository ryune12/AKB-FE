<template>
  <v-app>
    <v-main class="grey lighten-4 fullheight pa-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  mounted() {
    // window.onbeforeunload = function () {
    //   var storage = window.localStorage;
    //   storage.clear();
    // };
  },
};
</script>

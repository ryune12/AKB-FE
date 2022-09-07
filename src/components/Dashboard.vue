<template>
  <v-main>
    <div class="d-flex justify-center mb-6">
      <v-btn
        color="#B71C1C"
        class="mx-5"
        link
        tag="router-link"
        to="/pendapatan"
        dark
      >
        Pendapatan</v-btn
      >
      <v-btn
        color="#B71C1C"
        class="mx-5"
        dark
        link
        tag="router-link"
        to="/pengeluaran"
      >
        Pengeluaran</v-btn
      >
      <v-btn
        color="#B71C1C"
        class="mx-5"
        dark
        link
        tag="router-link"
        to="/penjualan"
      >
        Penjualan</v-btn
      >
      <v-btn
        color="#B71C1C"
        class="mx-5"
        dark
        link
        tag="router-link"
        to="/stok"
      >
        Stok Bahan</v-btn
      >
    </div>

    <div class="ma-5">
      <router-view></router-view>
    </div>
  </v-main>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
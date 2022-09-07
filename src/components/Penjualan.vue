<template>
  <div>
    <!-- Data Table -->
    <v-row>
      <v-col
        ><v-card
          ><v-card-title class="mb-5">
            Penjualan Item Menu <v-spacer></v-spacer>
            <v-btn
              color="#B71C1C"
              class="mx-5"
              @click="modalFilter = true"
              dark
            >
              Filter</v-btn
            >
            <v-btn color="#B71C1C" class="mx-5" dark @click="print">
              Print</v-btn
            >
          </v-card-title>
          <v-card-subtitle
            >Tahun : {{ tahun }} <br />Bulan : {{ bulan }}</v-card-subtitle
          >
          <v-card-text>
            <Barchart :height="100" :chart-data="itemData" />
          </v-card-text> </v-card
      ></v-col>
    </v-row>

    <v-dialog
      transition="dialog-top-transition"
      v-model="modalFilter"
      max-width="600"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="#B71C1C" dark> Filter Tahunan</v-toolbar>
          <v-card-text>
            <v-row>
              <v-col
                ><v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="from_in"
                      label="Tahun"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="#B71C1C"
                    v-model="from_in"
                    type="month"
                    @input="menu2 = false"
                  ></v-date-picker> </v-menu
              ></v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
            <v-btn text @click="filterTahunan()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </div>
</template>
<style scoped>
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
}
a {
  text-decoration: none;
}
</style>
<script>
import Barchart from "../assets/Barchart.js";

export default {
  name: "List",
  components: {
    Barchart,
  },
  data() {
    return {
      date: "",
      load: true,
      snackbar: false,
      error_message: "",
      color: "",
      menu1: false,
      menu2: false,
      menu3: false,
      colorGreen: "#26A69A",
      colorRed: "#B71C1C",
      colorGrey: "#607D8B",
      modalBulanan: false,
      modalFilter: false,

      itemData: {},

      penjualan_harian_tertinggi: [],
      total_penjualan: [],

      reservasi: new FormData(),
      nama_menu: [],
      tahun: "",
      bulan: "ALL",
      from: "",
      to: "",
      from_in: "",
      to_in: "",
    };
  },
  methods: {
    print() {
      var WinPrint = window.open(
        "http://127.0.0.1:8000/penjualan-item/" +
          this.tahun +
          "/" +
          this.bulan +
          "/" +
          sessionStorage.getItem("id"),
        "_blank"
      );
      WinPrint.focus();
      setTimeout(function () {
        WinPrint.print();
      }, 500);
      window.onfocus = function () {
        setTimeout(function () {
          WinPrint.close();
        }, 500);
      };
    },
    filterTahunan() {
      //   if (this.date == "") this.date = new Date().getFullYear();
      var res = this.from_in.substring(0, 4);
      var res1 = this.from_in.substring(5, 7);
      this.nama_menu = [];
      this.penjualan_harian_tertinggi = [];
      this.total_penjualan = [];
      this.get_penjualan_item(res, res1);
      this.modalFilter = false;
    },
    readData() {
      this.get_penjualan_item();
    },

    get_penjualan_item(tahun = null, bulan = null) {
      if (tahun == null) tahun = new Date().getFullYear();
      if (bulan == null) bulan = "ALL";
      var url = this.$api + "/penjualan-item/" + tahun + "/" + bulan;
      this.get(url, "penjualan_item");
    },
    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          switch (data) {
            case "penjualan_item":
              this.penjualan_item = response.data.data;
              this.tahun = response.data.tahun;
              this.bulan = response.data.bulan;

              for (let i = 0; i < this.penjualan_item.length; i++) {
                this.nama_menu.push(this.penjualan_item[i].nama_menu);
                this.penjualan_harian_tertinggi.push(
                  this.penjualan_item[i].penjualan_harian_tertinggi
                );
                this.total_penjualan.push(
                  this.penjualan_item[i].total_penjualan
                );
              }
              this.itemData = {
                labels: this.nama_menu,
                datasets: [
                  {
                    label: "Penjualan Harian Tertinggi",
                    backgroundColor: "#f87979",
                    data: this.penjualan_harian_tertinggi,
                  },
                  {
                    label: "Total Penjualan",
                    backgroundColor: this.colorGreen,
                    data: this.total_penjualan,
                  },
                ],
              };
              break;
            default:
          }
          console.log(this.penjualan_bulanan);
          this.load = false;
        })
        .catch((error) => {
          console.log(error);
          if (data == "reservasi") {
            this.error_message = error.response.data.message;
          }
          this.color = "red";
          this.snackbar = true;
        });
    },
    close() {
      this.dialog = false;
      this.dialogRequest = false;
      this.inputType = "Tambah";
    },

    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>
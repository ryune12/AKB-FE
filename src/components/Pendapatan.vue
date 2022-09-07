<template>
  <div>
    <v-card class="mt-5"
      ><v-card-title class="mb-5">
        Pendapatan Bulanan <v-spacer></v-spacer>
        <v-btn color="#B71C1C" class="mx-5" @click="modalBulanan = true" dark>
          Filter</v-btn
        >
        <v-btn color="#B71C1C" class="mx-5" dark @click="print_bulanan">
          Print</v-btn
        >
      </v-card-title>
      <v-card-subtitle>Tahun : {{ tahun }}</v-card-subtitle>
      <v-card-text>
        <Barchart :height="100" :chart-data="bulananData" />
      </v-card-text>
    </v-card>
    <v-card class="mt-5"
      ><v-card-title class="mb-5">
        Pendapatan Tahunan <v-spacer></v-spacer>
        <v-btn color="#B71C1C" class="mx-5" dark @click="modalTahunan = true">
          Filter</v-btn
        >
        <v-btn color="#B71C1C" class="mx-5" dark @click="print_tahunan()">
          Print</v-btn
        >
      </v-card-title>
      <v-card-subtitle>Tahun : {{ from }} s/d {{ to }}</v-card-subtitle>
      <v-card-text>
        <Barchart :height="100" :chart-data="tahunanData" />
      </v-card-text>
    </v-card>
    <v-dialog
      transition="dialog-top-transition"
      v-model="modalBulanan"
      max-width="600"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="#B71C1C" dark> Filter Bulanan</v-toolbar>
          <v-card-text>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Tahun"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                color="#B71C1C"
                v-model="date"
                type="month"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
            <v-btn text @click="filterBulanan()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      v-model="modalTahunan"
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
              <v-col>
                <v-menu
                  v-model="menu3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="to_in"
                      label="Tahun"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="#B71C1C"
                    v-model="to_in"
                    type="month"
                    @input="menu3 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
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
      modalTahunan: false,

      bulananData: {},
      tahunanData: {},

      labels_tahunan: [],
      labels_bulanan: [],

      reservasi: new FormData(),
      makanan_bulanan: [],
      makanan_tahunan: [],
      sidedish_bulanan: [],
      sidedish_tahunan: [],
      minuman_bulanan: [],
      minuman_tahunan: [],
      pendapatan_bulanan: [],
      pendapatan_tahunan: [],

      tahun: "",
      from: "",
      to: "",
      from_in: "",
      to_in: "",
    };
  },
  methods: {
    print_tahunan() {
      var WinPrint = window.open(
        "http://127.0.0.1:8000/pendapatan-tahunan/" +
          this.from +
          "/" +
          this.to +
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
    print_bulanan() {
      var WinPrint = window.open(
        "http://127.0.0.1:8000/pendapatan-bulanan/" +
          this.tahun +
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
    filterBulanan() {
      //   if (this.date == "") this.date = new Date().getFullYear();
      var res = this.date.substring(0, 4);
      this.labels_bulanan = [];
      this.makanan_bulanan = [];
      this.sidedish_bulanan = [];
      this.minuman_bulanan = [];
      console.log(this.labels_bulanan);
      this.get_pendapatan_bulanan(res);
      this.modalBulanan = false;
    },
    filterTahunan() {
      //   if (this.date == "") this.date = new Date().getFullYear();
      var res = this.from_in.substring(0, 4);
      var res1 = this.to_in.substring(0, 4);
      this.labels_tahunan = [];
      this.makanan_tahunan = [];
      this.sidedish_tahunan = [];
      this.minuman_tahunan = [];
      this.get_pendapatan_tahunan(res, res1);
      this.modalTahunan = false;
    },
    readData() {
      this.get_pendapatan_bulanan();
      this.get_pendapatan_tahunan();
    },

    get_pendapatan_bulanan(tahun = null) {
      if (tahun == null) tahun = new Date().getFullYear();
      var url = this.$api + "/pendapatan-bulanan/" + tahun;
      this.get(url, "pendapatan_bulanan");
    },
    get_pendapatan_tahunan(from = null, to = null) {
      if (from == null) from = new Date().getFullYear() - 3;
      if (to == null) to = new Date().getFullYear();
      var url = this.$api + "/pendapatan-tahunan/" + from + "/" + to;
      this.get(url, "pendapatan_tahunan");
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
            case "pendapatan_bulanan":
              this.pendapatan_bulanan = response.data.data;
              this.tahun = response.data.tahun;

              for (let i = 0; i < this.pendapatan_bulanan.length; i++) {
                this.labels_bulanan.push(this.pendapatan_bulanan[i].Bulan);
                this.makanan_bulanan.push(this.pendapatan_bulanan[i].Makanan);
                this.sidedish_bulanan.push(this.pendapatan_bulanan[i].Sidedish);
                this.minuman_bulanan.push(this.pendapatan_bulanan[i].Minuman);
              }
              this.bulananData = {
                labels: this.labels_bulanan,
                datasets: [
                  {
                    label: "Makanan",
                    backgroundColor: "#f87979",
                    data: this.makanan_bulanan,
                  },
                  {
                    label: "Side Dish",
                    backgroundColor: this.colorGreen,
                    data: this.sidedish_bulanan,
                  },
                  {
                    label: "Minuman",
                    backgroundColor: "#03a5fc",
                    data: this.minuman_bulanan,
                  },
                ],
              };
              break;
            case "pendapatan_tahunan":
              this.pendapatan_tahunan = response.data.data;
              this.from = response.data.from;
              this.to = response.data.to;
              for (let i = 0; i < this.pendapatan_tahunan.length; i++) {
                this.labels_tahunan.push(this.pendapatan_tahunan[i].Tahun);
                this.makanan_tahunan.push(this.pendapatan_tahunan[i].Makanan);
                this.sidedish_tahunan.push(this.pendapatan_tahunan[i].Sidedish);
                this.minuman_tahunan.push(this.pendapatan_tahunan[i].Minuman);
              }
              this.tahunanData = {
                labels: this.labels_tahunan,
                datasets: [
                  {
                    label: "Makanan",
                    backgroundColor: "#f87979",
                    data: this.makanan_tahunan,
                  },
                  {
                    label: "Side Dish",
                    backgroundColor: this.colorGreen,
                    data: this.sidedish_tahunan,
                  },
                  {
                    label: "Minuman",
                    backgroundColor: "#03a5fc",
                    data: this.minuman_tahunan,
                  },
                ],
              };
              break;
            default:
          }
          console.log(this.pendapatan_bulanan);
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
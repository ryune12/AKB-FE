<template>
  <v-main class="list">
    <!-- Data Table -->
    <v-card>
      <v-tabs fixed-tabs color="#B71C1C">
        <v-tab>Pendapatan </v-tab>
        <v-tab>Pengeluaran </v-tab>
        <v-tab>Stok </v-tab>
        <v-tab>Penjualan</v-tab>
        <v-divider></v-divider>
        <v-tab-item>
          <v-divider></v-divider>
          <v-tabs fixed-tabs color="#B71C1C">
            <v-tab>Bulanan</v-tab>
            <v-tab>Tahunan</v-tab>
            <v-tab-item>
              <v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_pendapatan_bulanan"
                  :items="pendapatan_bulanan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ pendapatan_bulanan.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.Makanan`]="{ item }">
                    Rp {{ formatPrice(item.Makanan) }}
                  </template>
                  <template v-slot:[`item.SideDish`]="{ item }">
                    Rp {{ formatPrice(item.SideDish) }}
                  </template>
                  <template v-slot:[`item.Minuman`]="{ item }">
                    Rp {{ formatPrice(item.Minuman) }}
                  </template>
                  <template v-slot:[`item.TotalPendapatan`]="{ item }">
                    Rp {{ formatPrice(item.TotalPendapatan) }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
            <v-tab-item
              ><v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_pendapatan_tahunan"
                  :items="pendapatan_tahunan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ pendapatan_tahunan.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.Makanan`]="{ item }">
                    Rp {{ formatPrice(item.Makanan) }}
                  </template>
                  <template v-slot:[`item.SideDish`]="{ item }">
                    Rp {{ formatPrice(item.SideDish) }}
                  </template>
                  <template v-slot:[`item.Minuman`]="{ item }">
                    Rp {{ formatPrice(item.Minuman) }}
                  </template>
                  <template v-slot:[`item.TotalPendapatan`]="{ item }">
                    Rp {{ formatPrice(item.TotalPendapatan) }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
          </v-tabs>
        </v-tab-item>
        <v-tab-item
          ><v-tabs fixed-tabs color="#B71C1C">
            <v-tab>Bulanan</v-tab>
            <v-tab>Tahunan</v-tab>
            <v-tab-item>
              <v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_pengeluaran_bulanan"
                  :items="pengeluaran_bulanan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ pengeluaran_bulanan.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.Makanan`]="{ item }">
                    Rp {{ formatPrice(item.Makanan) }}
                  </template>
                  <template v-slot:[`item.SideDish`]="{ item }">
                    Rp {{ formatPrice(item.SideDish) }}
                  </template>
                  <template v-slot:[`item.Minuman`]="{ item }">
                    Rp {{ formatPrice(item.Minuman) }}
                  </template>
                  <template v-slot:[`item.TotalPengeluaran`]="{ item }">
                    Rp {{ formatPrice(item.TotalPengeluaran) }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
            <v-tab-item
              ><v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_pengeluaran_tahunan"
                  :items="pengeluaran_tahunan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ pengeluaran_tahunan.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.Makanan`]="{ item }">
                    Rp {{ formatPrice(item.Makanan) }}
                  </template>
                  <template v-slot:[`item.SideDish`]="{ item }">
                    Rp {{ formatPrice(item.SideDish) }}
                  </template>
                  <template v-slot:[`item.Minuman`]="{ item }">
                    Rp {{ formatPrice(item.Minuman) }}
                  </template>
                  <template v-slot:[`item.TotalPengeluaran`]="{ item }">
                    Rp {{ formatPrice(item.TotalPengeluaran) }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
          </v-tabs>
        </v-tab-item>
        <v-tab-item
          ><v-tabs fixed-tabs color="#B71C1C">
            <v-tab>Bulanan</v-tab>
            <v-tab>Tahunan</v-tab>
            <v-tab-item>
              <v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_stok_bulanan"
                  :items="stok_bulanan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ stok_bulanan.indexOf(item) + 1 }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
            <v-tab-item
              ><v-divider></v-divider>
              <v-card flat class="mx-5 pa-9">
                <v-data-table
                  :loading="load"
                  :items-per-page="12"
                  :headers="header_stok_tahunan"
                  :items="stok_tahunan"
                >
                  <template v-slot:[`item.no`]="{ item }">
                    {{ stok_tahunan.indexOf(item) + 1 }}
                  </template>
                  <template v-slot:[`item.Makanan`]="{ item }">
                    Rp {{ formatPrice(item.Makanan) }}
                  </template>
                  <template v-slot:[`item.SideDish`]="{ item }">
                    Rp {{ formatPrice(item.SideDish) }}
                  </template>
                  <template v-slot:[`item.Minuman`]="{ item }">
                    Rp {{ formatPrice(item.Minuman) }}
                  </template>
                  <template v-slot:[`item.Totalstok`]="{ item }">
                    Rp {{ formatPrice(item.Totalstok) }}
                  </template>
                </v-data-table>
              </v-card></v-tab-item
            >
          </v-tabs>
        </v-tab-item>
        <v-tab-item>
          <v-card flat class="mx-5 pa-9">
            <div class="d-flex">
              <div cols="12" sm="3" class="ml-5">
                <v-menu
                  ref="menu"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="143"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div class="d-flex">
                      <v-text class="mt-3 mr-3">Tahun Bulan</v-text>
                      <v-text-field
                        v-model="date"
                        append-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        outlined
                        v-on="on"
                        dense
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker type="month" v-model="date" color="#B71C1C">
                    <v-spacer></v-spacer>
                    <v-btn text color="#B71C1C" @click="get_penjualan()">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
              <v-spacer></v-spacer>
              <div class="d-flex justify-end">
                <v-btn color="#B71C1C" dark @click="dialog = true"
                  ><v-icon class="mr-3">mdi-printer</v-icon> Print</v-btn
                >
              </div>
            </div>
            <v-data-table
              :loading="load"
              :items-per-page="12"
              :headers="header_penjualan"
              :items="penjualan"
            >
              <template v-slot:[`item.no`]="{ item }">
                {{ penjualan.indexOf(item) + 1 }}
              </template>
            </v-data-table>
          </v-card></v-tab-item
        >
      </v-tabs>
    </v-card>
    <v-dialog v-model="dialogEdit" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Ubah Status</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin mengubah status pesanan ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="colorRed" text @click="dialogEdit = false">
            Cancel
          </v-btn>
          <v-btn :color="colorRed" text @click="update()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
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
export default {
  name: "List",
  data() {
    return {
      date: "",
      load: true,
      snackbar: false,
      queueslength: 0,
      readylength: 0,
      error_message: "",
      color: "",
      colorGreen: "#26A69A",
      colorRed: "#B71C1C",
      colorGrey: "#607D8B",
      dialog: false,
      dialogConfirm: false,
      dialogEdit: false,
      valid: true,
      e6: 1,
      emailRules: "",
      noHpRules: "",
      statusRules: "",
      queues: [],
      qrID: "",
      namaCustRules: "",
      dialogQR: false,
      menu2: false,
      header_pendapatan_bulanan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Bulan", value: "Bulan" },
        { text: "Makanan", value: "Makanan" },
        { text: "SideDish", value: "SideDish" },
        { text: "Minuman", value: "Minuman" },
        { text: "Total Pendapatan", value: "TotalPendapatan" },
      ],
      header_pendapatan_tahunan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Tahun", value: "Tahun" },
        { text: "Makanan", value: "Makanan" },
        { text: "SideDish", value: "SideDish" },
        { text: "Minuman", value: "Minuman" },
        { text: "Total Pendapatan", value: "TotalPendapatan" },
      ],
      header_pengeluaran_bulanan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Bulan", value: "Bulan" },
        { text: "Makanan", value: "Makanan" },
        { text: "SideDish", value: "SideDish" },
        { text: "Minuman", value: "Minuman" },
        { text: "Total Pengeluaran", value: "TotalPengeluaran" },
      ],
      header_pengeluaran_tahunan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Tahun", value: "Tahun" },
        { text: "Makanan", value: "Makanan" },
        { text: "SideDish", value: "SideDish" },
        { text: "Minuman", value: "Minuman" },
        { text: "Total Pengeluaran", value: "TotalPengeluaran" },
      ],
      header_stok_bulanan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Date", value: "Date" },
        { text: "Unit", value: "Date" },
        { text: "Incoming Stock", value: "Incoming" },
        { text: "Remaining Stock", value: "Remaining" },
        { text: "Waste Stock", value: "Remaining" },
      ],
      header_stok_tahunan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Date", value: "Date" },
        { text: "Unit", value: "Date" },
        { text: "Incoming Stock", value: "Incoming" },
        { text: "Remaining Stock", value: "Remaining" },
        { text: "Waste Stock", value: "Remaining" },
      ],
      header_penjualan: [
        {
          text: "No.",
          align: "start",
          sortable: true,
          value: "no",
        },
        { text: "Item Menu", value: "nama_menu" },
        { text: "Unit", value: "unit" },
        {
          text: "Penjualan Harian Tertiggi",
          value: "penjualan_harian_tertinggi",
        },
        { text: "Total Penjualan", value: "total_penjualan" },
      ],

      reservasi: new FormData(),
      form: {
        id: null,
        stat: null,
      },
      pendapatan_bulanan: [],
      pendapatan_tahunan: [],
      pengeluaran_bulanan: [],
      pengeluaran_tahunan: [],
      stok_bulanan: [],
      stok_tahunan: [],
      penjualan: [],

      menu3: false,
      statFilter: true,
      statEdit: "",
    };
  },
  methods: {
    //read data reservasi
    readData() {
      this.get_pendapatan_bulanan();
      this.get_pendapatan_tahunan();

      this.get_pengeluaran_bulanan();
      this.get_pengeluaran_tahunan();

      this.get_stok_bulanan();
      this.get_stok_tahunan();
      this.get_penjualan();
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
    get_pengeluaran_bulanan(tahun = null) {
      if (tahun == null) tahun = new Date().getFullYear();
      var url = this.$api + "/pengeluaran-bulanan/" + tahun;
      this.get(url, "pengeluaran_bulanan");
    },
    get_pengeluaran_tahunan(from = null, to = null) {
      if (from == null) from = new Date().getFullYear() - 3;
      if (to == null) to = new Date().getFullYear();
      var url = this.$api + "/pengeluaran-tahunan/" + from + "/" + to;
      this.get(url, "pengeluaran_tahunan");
    },
    get_stok_bulanan(bulan = null) {
      if (bulan == null) bulan = new Date().getMonth();
      var url = this.$api + "/stok-bulanan/" + bulan;
      this.get(url, "stok_bulanan");
    },
    get_stok_tahunan(from = null, to = null) {
      if (from == null) from = new Date().getFullYear() - 3;
      if (to == null) to = new Date().getFullYear();
      var url = this.$api + "/stok-tahunan/" + from + "/" + to;
      this.get(url, "stok_tahunan");
    },

    get_penjualan() {
      var url = this.$api + "/penjualan/" + encodeURIComponent(this.date);
      this.get(url, "penjualan");
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
              break;
            case "pendapatan_tahunan":
              this.pendapatan_tahunan = response.data.data;
              break;
            case "pengeluaran_bulanan":
              this.pengeluaran_bulanan = response.data.data;
              break;
            case "pengeluaran_tahunan":
              this.pengeluaran_tahunan = response.data.data;
              break;
            case "stok_bulanan":
              this.stok_bulanan = response.data.data;
              break;
            case "stok_tahunan":
              this.stok_tahunan = response.data.data;
              break;
            case "penjualan":
              this.penjualan = response.data.data;
              break;
            default:
          }
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

    filtered() {
      return this.orders.filter((main) => {
        return main.tanggal_reservasi
          .toLowerCase()
          .match(this.date.toLowerCase());
      });
    },

    close() {
      this.dialog = false;
      this.dialogRequest = false;
      this.inputType = "Tambah";
    },

    editHandler(item) {
      this.form.id = item.id;
      this.form.stat = item.status_pesanan;
      this.dialogEdit = true;
    },

    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogEdit = false;
      this.inputType = "Tambah";
    },

    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    resetForm() {
      this.form = {
        id: null,
        stat: null,
      };
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
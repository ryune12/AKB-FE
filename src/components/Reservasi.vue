<template>
  <v-main class="list">
    <div class="d-flex">
      <div cols="12" sm="3">
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
              <v-text class="mt-3 mr-3">Tanggal Reservasi</v-text>
              <v-text-field
                v-model="date"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                filled
                v-on="on"
                dense
              ></v-text-field>
            </div>
          </template>
          <v-date-picker v-model="date" color="#B71C1C">
            <v-spacer></v-spacer>
            <v-btn text color="#B71C1C" @click="noFilter()"> No Filter </v-btn>
            <v-btn text color="#B71C1C" @click="getReservasi()"> OK </v-btn>
          </v-date-picker>
        </v-menu>
      </div>

      <v-spacer></v-spacer>
      <div class="d-flex justify-end">
        <router-link to="/reservasi/tambah">
          <v-btn color="#B71C1C" dark @click="dialog = true">
            Tambah Reservasi</v-btn
          >
        </router-link>
      </div>
    </div>
    <!-- Data Table -->
    <v-card>
      <v-data-table :loading="load" :headers="headers" :items="reservasis">
        <template v-slot:[`item.sesi`]="{ item }">
          <div v-if="item.sesi == 1">
            <v-chip
              :ripple="false"
              small
              color="orange accent-4 yellow--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <v-icon class="mr-2" small>mdi-weather-sunny</v-icon>
                <span>Lunch</span>
              </div>
            </v-chip>
          </div>
          <div v-if="item.sesi == 2">
            <v-chip
              :ripple="false"
              small
              color="black yellow--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <v-icon class="mr-2" small>mdi-moon-waning-crescent</v-icon>
                <span>Dinner</span>
              </div>
            </v-chip>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == 'Completed'">
            <v-chip
              :ripple="false"
              small
              color="green accent-4 white--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <span>{{ item.status }}</span>
              </div>
            </v-chip>
          </div>
          <div v-else-if="item.deleted_at != null">
            <v-chip
              :ripple="false"
              small
              color="grey accent-4 white--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <span>Canceled</span>
              </div>
            </v-chip>
          </div>
          <div v-else-if="item.status == 'Reserved'">
            <v-chip
              :ripple="false"
              small
              color="blue accent-4 white--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <span>{{ item.status }}</span>
              </div>
            </v-chip>
          </div>
          <div v-else-if="item.status == 'Pending'">
            <v-chip
              :ripple="false"
              small
              color="yellow accent-4 white--text"
              style="width: 90px"
            >
              <div class="d-flex flex-row">
                <span>{{ item.status }}</span>
              </div>
            </v-chip>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="
                  item.status == 'Completed' || item.deleted_at != null
                "
                v-bind="attrs"
                v-on="on"
                icon
                dark
                class="mr-2 rounded-circle grey--text"
                @click="getQR(item.id)"
              >
                <i class="fa fa-qrcode" aria-hidden="true"></i>
              </v-btn>
            </template>
            <span>Cetak Qr</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="item.status != 'Pending' || item.deleted_at != null"
                v-bind="attrs"
                v-on="on"
                icon
                dark
                class="mr-2 rounded-circle blue--text"
                :to="{ path: '/reservasi/edit/' + item.id }"
              >
                <i class="fas fa-pencil"></i>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="item.status != 'Pending' || item.deleted_at != null"
                v-bind="attrs"
                v-on="on"
                icon
                dark
                class="mr-2 rounded-circle red--text"
              >
                <i class="fas fa-ban" @click="deleteHandler(item)"></i>
              </v-btn>
            </template>
            <span>Cancel</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <!-- Dialog QRCODE -->
    <v-dialog v-model="dialogQR" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">QR Code</span>
        </v-card-title>
        <v-card-text>
          <v-img
            class="ma-10"
            :src="'http://127.0.0.1:8000/qrcode' + qrID + '.svg'"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogQR = false">
            Cancel
          </v-btn>
          <v-btn
            class="mr-3 mb-2 white--text"
            color="#B71C1C"
            @click="printDetails()"
          >
            <v-icon class="mr-1">mdi-printer</v-icon> Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Delete -->
    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus produk ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            No
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Yes </v-btn>
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
      date: new Date().toISOString().substr(0, 10),
      inputType: "Tambah",
      load: true,
      snackbar: false,
      error_message: "",
      color: "",
      dialog: false,
      dialogConfirm: false,
      valid: true,
      e6: 1,
      emailRules: "",
      noHpRules: "",
      qrID: "",
      namaCustRules: "",
      dialogQR: false,
      headers: [
        {
          text: "ID reservasi",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Nomor Meja", value: "nomor_meja" },
        { text: "Tanggal reservasi", value: "tanggal_reservasi" },
        { text: "Sesi", value: "sesi" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ],
      reservasi: new FormData(),
      form: {
        namaCust: null,
        no_hpCust: null,
      },
      reservasis: [],
      menu2: false,
      statFilter: true,
      deleteId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data reservasi
    readData() {
      this.getReservasi();
    },

    getQR(id) {
      console.log(id);
      this.qrID = id;
      var url = this.$api + "/qrcode/" + id;
      this.get(url, "qrcode");
    },
    getReservasi() {
      var url = this.$api + "/Reservasi";
      this.get(url, "reservasi");
    },

    filtered() {
      return this.reservasis.filter((main) => {
        return main.tanggal_reservasi
          .toLowerCase()
          .match(this.date.toLowerCase());
      });
    },
    filter() {
      this.reservasis = this.filtered();
      this.menu2 = false;
    },

    noFilter() {
      this.statFilter = false;
      this.getReservasi();
      this.menu2 = false;
    },

    deleteData() {
      var url = this.$api + "/Reservasi/" + this.deleteId;
      this.delete(url);
      this.dialogConfirm = false;
    },

    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "reservasi") {
            this.reservasis = response.data.data;
          } else if (data == "qrcode") {
            this.dialogQR = true;
          }
          this.load = false;
          if (this.statFilter) {
            this.filter();
          }
          this.statFilter = true;
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

    update() {
      let newData = {
        status: this.form.status,
      };
      var url = this.$api + "/Reservasi/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.dialogEdit = false;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    printDetails() {
      var WinPrint = window.open(
        "http://127.0.0.1:8000/cetak/" +
          this.qrID +
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

    delete(url) {
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";

          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_produk = item.nama_produk;
      this.form.satuan = item.satuan;
      this.form.stok = item.stok;
      this.form.harga_jual = item.harga_jual;
      this.dialogEdit = true;
    },

    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogConfirm = true;
    },

    close() {
      this.dialog = false;
      this.inputType = "Tambah";
    },

    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogEdit = false;
      this.inputType = "Tambah";
    },

    resetForm() {
      this.form = {
        nama_produk: null,
        satuan: null,
        harga_jual: null,
        stok: null,
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
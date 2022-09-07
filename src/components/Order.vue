<template>
  <v-main class="list">
    <!-- Data Table -->
    <v-card>
      <v-tabs color="#B71C1C">
        <v-tab>Order</v-tab>
        <v-tab>
          <v-chip bold class="mr-2 white--text" color="#B71C1C" filled small>
            {{ queueslength }}</v-chip
          >Queue</v-tab
        >
        <v-tab
          ><v-chip bold class="mr-2 white--text" color="#B71C1C" filled small>
            {{ readylength }} </v-chip
          >Ready</v-tab
        >
        <v-tab-item>
          <div class="d-flex">
            <div cols="12" sm="3" class="mt-5 ml-5">
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
                      outlined
                      v-on="on"
                      dense
                    ></v-text-field>
                  </div>
                </template>
                <v-date-picker v-model="date" color="#B71C1C">
                  <v-spacer></v-spacer>
                  <v-btn text color="#B71C1C" @click="noFilter()">
                    No Filter
                  </v-btn>
                  <v-btn text color="#B71C1C" @click="getOrder()"> OK </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <v-spacer></v-spacer>
          </div>
          <v-data-table :loading="load" :headers="headers" :items="orders">
            <template v-slot:[`item.status_pembayaran`]="{ item }">
              <div v-if="item.status_pembayaran == 'Lunas'">
                <v-chip
                  :ripple="false"
                  small
                  color="green accent-4 white--text"
                  style="width: 90px"
                >
                  <div class="d-flex flex-row">
                    <span>{{ item.status_pembayaran }}</span>
                  </div>
                </v-chip>
              </div>
              <div v-else>
                <v-chip
                  :ripple="false"
                  small
                  color="blue accent-4 white--text"
                  style="width: 90px"
                >
                  <div class="d-flex flex-row">
                    <span>{{ item.status_pembayaran }}</span>
                  </div>
                </v-chip>
              </div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    dark
                    class="mr-2 rounded-circle red--text"
                    :to="{ path: '/detail/' + item.id }"
                  >
                    <i class="fas fa-info"></i>
                  </v-btn>
                </template>
                <span>Detail</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-tab-item>
        <!-- Queue (Chef) -->
        <v-tab-item>
          <v-data-table :loading="load" :headers="headersQueue" :items="queues">
            <template v-slot:[`item.status_pesanan`]="{ item }">
              <div v-if="item.status_pesanan == 0">
                <v-chip
                  :ripple="false"
                  small
                  color="#B71C1C"
                  class="white--text"
                  style="width: 90px"
                >
                  <div class="d-flex flex-row">
                    <span>In Queue</span>
                  </div>
                </v-chip>
              </div>
            </template>
            <template v-slot:[`item.kuantitas`]="{ item }">
              {{ item.kuantitas }} {{ item.unit }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    dark
                    class="mr-2 rounded-circle blue--text"
                  >
                    <i class="fas fa-pencil" @click="editHandler(item)"></i>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-tab-item>

        <!-- Waiters -->
        <v-tab-item>
          <v-data-table :loading="load" :headers="headersReady" :items="ready">
            <template v-slot:[`item.status_pesanan`]="{ item }">
              <div v-if="item.status_pesanan == 1">
                <v-chip
                  :ripple="false"
                  small
                  color="green accent-4 white--text"
                >
                  <div class="d-flex flex-row">
                    <span>Ready to Serve</span>
                  </div>
                </v-chip>
              </div>
            </template>
            <template v-slot:[`item.kuantitas`]="{ item }">
              {{ item.kuantitas }} {{ item.unit }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    dark
                    class="mr-2 rounded-circle blue--text"
                  >
                    <i class="fas fa-pencil" @click="editHandler(item)"></i>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-tab-item>
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
      date: new Date().toISOString().substr(0, 10),
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
      headers: [
        {
          text: "ID Order",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Nomor Meja", value: "nomor_meja" },
        { text: "Tanggal reservasi", value: "tanggal_reservasi" },
        { text: "Status", value: "status_pembayaran" },
        { text: "Actions", value: "actions" },
      ],
      headersQueue: [
        { text: "Detail ID", align: "start", sortable: true, value: "id" },
        { text: "Nama Menu", value: "nama_menu" },
        { text: "Kuantitas", value: "kuantitas" },
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Actions", value: "actions" },
      ],
      headersReady: [
        { text: "Detail ID", align: "start", sortable: true, value: "id" },
        { text: "Nama Menu", value: "nama_menu" },
        { text: "Kuantitas", value: "kuantitas" },
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Actions", value: "actions" },
      ],
      reservasi: new FormData(),
      form: {
        id: null,
        stat: null,
      },
      orders: [],
      ready: [],
      menu2: false,
      statFilter: true,
      statEdit: "",
    };
  },
  methods: {
    //read data reservasi
    readData() {
      this.getOrder();
      this.getQueue();
      this.getReady();
    },

    getQueue() {
      var url = this.$api + "/Order/queue";
      this.get(url, "queue");
    },

    getReady() {
      var url = this.$api + "/Order/ready";
      this.get(url, "ready");
    },

    getOrder() {
      var url = this.$api + "/Order";
      this.get(url, "order");
    },

    update() {
      var url = this.$api + "/Order";
      this.load = true;
      this.$http
        .put(url, this.form, {
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

    filtered() {
      return this.orders.filter((main) => {
        return main.tanggal_reservasi
          .toLowerCase()
          .match(this.date.toLowerCase());
      });
    },
    filter() {
      this.orders = this.filtered();
      this.menu2 = false;
    },

    noFilter() {
      this.statFilter = false;
      this.getOrder();
      this.menu2 = false;
    },

    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "order") {
            this.orders = response.data.data;
            console.log(this.orders);
          } else if (data == "queue") {
            this.queues = response.data.data;
            this.queueslength = this.queues.length;
          } else if (data == "ready") {
            this.ready = response.data.data;
            this.readylength = this.ready.length;
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
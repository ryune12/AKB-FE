<template>
  <v-main class="list">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex justify-end mb-6 mx-5">
          <v-spacer></v-spacer>
          <v-btn color="#B71C1C" dark v-bind="attrs" v-on="on">
            Tambah Meja</v-btn
          >
        </div>
      </template>
      <v-card>
        <v-toolbar dark color="#B71C1C">
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }} Meja</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="setForm()"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>

        <v-card-text justify="center">
          <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
            <v-text-field
              v-model="form.no"
              :counter="3"
              label="Nomor Meja"
              :rules="mejaRules"
              type="number"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row no-gutters>
      <v-col v-for="table in mejas" :key="table.id" class="px-5 py-3 my-2">
        <v-card width="100px" height="140px">
          <!-- Ready -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card
                v-if="table.aktif != 'Active'"
                flat
                :disabled="true"
                :color="colorGrey"
              >
                <v-card-title class="white--text">
                  {{ table.nomor_meja }}
                </v-card-title>
                <v-card-subtitle class="white--text">
                  {{ table.aktif }}
                </v-card-subtitle>
              </v-card>
              <v-card
                v-bind="attrs"
                v-on="on"
                v-else-if="table.status == 'Booked'"
                flat
                @click="detailItem(table)"
                :color="colorRed"
              >
                <v-card-title class="white--text">
                  {{ table.nomor_meja }}
                </v-card-title>
                <v-card-subtitle class="white--text">
                  {{ table.status }}
                </v-card-subtitle>
              </v-card>
              <v-card
                v-else-if="table.status == 'Ready'"
                flat
                @click="detailItem(table)"
                :color="colorGreen"
              >
                <v-card-title class="white--text">
                  {{ table.nomor_meja }}
                </v-card-title>
                <v-card-subtitle class="white--text">
                  {{ table.status }}
                </v-card-subtitle>
              </v-card>
            </template>
            <span>Lihat Detail</span>
          </v-tooltip>

          <!-- Booked -->

          <!-- Non-active -->

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="table.status != 'Booked'"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle blue--text"
                  @click="editItem(table)"
                  ><i class="fas fa-pencil"></i
                ></v-btn>
              </template>
              <span>Edit Meja</span>
            </v-tooltip>
            <v-tooltip v-if="table.aktif != 'Non-active'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="table.status != 'Booked'"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle red--text"
                  @click="deleteHandler(table), (confirm = 'delete')"
                  ><i class="fas fa-trash"></i
                ></v-btn>
              </template>
              <span>Hapus Meja</span>
            </v-tooltip>
            <v-tooltip v-else bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="table.status != 'Booked'"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle green--text"
                  @click="deleteHandler(table), (confirm = 'restore')"
                  ><v-icon>mdi-backup-restore</v-icon></v-btn
                >
              </template>
              <span>Restore Meja</span>
            </v-tooltip>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialog  Detail-->
    <v-dialog v-model="dialogDetail" persistent max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">Detail Meja</span>
          <v-spacer></v-spacer>
          <v-icon class="mx-6 my-3" @click="dialogDetail = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <div class="d-flex pb-3">
          <v-card-text class="my-2 pt-0">
            <div>
              <tr>
                <td>Tanggal Reservasi</td>
                <td class="px-3 pb-1">:</td>
                <td>{{ detail.tanggal_reservasi }}</td>
              </tr>
              <tr>
                <td>Sesi</td>
                <td class="px-3 pb-1">:</td>
                <td>{{ detail.sesi }}</td>
              </tr>
              <tr>
                <td>Nama Customer</td>
                <td class="px-3 pb-1">:</td>
                <td>{{ detail.nama_customer }}</td>
              </tr>
              <tr>
                <td>Nama Karyawan</td>
                <td class="px-3 pb-1">:</td>
                <td>{{ detail.nama_karyawan }}</td>
              </tr>
              <tr>
                <td>Created</td>
                <td class="px-3 pb-1">:</td>
                <td>{{ detail.created_at }}</td>
              </tr>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Are you sure want to {{ confirm }}?
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            v-if="confirm == 'delete'"
            router
            @click="hapus(), (dialogConfirm = false)"
            color="primary"
            text
          >
            I accept
          </v-btn>
          <v-btn
            v-else
            router
            @click="restore(), (dialogConfirm = false)"
            color="primary"
            text
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      confirm: "",
      valid: "",
      dialogDetail: false,
      colorGreen: "#26A69A",
      colorRed: "#B71C1C",
      colorGrey: "#607D8B",
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      id: null,
      dialogConfirm: false,
      mejaRules: [(v) => !!v || "Meja is required"],
      statusRules: [(v) => !!v || "Status is required"],
      items: ["Ready", "Non-active"],
      headers: [
        {
          text: "ID Anggota",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Nama", value: "name" },
        { text: "Email", value: "email" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ],
      nomor: 0,
      meja: new FormData(),
      mejas: [],
      form: {
        no: null,
        status: null,
      },
      editId: "",
      deleteID: "",
      reservasi: [],
      detail: [],
      id_meja: null,
    };
  },
  methods: {
    detailItem(item) {
      if (item.status == "Ready") {
        this.mesej("Table is ready", "green");
      } else {
        this.id_meja = item.id;
        this.getDetail();
        this.dialogDetail = true;
      }
    },
    setForm() {
      if (this.$refs.form.validate()) {
        if (this.inputType === "Tambah") {
          this.save();
        } else {
          this.update();
        }
        this.dialog = false;
      } else this.mesej("Submit Failed", "red");
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    update() {
      let newData = {
        nomor_meja: this.form.no,
        status: this.form.status,
      };
      var url = this.$api + "/meja/" + this.id;
      this.load = true;
      this.put(url, newData);
    },
    put(url, newData) {
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mesej(response.data.message, "green");
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.mesej(error.response.data.message.nomor_meja[0], "red");
        });
    },
    //read data anggota
    readData() {
      var url = this.$api + "/meja";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mejas = response.data.data;
          this.mesej(response.data.message, "green");
          console.log(this.mejas);
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    getDetail() {
      var url = this.$api + "/getDetailMeja/" + this.id_meja;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detail = response.data.data;
          this.mesej(response.data.message, "green");
          console.log(this.detail);
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    getStatus() {
      var url = this.$api + "/statusMeja";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasi = response.data.data;
          this.mesej(response.data.message, "green");
          this.updateStatus();
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    updateStatus() {
      this.update();
    },
    editItem(meja) {
      this.dialog = true;
      this.inputType = "Edit";
      this.nomor = meja.nomor_meja;
      this.id = meja.id;
      this.form.no = meja.nomor_meja;
      this.form.status = meja.status;
    },

    save() {
      this.meja.append("nomor_meja", this.form.no);

      var url = this.$api + "/meja/";
      this.load = true;
      this.$http
        .post(url, this.meja, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mesej(response.data.message, "green");
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.mesej(error.response.data.message.nomor_meja[0], "red");
        });
    },
    hapus() {
      let status = "Non-active";
      let newData = {
        status: status,
      };
      var url = this.$api + "/meja/" + this.deleteID;
      this.load = true;
      this.put(url, newData);
    },
    restore() {
      let status = "Ready";
      let newData = {
        status: status,
      };
      var url = this.$api + "/meja/" + this.deleteID;
      this.load = true;
      this.put(url, newData);
    },
    deleteHandler(id) {
      this.deleteID = id.id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.resetForm();
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        no: null,
        status: null,
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
    // this.getStatus();
  },
};
</script>
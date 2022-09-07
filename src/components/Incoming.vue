<template>
  <v-main>
    <div>
      <template>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            filled
            dense
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="incomings"
          :items-per-page="10"
          :loading="load"
          class="elevation-1"
        >
          <template v-slot:[`item.harga`]="{ item }">
            Rp {{ formatPrice(item.harga) }}
          </template>
          <template v-slot:[`item.jumlah`]="{ item }">
            {{ item.jumlah }} {{ item.unit }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle blue--text"
                  @click="editHandler(item)"
                >
                  <i class="fas fa-pencil"></i>
                </v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle red--text"
                >
                  <i class="fas fa-ban" @click="deleteHandler(item)"></i>
                </v-btn>
              </template>
              <span>Hapus</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
      <v-dialog
        transition="dialog-top-transition"
        v-model="dialogEdit"
        max-width="600"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="#B71C1C" dark> {{ nama_bahan }}</v-toolbar>
            <v-card-text>
              <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="form.harga_beli"
                  label="Harga Beli"
                  type="number"
                  :rules="hargaRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.jumlah"
                  label="Jumlah"
                  type="number"
                  :rules="jumlahRules"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
              <v-btn text @click="submit()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">warning!</span>
          </v-card-title>
          <v-card-text> Anda yakin ingin menghapus bahan ini? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogConfirm = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteData()">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{ error_message }}
      </v-snackbar>
    </div>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      snackbar: "",
      error_message: "",
      color: "",
      valid: true,
      name: "",
      dialogEdit: false,
      select: null,
      checkbox: false,
      dialog: false,
      dialogConfirm: false,
      notifications: false,
      sound: true,
      widgets: false,
      nama_bahan: "",
      hargaRules: [(v) => !!v || "Harga Beli is required"],
      jumlahRules: [(v) => !!v || "Jumlah is required"],
      headers: [
        {
          text: "ID.",
          value: "id",
        },
        { text: "Tanggal", value: "created_at" },
        { text: "Nama", value: "nama_bahan", align: "start" },
        { text: "Harga", value: "harga" },
        { text: "Jumlah", value: "jumlah" },
        { text: "Action", value: "action" },
      ],
      inputType: "Add",
      deleteId: null,
      incoming: new FormData(),
      load: true,
      incomings: [],
      roles: ["Owner", "OM", "Cashier", "Waiter", "Chef"],
      items: [],
      form: {
        id_incoming: null,
        harga_beli: null,
        jumlah: null,
      },
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let incoming = {
          id: this.form.id_incoming,
          harga: this.form.harga_beli,
          jumlah: this.form.jumlah,
        };
        let url = this.$api + "/incoming/" + incoming.id;
        this.put(url, incoming);
        this.dialogEdit = false;
      } else {
        this.error_message = "Submit Failed";
        this.color = "red";
        this.snackbar = true;
      }
    },
    put(url, newData) {
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
          this.load = false;
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    readData() {
      this.incomingData();
    },
    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "incoming") {
            this.incomings = response.data.data;
          }
          this.error_message = "Retrive Data Successful";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error;
          console.log(error);
          this.color = "red";
          this.snackbar = true;
        });
    },
    incomingData() {
      var url = this.$api + "/incoming";
      this.get(url, "incoming");
    },
    editHandler(item) {
      this.inputType = "Edit";
      this.form.id_incoming = item.id;
      this.form.harga_beli = item.harga;
      this.form.jumlah = item.jumlah;
      this.nama_bahan = item.nama_bahan;
      this.dialogEdit = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogConfirm = true;
    },
    deleteData() {
      var url = this.$api + "/incoming/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
          this.mesej(response.data.message, "green");
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
      this.dialogConfirm = false;
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    resetForm() {
      this.form.nama = null;
      this.form.alamat = null;
      this.form.email = null;
      this.form.telp = null;
      this.form.password = null;
      this.form.role = null;
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

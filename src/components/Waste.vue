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
          :items="wastes"
          :items-per-page="10"
          :loading="load"
          class="elevation-1"
        >
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
              <v-btn text @click="setForm()">Save</v-btn>
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
      load: true,
      date: null,
      created_at: null,
      menu: false,
      inputType: "Add",
      jumlahRules: [
        (v) => !!v || "Jumlah is required",
        (v) => (v && this.form.jumlah < this.jumlah) || "Jumlah is not enough",
      ],
      deleteId: null,
      waste: new FormData(),
      wastes: [],
      roles: ["Owner", "OM", "Cashier", "Waiter", "Chef"],
      items: [],
      form: {
        id_waste: null,
        harga_beli: null,
        jumlah: null,
      },
    };
  },
  methods: {
    save1(date) {
      this.$refs.menu.save(date);
    },
    submit() {
      let waste = {
        id: this.form.id_waste,
        harga: this.form.harga_beli,
        jumlah: this.form.jumlah,
      };
      let url = this.$api + "/waste/" + waste.id;
      this.put(url, waste);
    },
    setForm() {
      if (this.$refs.form.validate()) {
        this.submit();
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
      this.wasteData();
    },
    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "waste") {
            this.wastes = response.data.data;
            console.log(this.wastes);
          }
          this.error_message = "Retrive Data Successful";
          this.color = "green";
          this.snackbar = true;
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error;
          this.color = "red";
          this.snackbar = true;
        });
    },
    wasteData() {
      var url = this.$api + "/waste";
      this.get(url, "waste");
    },
    editHandler(item) {
      this.inputType = "Edit";
      this.form.id_waste = item.id;
      this.form.harga_beli = item.harga;
      this.form.jumlah = item.jumlah;
      this.jumlah = item.bahan_jumlah;
      this.nama_bahan = item.nama_bahan;
      this.dialogEdit = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogConfirm = true;
    },
    deleteData() {
      var url = this.$api + "/waste/" + this.deleteId;
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
    headers() {
      return [
        {
          text: "ID.",
          value: "id",
        },
        {
          text: "Tanggal",
          value: "created_at",
          filter: (value) => {
            if (!this.created_at) return true;

            return value == this.created_at;
          },
        },
        { text: "Nama", value: "nama_bahan", align: "start" },
        { text: "Jumlah", value: "jumlah" },
        { text: "Action", value: "action" },
      ];
    },
  },
  mounted() {
    this.readData();
  },
};
</script>

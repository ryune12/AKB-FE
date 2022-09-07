<template>
  <v-main>
    <div>
      <template>
        <div class="d-flex mb-6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            filled
            dense
          ></v-text-field>
          <v-spacer></v-spacer>
          <div class="d-flex justify-end">
            <v-btn color="#B71C1C" @click="dialog = true" dark>
              Tambah Bahan</v-btn
            >
          </div>
        </div>
        <v-dialog persistent v-model="dialog" max-width="600">
          <v-card>
            <v-toolbar color="#B71C1C" dark> {{ formTitle }} Bahan</v-toolbar>

            <v-card-text>
              <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="form.nama_bahan"
                  :counter="50"
                  label="Name"
                  :rules="nameRules"
                  required
                ></v-text-field>
                <v-select
                  v-model="form.menu"
                  :items="menu"
                  item-text="nama_menu"
                  item-value="id"
                  menu-props="auto"
                  :rules="menuRules"
                  label="Menu"
                  required
                ></v-select>
                <v-select
                  v-model="form.unit"
                  :items="unit"
                  menu-props="auto"
                  label="Unit"
                  :rules="unitRules"
                  required
                ></v-select>
                <v-text-field
                  v-model="form.serving_size"
                  label="Serving Size"
                  :rules="servingRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.rasio"
                  label="Rasio Konversi"
                  required
                  :rules="ratioRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="(dialog = false), resetForm()">Close </v-btn>
              <v-btn text @click="setForm()"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="bahans"
          :items-per-page="10"
          :loading="load"
          class="elevation-1"
        >
          <template v-slot:[`item.serving_size`]="{ item }">
            <div>{{ item.serving_size }} {{ item.unit }}</div>
          </template>
          <template v-slot:[`item.jumlah`]="{ item }">
            <div>{{ item.jumlah }} {{ item.unit }}</div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  class="mr-2 rounded-circle green--text"
                  @click="tambahHandler(item)"
                >
                  <i class="fas fa-plus"></i>
                </v-btn>
              </template>
              <span>Tambah Stok</span>
            </v-tooltip>
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
              <span>Edit Bahan</span>
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
              <span>Hapus Bahan</span>
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
                  <i class="fas fa-trash" @click="wasteHandler(item)"></i>
                </v-btn>
              </template>
              <span>Buang Stok</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
      <v-dialog v-model="dialogConfirm" max-width="400px">
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
            <v-btn color="blue darken-1" text @click="deleteData">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Tambah -->
      <v-dialog persistent v-model="dialogTambah" max-width="600">
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="#B71C1C" dark> {{ nama_bahan }}</v-toolbar>
            <v-card-text>
              <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="add.harga_beli"
                  label="Harga Beli"
                  type="number"
                  :rules="hargaRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="add.jumlah"
                  label="Jumlah"
                  type="number"
                  :rules="jumlahRules"
                  :suffix="unit"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="(dialog.value = false), close()">Close</v-btn>
              <v-btn text @click="submit(), (dialog.value = false)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog
        persistent
        transition="dialog-top-transition"
        v-model="wasteDialog"
        max-width="600"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="#B71C1C" dark> {{ nama_bahan }}</v-toolbar>
            <v-card-text>
              <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="add.jumlah"
                  label="Jumlah"
                  type="number"
                  :rules="jumlahWasteRules"
                  :suffix="unit"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="(dialog.value = false), close()">Close</v-btn>
              <v-btn text @click="goWaste()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </template>
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
      dialog: false,
      dialogConfirm: false,
      dialogTambah: false,
      wasteDialog: false,
      nameRules: [(v) => !!v || "Name is required"],
      menuRules: [(v) => !!v || "Menu is required"],
      unitRules: [(v) => !!v || "Unit is required"],
      servingRules: [(v) => !!v || "Serving Size is required"],
      ratioRules: [(v) => !!v || "Rasio Konversi is required"],
      hargaRules: [(v) => !!v || "Harga Beli is required"],
      jumlahWasteRules: [
        (v) => !!v || "Jumlah is required",
        (v) => (v && this.add.jumlah <= this.jumlah) || "Jumlah is not enough",
      ],
      jumlahRules: [(v) => !!v || "Jumlah is required"],

      jumlah: "",
      select: null,
      sound: true,
      widgets: false,
      unit: ["gram", "ml"],
      menu: [],
      headers: [
        {
          text: "No.",
          value: "id",
        },
        { text: "Nama", value: "nama_bahan", align: "start" },
        { text: "Menu", value: "nama_menu" },
        { text: "Kategori", value: "kategori" },
        { text: "Jumlah", value: "jumlah" },
        { text: "Serving Size", value: "serving_size" },
        { text: "Rasio", value: "rasio_konversi" },
        { text: "Action", value: "action" },
      ],
      inputType: "Tambah",
      bahan: new FormData(),
      bahans: [],
      nama_bahan: "",
      id_bahan: "",
      load: true,
      items: [],
      add: {
        id_bahan: null,
        harga_beli: null,
        jumlah: null,
      },
      form: {
        menu: null,
        nama: null,
        unit: null,
        serving_size: null,
        rasio: null,
      },
    };
  },
  methods: {
    close() {
      this.resetForm();
      this.resetValidation();
    },
    setForm() {
      if (this.$refs.form.validate()) {
        if (this.inputType === "Tambah") {
          this.save();
        } else {
          this.update();
        }
        this.dialog = false;
        this.resetValidation();
        this.dialogTambah = false;
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
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      let newData = {
        nama_bahan: this.form.nama_bahan,
        serving_size: this.form.serving_size,
      };
      var url = this.$api + "/Bahan/" + this.editId;
      this.load = true;
      this.put(url, newData);
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
      this.ReadBahan();
      this.ReadMenu();
      // this.role();
    },
    post(url, data) {
      this.$http
        .post(url, data, {
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
        })
        .catch((error) => {
          this.error_message = error;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    save() {
      this.bahan.append("nama_bahan", this.form.nama_bahan);
      this.bahan.append("id_menu", this.form.menu);
      this.bahan.append("unit", this.form.unit);
      this.bahan.append("serving_size", this.form.serving_size);
      this.bahan.append("rasio_konversi", this.form.rasio);
      var url = this.$api + "/Bahan";
      this.post(url, this.bahan);
    },
    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "bahan") {
            this.bahans = response.data.data;
          } else if (data == "menu") {
            this.menu = response.data.data;
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
    ReadBahan() {
      var url = this.$api + "/Bahan";
      this.get(url, "bahan");
    },
    ReadMenu() {
      var url = this.$api + "/Menu";
      this.get(url, "menu");
    },
    resetForm() {
      this.form.nama_bahan = null;
      this.form.serving_size = null;
      this.form.menu = null;
      this.form.rasio = null;
      this.form.unit = null;
      this.add.harga_beli = null;
      this.add.jumlah = null;
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    deleteData() {
      var url = this.$api + "/Bahan/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mesej(response.data.message, "green");
          this.dialogConfirm = false;
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        let incoming = {
          id_bahan: this.add.id_bahan,
          harga: this.add.harga_beli,
          jumlah: this.add.jumlah,
        };
        console.log(incoming.harga);
        let url = this.$api + "/incoming";
        this.post(url, incoming);
        this.resetValidation();
      } else {
        this.error_message = "Submit Failed";
        this.color = "red";
        this.snackbar = true;
      }
    },
    goWaste() {
      if (this.$refs.form.validate()) {
        let waste = {
          id_bahan: this.add.id_bahan,
          jumlah: this.add.jumlah,
        };
        let url = this.$api + "/waste";
        this.post(url, waste);
        this.wasteDialog = false;
      } else {
        this.error_message = "Submit Failed";
        this.color = "red";
        this.snackbar = true;
      }
    },
    tambahHandler(item) {
      this.dialogTambah = true;
      this.add.id_bahan = item.id;
      console.log(item.id);
      this.nama_bahan = item.nama_bahan;
      this.unit = item.unit;
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_bahan = item.nama_bahan;
      this.form.menu = item.id_menu;
      this.form.serving_size = item.serving_size;
      this.form.rasio = item.rasio_konversi;
      this.form.unit = item.unit;
      console.log(this.editId);
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id.id;
      this.dialogConfirm = true;
    },
    wasteHandler(item) {
      this.wasteDialog = true;
      this.add.id_bahan = item.id;
      console.log(item.id);
      this.nama_bahan = item.nama_bahan;
      this.unit = item.unit;
      this.jumlah = item.jumlah;
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

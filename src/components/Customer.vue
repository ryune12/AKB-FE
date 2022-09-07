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
            dense
            filled
          ></v-text-field>
          <v-spacer></v-spacer>
          <div class="d-flex justify-end">
            <v-btn color="#B71C1C" @click="dialog = true" dark>
              Tambah Customer</v-btn
            >
          </div>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="employees"
            :loading="load"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:[`item.status`]="{ item }">
              <div v-if="item.deleted_at == null">Active</div>
              <div v-else>Banned</div>
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
        </v-card>
      </template>

      <v-dialog
        v-model="dialog"
        max-width="600"
        scrollable
        persistent
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="#B71C1C" dark> {{ formTitle }} Customer</v-toolbar>

          <v-divider></v-divider>

          <v-card-text justify="center">
            <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.nama"
                :counter="50"
                label="Name"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="E-mail"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                type="number"
                v-model="form.no_telp"
                :rules="telpRules"
                label="Telp"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn text @click="(dialog = false), close()">Close </v-btn>
            <v-btn text @click="setForm()"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      dialogConfirm: false,
      deleteId: "",
      nameRules: [(v) => !!v || "Name is required"],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      address: "",
      addressRules: [(v) => !!v || "Address is required"],
      no_telp: "",
      telpRules: [(v) => !!v || "Telp is required"],
      password: "",
      passwordRules: [(v) => !!v || "Password is required"],
      confirmPass: "",
      confirmRules: [
        (v) => !!v || "Confirm password is required",
        (v) => v == this.form.password || "Password is not match",
      ],

      roleRules: [(v) => !!v || "Role is required"],
      select: null,
      checkbox: false,
      dialog: false,
      notifications: false,
      sound: true,
      load: true,
      widgets: false,
      headers: [
        {
          text: "No.",
          value: "id",
        },
        { text: "Nama", value: "nama", align: "start" },
        { text: "Telp", value: "no_telp" },
        { text: "Email", value: "email" },
        { text: "Action", value: "action" },
      ],
      inputType: "Add",
      employee: new FormData(),
      employees: [],
      roles: ["Owner", "OM", "Cashier", "Waiter", "Chef"],
      items: [],
      form: {
        nama: null,
        alamat: null,
        email: null,
        no_telp: null,
        password: null,
        select: null,
      },
    };
  },
  methods: {
    close() {
      this.resetForm();
      this.resetValidation();
    },
    blackList(item) {
      console.log(item.id);
      let status = {
        status: "",
      };
      item.status == "active"
        ? (status.status = "Banned")
        : (status.status = "Active");
      let url = this.$api + "/nonaktif/" + item.id;
      this.put(url, status);
    },
    setForm() {
      if (this.$refs.form.validate()) {
        if (this.inputType === "Add") {
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
          this.inputType = "Add";
        })
        .catch((error) => {
          let obj = error.response.data.message;
          let message = obj[Object.keys(obj)[0]];
          this.error_message = message[0];
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      let newData = {
        nama: this.form.nama,
        alamat: this.form.alamat,
        email: this.form.email,
        no_telp: this.form.no_telp,
        role_id: this.form.select,
      };
      var url = this.$api + "/Customer/" + this.editId;
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
      this.customer();
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    deleteData() {
      var url = this.$api + "/Customer/" + this.deleteId;
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
          console.log(error);
          // this.mesej(error.response.message, "red");
        });
    },
    save() {
      this.employee.append("nama", this.form.nama);
      this.employee.append("email", this.form.email);
      this.employee.append("no_telp", this.form.no_telp);
      var url = this.$api + "/Customer/";
      this.load = true;
      this.$http
        .post(url, this.employee, {
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
        })
        .catch((error) => {
          let obj = error.response.data.message;
          let message = obj[Object.keys(obj)[0]];
          this.error_message = message[0];
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    get(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "customer") {
            this.employees = response.data.data;
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
    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogConfirm = true;
    },
    customer() {
      var url = this.$api + "/Customer";
      this.get(url, "customer");
    },
    editHandler(item) {
      this.inputType = "Edit";
      this.editId = item.id;
      this.form.nama = item.nama;
      this.form.alamat = item.alamat;
      this.form.email = item.email;
      this.form.no_telp = item.no_telp;
      this.form.select = item.role_id;
      console.log(this.editId);
      this.dialog = true;
    },
    resetForm() {
      this.form.nama = null;
      this.form.alamat = null;
      this.form.email = null;
      this.form.no_telp = null;
      this.form.password = null;
      this.form.confirmPass = null;
      this.form.select = null;
      this.inputType = "Add";
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

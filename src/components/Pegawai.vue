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
          <div class="d-flex justify-end mx-5">
            <v-btn color="#B71C1C" dark @click="dialog = true">
              Tambah Pegawai</v-btn
            >
          </div>
        </div>
        <v-dialog
          v-model="dialog"
          max-width="600"
          scrollable
          persistent
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar color="#B71C1C" dark> {{ formTitle }} Pegawai</v-toolbar>
            <!-- <v-toolbar dark color="#B71C1C">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ formTitle }} Pegawai</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="(dialog = false), setForm()">
                  Save
                </v-btn>
              </v-toolbar-items>
            </v-toolbar> -->
            <v-divider></v-divider>

            <v-card-text justify="center" style="height: 600px">
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

                <v-textarea
                  name="input-7-1"
                  v-model="form.alamat"
                  label="Address"
                  :rules="addressRules"
                  hint="Hint text"
                ></v-textarea>
                <v-text-field
                  type="number"
                  v-model="form.telp"
                  :rules="telpRules"
                  label="Telp"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="inputType == 'Add'"
                  v-model="form.password"
                  :rules="passwordRules"
                  type="password"
                  label="Password"
                  required
                ></v-text-field>

                <v-text-field
                  v-if="inputType == 'Add'"
                  v-model="form.confirmPass"
                  :rules="confirmRules"
                  type="password"
                  label="Confirm Password"
                  required
                ></v-text-field>

                <v-select
                  v-model="form.select"
                  :items="roles"
                  item-text="nama"
                  item-value="id"
                  :rules="roleRules"
                  menu-props="auto"
                  label="Role"
                  required
                ></v-select>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
              <v-btn text @click="(dialog = false), close()">Close </v-btn>
              <v-btn text @click="setForm()"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
                  <i class="fas fa-ban" @click="blackList(item)"></i>
                </v-btn>
              </template>
              <span>Ban Account</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
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
      nameRules: [(v) => !!v || "Name is required"],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      address: "",
      addressRules: [(v) => !!v || "Address is required"],
      telp: "",
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
        { text: "Jabatan", value: "role_id" },
        { text: "Address", value: "alamat" },
        { text: "Email", value: "email" },
        { text: "Status", value: "status" },
        { text: "Action", value: "action" },
      ],
      inputType: "Add",
      employee: new FormData(),
      employees: [],
      roles: ["Owner", "Operational Manager", "Cashier", "Waiter", "Chef"],
      items: [],
      form: {
        nama: null,
        alamat: null,
        email: null,
        telp: null,
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
          this.error_message = error;
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
        telp: this.form.telp,
        role_id: this.form.select,
      };
      var url = this.$api + "/karyawan/" + this.editId;
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
      this.user();
    },
    save() {
      this.employee.append("nama", this.form.nama);
      this.employee.append("alamat", this.form.alamat);
      this.employee.append("email", this.form.email);
      this.employee.append("telp", this.form.telp);
      this.employee.append("role_id", this.form.select);
      this.employee.append("password", this.form.password);
      var url = this.$api + "/karyawan/";
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
          this.error_message = error.response.message;
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
          if (data == "user") {
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
    user() {
      var url = this.$api + "/karyawan";
      this.get(url, "user");
    },
    editHandler(item) {
      this.inputType = "Edit";
      this.editId = item.id;
      this.form.nama = item.nama;
      this.form.alamat = item.alamat;
      this.form.email = item.email;
      this.form.telp = item.telp;
      this.form.select = item.role_id;
      console.log(this.editId);
      this.dialog = true;
    },
    resetForm() {
      this.form.nama = null;
      this.form.alamat = null;
      this.form.email = null;
      this.form.telp = null;
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

<template>
  <v-main>
    <v-stepper v-model="e6" vertical>
      <v-stepper-header class="d-flex"
        ><v-card-title><div>Tambah Reservasi</div> </v-card-title>
      </v-stepper-header>
      <v-stepper-step color="#B71C1C" :complete="e6 > 1" step="1">
        Sudah pernah reservasi?
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-btn
          color="#B71C1C"
          class="white--text"
          @click="(e6 = 3), getCustomer()"
        >
          Yes
        </v-btn>
        <v-btn @click="e6 = 2" text> No </v-btn>
      </v-stepper-content>
      <v-form ref="cust" class="" v-model="valid" lazy-validation>
        <v-stepper-step color="#B71C1C" :complete="e6 > 2" step="2">
          Tambah Customer
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-text-field
            v-model="form.nama"
            label="Nama Customer"
            :rules="namaRules"
            required
            outlined
            class="mt-2"
            dense
            height="27px"
          ></v-text-field>
          <v-text-field
            v-model="form.no_telp"
            label="No HP"
            :rules="nohpRules"
            outlined
            type="number"
            dense
            required
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="E-mail"
            :rules="emailRules"
            dense
            outlined
          ></v-text-field>
          <v-btn color="#B71C1C" class="white--text" @click="checkValidation()">
            Continue
          </v-btn>
          <v-btn text @click="e6--"> Cancel </v-btn>
        </v-stepper-content>
      </v-form>
      <v-form ref="form" class="" v-model="valid" lazy-validation>
        <v-stepper-step color="#B71C1C" :complete="e6 > 3" step="3">
          Pilih Customer
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-autocomplete
            v-model="form.no_telp"
            label="No Hp"
            :rules="nohpRules"
            required
            :items="customers"
            item-text="no_telp"
            outlined
            class="mt-2"
            dense
            height="27px"
            clearable
          ></v-autocomplete>
          <v-btn
            color="#B71C1C"
            class="white--text"
            @click="customerValidation()"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = e6 - 2"> Cancel </v-btn>
        </v-stepper-content>
      </v-form>
      <v-stepper-step color="#B71C1C" :complete="e6 > 4" step="4">
        Data Reservasi
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-form ref="resv" class="" v-model="valid" lazy-validation>
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex">
                <v-text-field
                  v-model="date"
                  append-icon="mdi-calendar"
                  readonly
                  label="Tanggal Reservasi"
                  v-bind="attrs"
                  class="mt-1"
                  outlined
                  :rules="tanggalRules"
                  v-on="on"
                  dense
                ></v-text-field>
              </div>
            </template>
            <v-date-picker v-model="date" :min="mindate" color="#B71C1C">
              <v-spacer></v-spacer>
              <v-btn text color="#B71C1C" @click="menu2 = false">
                Cancel
              </v-btn>
              <v-btn text color="#B71C1C" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-select
            v-model="form.sesi"
            :items="[
              { id: 1, nama: 'Lunch' },
              { id: 2, nama: 'Dinner' },
            ]"
            item-text="nama"
            item-value="id"
            :rules="sesiRules"
            menu-props="auto"
            label="Sesi"
            outlined
            dense
            required
          ></v-select>
          <v-btn
            color="#B71C1C"
            class="white--text"
            @click="reservasiValidation()"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6--"> Cancel </v-btn>
        </v-form>
      </v-stepper-content>
      <v-stepper-step color="#B71C1C" :complete="e6 > 5" step="5">
        Pilih Meja : {{ form.nomor_meja }}
      </v-stepper-step>
      <v-stepper-content step="5">
        <v-row no-gutters>
          <v-col v-for="table in mejas" :key="table.id" class="px-5 py-3 my-2">
            <v-card width="70px" height="auto">
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
                  </v-card>
                  <v-card
                    v-else-if="table.status == 'Ready'"
                    flat
                    v-bind="attrs"
                    v-on="on"
                    :color="colorGreen"
                    @click="selectMeja(table)"
                  >
                    <v-card-title class="white--text">
                      {{ table.nomor_meja }}
                    </v-card-title>
                  </v-card>
                  <v-card
                    v-else-if="table.status == 'Booked'"
                    flat
                    :color="colorRed"
                  >
                    <v-card-title class="white--text">
                      {{ table.nomor_meja }}
                    </v-card-title>
                  </v-card>
                </template>
                <span>Pilih Meja</span>
              </v-tooltip>
            </v-card>
          </v-col>
        </v-row>
        <v-btn text @click="e6--"> Cancel </v-btn>
      </v-stepper-content>
    </v-stepper>
    <div class="d-flex mt-6">
      <v-spacer></v-spacer>
      <router-link to="/reservasi"><v-btn> Cancel </v-btn></router-link>
      <v-btn
        :disabled="e6 <= 5"
        color="#B71C1C"
        class="ml-4 white--text"
        @click="save()"
      >
        Submit Reservasi
      </v-btn>
    </div>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<style  scoped>
a {
  text-decoration: none;
}
</style>


<script>
export default {
  data() {
    return {
      dialog: false,
      colorGreen: "#26A69A",
      colorRed: "#B71C1C",
      colorGrey: "#607D8B",
      e6: 1,
      menu2: false,
      mindate: new Date().toISOString().substr(0, 10),
      date: new Date().toISOString().substr(0, 10),
      namaRules: [(v) => !!v || "Nama Customer is required"],
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      nohpRules: [(v) => !!v || "No HP is required"],
      sesiRules: [(v) => !!v || "Sesi is required"],
      tanggalRules: [(v) => !!v || "Tanggal is required"],
      error_message: "",
      color: "",
      snackbar: false,
      valid: true,
      customers: [],
      mejas: [],
      form: {
        nama: null,
        no_telp: null,
        email: null,
        sesi: null,
        nomor_meja: null,
      },
    };
  },
  methods: {
    checkValidation() {
      if (this.$refs.cust.validate()) {
        this.e6 = 4;
      } else {
        this.mesej("Submit Failed", "red");
      }
    },
    customerValidation() {
      if (this.$refs.form.validate()) {
        this.e6 = 4;
      } else {
        this.mesej("Submit Failed", "red");
      }
    },
    reservasiValidation() {
      if (this.$refs.resv.validate()) {
        this.getMeja();
      } else {
        this.mesej("Submit Failed", "red");
      }
    },
    selectMeja(table) {
      this.form.nomor_meja = table.nomor_meja;
      this.e6 = 6;
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    getMeja() {
      var url =
        this.$api +
        "/meja/" +
        encodeURIComponent(this.date) +
        "/" +
        encodeURIComponent(this.form.sesi);
      this.get(url, "meja");
    },
    getCustomer() {
      var url = this.$api + "/Customer";
      this.get(url, "customer");
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
            this.customers = response.data.data;
          } else if (data == "meja") {
            this.mejas = response.data.data;
            this.e6 = 5;
          }
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
        });
    },
    post(url, data) {
      this.$http
        .post(url, data, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.resetForm();
          this.$router.replace({
            path: "/reservasi",
          });
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    resetForm() {
      this.form = {
        nama: null,
        no_telp: null,
        email: null,
        sesi: null,
        nomor_meja: null,
      };
      this.date = null;
    },
    save() {
      let reservasi = {
        nama: this.form.nama,
        no_telp: this.form.no_telp,
        email: this.form.email,
        tanggal_reservasi: this.date,
        sesi: this.form.sesi,
        nomor_meja: this.form.nomor_meja,
        id_karyawan: sessionStorage.getItem("id"),
      };
      var url = this.$api + "/Reservasi/";
      this.load = true;
      this.post(url, reservasi);
    },
  },
};
</script>
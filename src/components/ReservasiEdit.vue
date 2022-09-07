<template>
  <v-main>
    <v-stepper v-model="e6" vertical :loading="load">
      <v-stepper-header class="d-flex"
        ><v-card-title
          ><div>Update Reservasi</div>
          <v-divider class="mx-4" vertical></v-divider>
          <div>#{{ reservasis.id }}</div>
        </v-card-title>
        <v-card-title
          ><div>No Meja : {{ reservasis.nomor_meja }}</div></v-card-title
        >
      </v-stepper-header>
      <v-row>
        <v-col class="ml-4" style="padding: 24px 24px 16px">
          <v-card-title style="margin-left: -15px"
            >Data Customer :
          </v-card-title>
          <v-text-field
            label="Nama Customer"
            outlined
            disabled
            dense
            v-model="reservasis.nama"
          ></v-text-field>
          <v-text-field
            label="Email"
            outlined
            disabled
            dense
            v-model="reservasis.email"
          ></v-text-field>
          <v-text-field
            label="Nomor Telepon"
            outlined
            disabled
            dense
            v-model="reservasis.no_telp"
          ></v-text-field>
        </v-col>
        <v-col
          ><v-stepper-step color="#B71C1C" :complete="e6 > 4" step="1">
            Data Reservasi
          </v-stepper-step>
          <v-stepper-content step="1">
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
                      outlined
                      class="mt-1"
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
          <v-stepper-step color="#B71C1C" :complete="e6 > 2" step="2">
            Pilih Meja : {{ form.nomor_meja }}
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-row no-gutters>
              <v-col
                v-for="table in mejas"
                :key="table.id"
                class="px-5 py-3 my-2"
              >
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
                        v-else-if="reservasis.nomor_meja == table.nomor_meja"
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
          </v-stepper-content></v-col
        >
      </v-row>
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
      id: "",
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
      load: true,
      valid: true,
      reservasis: [],
      mejas: [],
      form: {
        sesi: null,
        nomor_meja: null,
      },
    };
  },
  methods: {
    getCustomer() {
      var url = this.$api + "/ReservasiShow/" + this.id;
      this.get(url, "reservasi");
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
            this.date = this.reservasis.tanggal_reservasi;
            this.form.sesi = this.reservasis.sesi;
          } else if (data == "meja") {
            this.mejas = response.data.data;
            this.e6 = 2;
          }
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
        });
      console.log();
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
    getMeja() {
      var url =
        this.$api +
        "/meja/" +
        encodeURIComponent(this.date) +
        "/" +
        encodeURIComponent(this.form.sesi);
      this.get(url, "meja");
    },
    put(url, data) {
      this.$http
        .put(url, data, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
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
    save() {
      let data = {
        tanggal_reservasi: this.date,
        sesi: this.form.sesi,
        nomor_meja: this.form.nomor_meja,
      };
      var url = this.$api + "/Reservasi/" + this.reservasis.id;
      this.load = true;
      this.put(url, data);
    },
  },

  mounted() {
    this.id = this.$router.history.current.params.id;
    this.getCustomer();
  },
};
</script>
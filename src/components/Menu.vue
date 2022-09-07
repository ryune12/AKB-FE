<template>
  <v-main>
    <h2 class="mx-4">
      <div class="d-flex">
        Makanan Utama
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="rounded white--text mx-4"
              :color="colorRed"
              @click="(dialog = true), (kategori = 'MainCourse')"
            >
              <i class="fas fa-plus"></i
            ></v-btn>
          </template>
          <span>Tambah Menu Utama</span>
        </v-tooltip>

        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            style="margin-top: -15px; margin-bottom: -10px"
            label="Search"
            v-model="searchMain"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </div>
    </h2>

    <v-slide-group v-if="loading" multiple show-arrows>
      <v-slide-item v-for="i in 12" :key="i"
        ><v-skeleton-loader
          active-class="purple white--text"
          rounded
          width="374"
          class="mx-4 my-12"
          type="card, article"
        ></v-skeleton-loader>
      </v-slide-item>
    </v-slide-group>

    <v-slide-group v-else multiple show-arrows>
      <v-slide-item
        v-for="menu in filteredMain()"
        :key="menu.id"
        v-slot="{ active }"
      >
        <template>
          <v-card
            :input-value="active"
            active-class="purple white--text"
            rounded
            class="mx-4 my-12"
            max-width="374"
          >
            <v-img height="250" :src="'http://localhost:8000/' + menu.image"
              ><v-app-bar flat color="rgba(0, 0, 0, 0)"> </v-app-bar
            ></v-img>

            <v-card-title
              >{{ menu.nama_menu }}
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="editHandler(menu)"
                  >
                    <i class="fas fa-pencil"></i>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="deleteHandler(menu)"
                  >
                    <i class="fas fa-trash"></i>
                  </v-btn>
                </template>
                <span>Hapus</span>
              </v-tooltip>
            </v-card-title>

            <v-card-text>
              <div class="subtitle-1">
                Rp {{ formatPrice(menu.harga) }} • {{ menu.kategori }}
              </div>
              <div class="subtitle-1">
                Stock: {{ hitungStok(menu) }} {{ menu.unit }}
              </div>
              <div class="subtitle-1 my-2">{{ menu.deskripsi }}</div>
            </v-card-text>
          </v-card>
        </template>
      </v-slide-item>
    </v-slide-group>
    <v-divider class="ma-5"></v-divider>
    <h2 class="card-title mx-4">
      <div class="d-flex">
        Side Dish
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="rounded white--text mx-4"
              :color="colorRed"
              @click="(dialog = true), (kategori = 'SideDish')"
            >
              <i class="fas fa-plus"></i
            ></v-btn>
          </template>
          <span>Tambah Side Dish</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            style="margin-top: -15px; margin-bottom: -10px"
            label="Search"
            v-model="searchSide"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </div>
    </h2>
    <!-- SIDE DISH -->
    <v-slide-group v-if="loading" multiple show-arrows>
      <v-slide-item v-for="i in 12" :key="i"
        ><v-skeleton-loader
          active-class="purple white--text"
          rounded
          width="374"
          class="mx-4 my-12"
          type="card, article"
        ></v-skeleton-loader>
      </v-slide-item>
    </v-slide-group>
    <v-slide-group v-else multiple show-arrows>
      <v-slide-item
        v-for="menu in filteredSide()"
        :key="menu.id"
        v-slot="{ active }"
      >
        <template>
          <v-card
            :loading="loading"
            :input-value="active"
            active-class="purple white--text"
            depressed
            rounded
            class="mx-4 my-12"
            max-width="374"
          >
            <v-img height="250" :src="'http://localhost:8000/' + menu.image"
              ><v-app-bar flat color="rgba(0, 0, 0, 0)"> </v-app-bar
            ></v-img>

            <v-card-title
              >{{ menu.nama_menu }}<v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="editHandler(menu)"
                  >
                    <i class="fas fa-pencil"></i>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="deleteHandler(menu)"
                  >
                    <i class="fas fa-trash"></i>
                  </v-btn>
                </template>
                <span>Hapus</span>
              </v-tooltip></v-card-title
            >

            <v-card-text>
              <div class="subtitle-1">
                Rp {{ formatPrice(menu.harga) }} • {{ menu.kategori }}
              </div>
              <div class="subtitle-1">
                Stock: {{ hitungStok(menu) }} {{ menu.unit }}
              </div>
              <div class="subtitle-1 my-2">{{ menu.deskripsi }}</div>
            </v-card-text>
          </v-card>
        </template>
      </v-slide-item>
    </v-slide-group>
    <v-divider class="ma-5"></v-divider>
    <h2 class="card-title mx-4">
      <div class="d-flex">
        Minuman
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="rounded white--text mx-4"
              :color="colorRed"
              @click="(dialog = true), (kategori = 'Drink')"
            >
              <i class="fas fa-plus"></i
            ></v-btn>
          </template>
          <span>Tambah Minuman</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            style="margin-top: -15px; margin-bottom: -10px"
            label="Search"
            v-model="searchMinuman"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </div>
    </h2>
    <!-- MINUMAN -->
    <v-slide-group v-if="loading" multiple show-arrows>
      <v-slide-item v-for="i in 12" :key="i"
        ><v-skeleton-loader
          active-class="purple white--text"
          rounded
          width="374"
          class="mx-4 my-12"
          type="card, article"
        ></v-skeleton-loader>
      </v-slide-item>
    </v-slide-group>
    <v-slide-group multiple show-arrows>
      <v-slide-item
        v-for="menu in filteredMinuman()"
        :key="menu.id"
        v-slot="{ active }"
      >
        <template>
          <v-card
            :loading="loading"
            :input-value="active"
            active-class="purple white--text"
            depressed
            rounded
            class="mx-4 my-12"
            max-width="374"
          >
            <v-img height="250" :src="'http://localhost:8000/' + menu.image">
            </v-img>

            <v-card-title
              >{{ menu.nama_menu }}<v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="editHandler(menu)"
                  >
                    <i class="fas fa-pencil"></i>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    @click="deleteHandler(menu)"
                  >
                    <i class="fas fa-trash"></i>
                  </v-btn>
                </template>
                <span>Hapus</span>
              </v-tooltip>
            </v-card-title>

            <v-card-text>
              <div class="subtitle-1">
                Rp {{ formatPrice(menu.harga) }} • {{ menu.kategori }}
              </div>
              <div class="subtitle-1">
                Stock: {{ hitungStok(menu) }} {{ menu.unit }}
              </div>
              <div class="subtitle-1 my-2">{{ menu.deskripsi }}</div>
            </v-card-text>
          </v-card>
        </template>
      </v-slide-item>
    </v-slide-group>
    <!-- Dialog Confirm -->
    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus produk ini? </v-card-text>
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
    <!-- Dialog Update Foto -->
    <v-dialog
      transition="dialog-top-transition"
      v-model="dialogImage"
      persistent
      max-width="600"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar :color="colorRed" dark> Update Photo</v-toolbar>
          <v-card-text>
            <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
              <input
                type="file"
                name="photo"
                accept="image/*"
                :rules="imgRules"
                required
                @change="imageChanged"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="(dialog.value = false), resetForm()"
              >Close</v-btn
            >
            <v-btn text @click="updateFoto(newImage)">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- Dialog Tambah -->
    <v-dialog
      transition="dialog-top-transition"
      v-model="dialog"
      persistent
      max-width="600"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar :color="colorRed" dark> {{ kategori }}</v-toolbar>
          <v-card-text>
            <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.nama_menu"
                :counter="50"
                label="Nama"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.harga"
                label="Harga"
                :rules="hargaRules"
                type="number"
                required
              ></v-text-field>
              <v-select
                v-model="form.unit"
                :items="items"
                item-text="nama"
                item-value="id"
                :rules="unitRules"
                menu-props="auto"
                label="Unit"
                required
              ></v-select>
              <v-text-field
                v-model="form.deskripsi"
                label="Deskripsi"
                required
                :rules="deskripsiRules"
              ></v-text-field>
              <input
                type="file"
                name="photo"
                accept="image/*"
                :rules="imgRules"
                required
                @change="imageChanged"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="(dialog.value = false), resetForm()"
              >Close</v-btn
            >
            <v-btn text @click="setForm()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- SnackBar -->
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
      valid: "",
      colorGreen: "#26A69A",
      colorRed: "#B71C1C",
      colorGrey: "#607D8B",
      inputType: "Tambah",
      kategori: "",
      load: true,
      snackbar: false,
      dialogDetail: false,
      dialogImage: false,
      error_message: "",
      color: "",
      search: null,
      nameRules: [(v) => !!v || "Name is required"],
      hargaRules: [(v) => !!v || "Harga is required"],
      unitRules: [(v) => !!v || "Unit is required"],
      deskripsiRules: [(v) => !!v || "Deskripsi Size is required"],
      imgRules: [(v) => !!v || "Image Konversi is required"],
      dialog: false,
      dialogConfirm: false,
      loading: true,
      image: null,
      items: ["Plate", "Bowl", "Mini-Bowl", "Bottle", "Glass"],
      nomor: 0,
      menu: new FormData(),
      newImage: new FormData(),
      mainCourse: [],
      sideDish: [],
      drink: [],
      detail: {
        nama_menu: null,
        harga: null,
        kategori: null,
        deskripsi: null,
        unit: null,
        image: null,
      },
      form: {
        nama_menu: null,
        harga: null,
        kategori: null,
        deskripsi: null,
        unit: null,
        image: null,
      },
      deleteId: "",
      editId: "",
      searchMain: "",
      searchSide: "",
      searchMinuman: "",
    };
  },
  methods: {
    filteredMain() {
      return this.mainCourse.filter((main) => {
        return main.nama_menu
          .toLowerCase()
          .match(this.searchMain.toLowerCase());
      });
    },
    filteredSide() {
      return this.sideDish.filter((side) => {
        return side.nama_menu
          .toLowerCase()
          .match(this.searchSide.toLowerCase());
      });
    },
    filteredMinuman() {
      return this.drink.filter((minuman) => {
        return minuman.nama_menu
          .toLowerCase()
          .match(this.searchMinuman.toLowerCase());
      });
    },
    detailHandler(item) {
      this.detail.nama_menu = item.nama_menu;
      this.detail.harga = item.harga;
      this.detail.kategori = item.kategori;
      this.detail.deskripsi = item.deskripsi;
      this.detail.unit = item.unit;
      this.detail.image = item.image;
    },
    editHandler(item) {
      this.editId = item.id;
      this.form.nama_menu = item.nama_menu;
      this.form.harga = item.harga;
      this.kategori = item.kategori;
      this.form.deskripsi = item.deskripsi;
      this.form.unit = item.unit;
      this.dialog = true;
      this.inputType = "Edit";
    },
    menuMainCourse() {
      var kategoriMenu = "MainCourse";
      var url = this.$api + "/Menu/" + kategoriMenu;
      this.readData(url, "MainCourse");
    },
    menuSideDish() {
      var kategoriMenu = "SideDish";
      var url = this.$api + "/Menu/" + kategoriMenu;
      this.readData(url, "SideDish");
    },
    menuDrink() {
      var kategoriMenu = "Drink";
      var url = this.$api + "/Menu/" + kategoriMenu;
      this.readData(url, "Drink");
    },
    readData(url, data) {
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (data == "MainCourse") {
            this.mainCourse = response.data.data;
          } else if (data == "SideDish") {
            this.sideDish = response.data.data;
          } else {
            this.drink = response.data.data;
          }
          this.mesej(response.data.message, "green");
          this.loading = false;
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    deleteData() {
      var url = this.$api + "/Menu/" + this.deleteId;
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
          this.close();
          this.loadMenu(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    update() {
      let newData = {
        nama_menu: this.form.nama_menu,
        harga: this.form.harga,
        kategori: this.kategori,
        deskripsi: this.form.deskripsi,
        unit: this.form.unit,
        image: this.image,
      };
      var url = this.$api + "/Menu/" + this.editId;
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
          this.loadMenu(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },
    updateFotoHandler(item) {
      this.newImage.append("image", this.image);
      this.newImage.append("id", item.id);
    },
    updateFoto(item) {
      var url = this.$api + "/Menu/image/";
      this.load = true;
      this.$http
        .post(url, item, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mesej(response.data.message, "green");
          this.close();
          this.loadMenu(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
    },

    // editItem(meja) {
    //   this.dialog = true;
    //   this.inputType = "Edit";
    //   this.nomor = meja.nomor_meja;
    //   this.form.no = meja.nomor_meja;
    //   this.form.status = meja.status;
    // },
    save() {
      this.menu.append("nama_menu", this.form.nama_menu);
      this.menu.append("harga", this.form.harga);
      this.menu.append("kategori", this.kategori);
      this.menu.append("image", this.image);
      this.menu.append("unit", this.form.unit);
      this.menu.append("deskripsi", this.form.deskripsi);

      var url = this.$api + "/Menu/";
      this.load = true;
      this.$http
        .post(url, this.menu, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mesej(response.data.message, "green");
          this.close();
          this.loadMenu(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.mesej(error.response.data.message, "red");
        });
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
      } else {
        this.error_message = "Submit Failed";
        this.color = "red";
        this.snackbar = true;
      }
    },
    imageChanged(e) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = (e) => {
        this.image = e.target.result;
      };
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    mesej(mesej, color) {
      this.error_message = mesej;
      this.color = color;
      this.snackbar = true;
    },
    deleteHandler(id) {
      this.deleteId = id.id;
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
    loadMenu() {
      this.menuMainCourse();
      this.menuSideDish();
      this.menuDrink();
    },
    hitungStok(menu) {
      if (!menu.serving_size || !menu.jumlah) {
        return 0;
      }
      return menu.jumlah / menu.serving_size;
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },

    imageSource() {
      return "http://localhost:8000/" + this.menus.image;
    },
  },
  mounted() {
    // this.readData();
    this.loadMenu();
  },
};
</script>
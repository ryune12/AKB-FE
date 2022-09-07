<template>
<div>
    <!-- Data Table -->
    <v-row>
        <v-col>
            <v-card>
                <v-card-title class="mb-5">
                    Stok Bulanan <v-spacer></v-spacer>
                    <v-btn color="#B71C1C" class="mx-5" @click="modalBulanan = true" dark>
                        Filter</v-btn>
                    <v-btn color="#B71C1C" class="mx-5" dark @click="print_bulanan">
                        Print</v-btn>
                </v-card-title>
                <v-card-subtitle>ITEM MENU : {{ bahan.nama_bahan }} <br />
                    PERIODE : {{ tahun }}
                </v-card-subtitle>
                <v-card-text>
                    <Barchart :height="100" :chart-data="bulananData" />
                </v-card-text>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
                <v-card-title class="mb-5">
                    Stok Custom <v-spacer></v-spacer>
                    <v-btn color="#B71C1C" class="mx-5" dark @click="modalcustom = true">
                        Filter</v-btn>
                    <v-btn color="#B71C1C" class="mx-5" dark @click="print_custom()">
                        Print</v-btn>
                </v-card-title>
                <v-card-subtitle>PERIODE : {{ from }} s/d {{ to }}</v-card-subtitle>
                <v-card-text>
                    <Barchart :height="100" :chart-data="customData" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-dialog transition="dialog-top-transition" v-model="modalcustom" max-width="600">
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="#B71C1C" dark> Filter custom</v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="from_in" label="Tahun" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="#B71C1C" v-model="from_in" @input="menu2 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col>
                            <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="to_in" label="Tahun" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="#B71C1C" v-model="to_in" @input="menu3 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                    <v-btn text @click="filtercustom()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <v-dialog transition="dialog-top-transition" v-model="modalBulanan" max-width="600">
        <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="#B71C1C" dark> Filter Bulanan</v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-autocomplete v-model="id_bahan" label="Item Menu" required :items="bahans" item-value="id" item-text="nama_bahan" outlined class="mt-2" dense height="27px" clearable></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="tanggal" label="Tahun" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="#B71C1C" v-model="tanggal" type="month" @input="menu3 = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                    <v-btn text @click="filterBulanan()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{ error_message }}
    </v-snackbar>
</div>
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
import Barchart from "../assets/Barchart.js";

export default {
    name: "List",
    components: {
        Barchart,
    },
    data() {
        return {
            date: new Date().toISOString().substr(0, 10),
            load: true,
            snackbar: false,
            error_message: "",
            color: "",
            menu1: false,
            menu2: false,
            menu3: false,
            id_bahan: 1,
            colorGreen: "#26A69A",
            colorRed: "#B71C1C",
            colorGrey: "#607D8B",
            modalBulanan: false,
            modalcustom: false,
            bahans: [],
            bahan: [],

            bulananData: {},
            customData: {},

            labels_bulanan: [],
            labels_custom: [],

            reservasi: new FormData(),
            incoming_bulanan: [],
            remaining_bulanan: [],
            waste_bulanan: [],

            incoming_custom: [],
            remaining_custom: [],
            waste_custom: [],

            stok_bulanan: [],
            stok_custom: [],

            tahun: "",
            from: "",
            to: "",
            from_in: "",
            to_in: "",

            tanggal: "",
        };
    },
    methods: {
        print_custom() {
            var WinPrint = window.open(
                "http://127.0.0.1:8000/stok-custom/" +
                encodeURIComponent(this.from_in) +
                "/" +
                encodeURIComponent(this.to_in) +
                "/" +
                sessionStorage.getItem("id"),
                "_blank"
            );
            WinPrint.focus();
            setTimeout(function () {
                WinPrint.print();
            }, 500);
            window.onfocus = function () {
                setTimeout(function () {
                    WinPrint.close();
                }, 500);
            };
        },
        print_bulanan() {
            var WinPrint = window.open(
                "http://127.0.0.1:8000/stok-bulanan/" +
                encodeURIComponent(this.tahun + '-01') +
                "/" +
                this.id_bahan +
                "/" +
                sessionStorage.getItem("id"),
                "_blank"
            );
            WinPrint.focus();
            setTimeout(function () {
                WinPrint.print();
            }, 500);
            window.onfocus = function () {
                setTimeout(function () {
                    WinPrint.close();
                }, 500);
            };
        },
        filtercustom() {
            this.labels_custom = [];
            this.incoming_custom = [];
            this.remaining_custom = [];
            this.waste_custom = [];
            this.get_stok_custom(this.from_in, this.to_in);
            this.modalcustom = false;
        },
        filterBulanan() {
            console.log(this.id_bahan)
            console.log(this.tanggal)
            let res = encodeURIComponent(this.tanggal + '-01');
            let res1 = this.id_bahan;
            this.labels_bulanan = [];
            this.incoming_bulanan = [];
            this.remaining_bulanan = [];
            this.waste_bulanan = [];
            this.get_stok_bulanan(res, res1);
            this.modalBulanan = false;
        },
        readData() {
            this.get_stok_bulanan();
            this.get_bahan();
            this.get_stok_custom();
        },

        get_stok_bulanan(tanggal = null, id_bahan = 1) {
            if (tanggal == null) {
                var today = new Date();
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = yyyy + '-' + mm;
                tanggal = encodeURIComponent(today + '-01');
            }
            var url = this.$api + "/stok-bulanan/" + tanggal + "/" + id_bahan;
            this.get(url, "stok_bulanan");
        },

        get_stok_custom(from = null, to = null) {
            let today;
            let dd, mm, yyyy;
            if (from == null) {
                dd = String(new Date().getDate()).padStart(2, '0');
                mm = String(new Date().getMonth()).padStart(2, '0'); //January is 0!
                yyyy = new Date().getFullYear();

                today = yyyy + '-' + '01' + '-' + '01';
                from = encodeURIComponent(today);
                this.from_in = today;
            }
            if (to == null) {
                dd = String(new Date().getDate()).padStart(2, '0');
                mm = String(new Date().getMonth() + 1).padStart(2, '0'); //January is 0!
                yyyy = new Date().getFullYear();

                today = yyyy + '-' + mm + '-' + dd;
                to = encodeURIComponent(today);
                this.to_in = today;
            }
            var url = this.$api + "/stok-custom/" + from + "/" + to;
            this.get(url, "stok_custom");
        },
        get_bahan() {
            var url = this.$api + "/Bahan";
            this.get(url, "bahan");
        },
        get(url, data) {
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    switch (data) {
                        case "bahan":
                            this.bahans = response.data.data;
                            break;
                        case "stok_bulanan":
                            this.stok_bulanan = response.data.data;
                            this.tahun = response.data.tahun;
                            this.bahan = response.data.bahan;
                            for (let i = 0; i < this.stok_bulanan.length; i++) {
                                this.labels_bulanan.push(this.stok_bulanan[i].Date);
                                this.incoming_bulanan.push(this.stok_bulanan[i].Incoming);
                                this.remaining_bulanan.push(this.stok_bulanan[i].Remaining);
                                this.waste_bulanan.push(this.stok_bulanan[i].Waste);
                            }
                            this.bulananData = {
                                labels: this.labels_bulanan,
                                datasets: [{
                                        label: "Incoming",
                                        backgroundColor: "#f87979",
                                        data: this.incoming_bulanan,
                                    },
                                    {
                                        label: "Remaining",
                                        backgroundColor: this.colorGreen,
                                        data: this.remaining_bulanan,
                                    },
                                    {
                                        label: "Waste",
                                        backgroundColor: "#03a5fc",
                                        data: this.waste_bulanan,
                                    },
                                ],
                            };
                            break;
                        case "stok_custom":
                            this.stok_custom = response.data.bahan;
                            this.from = response.data.start;
                            this.to = response.data.end;
                            for (let i = 0; i < this.stok_custom.length; i++) {
                                this.labels_custom.push(this.stok_custom[i].nama_bahan);
                                this.incoming_custom.push(response.data.incoming[i].jumlah);
                                this.remaining_custom.push(response.data.incoming[i].jumlah - response.data.penjualan[i].jumlah - response.data.waste[i].jumlah);
                                this.waste_custom.push(response.data.waste[i].jumlah);
                            }
                            console.log(response.data.incoming)
                            this.customData = {
                                labels: this.labels_custom,
                                datasets: [{
                                        label: "Incoming Stocks",
                                        backgroundColor: "#f87979",
                                        data: this.incoming_custom,
                                    },
                                    {
                                        label: "Remaining Stocks",
                                        backgroundColor: this.colorGreen,
                                        data: this.remaining_custom,
                                    },
                                    {
                                        label: "Waste Stocks",
                                        backgroundColor: "#03a5fc",
                                        data: this.waste_custom,
                                    },
                                ],
                            };
                            break;
                        default:
                    }
                    this.load = false;
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

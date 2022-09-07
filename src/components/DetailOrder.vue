<template>
<v-main>
    <v-container style="margin-top: -40px">
        <v-row height="100vh" class="d-flex">
            <v-col cols="12" sm="8">
                <v-row>
                    <v-col style="margin: 0px; padding: 0px">
                        <v-card height="183px" width="96%" class="pa-2">
                            <v-card-title>ID Reservasi : #{{ reservasi.id_reservasi }}</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <table width="100%">
                                    <tr>
                                        <th class="d-flex justify-start">Tanggal Reservasi</th>
                                        <td>:</td>
                                        <td class="d-flex justify-end">
                                            {{ reservasi.tanggal_reservasi }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="d-flex justify-start">Sesi</th>
                                        <td>:</td>
                                        <td v-if="(form.sesi = 1)" class="d-flex justify-end">
                                            Lunch
                                        </td>
                                        <td v-else class="d-flex justify-end">Dinner</td>
                                    </tr>
                                    <tr>
                                        <th class="d-flex justify-start">Waiter</th>
                                        <td>:</td>
                                        <td class="d-flex justify-end">{{ waiter[0].nama }}</td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col style="margin: 0px; padding: 0px">
                        <v-card height="183px" width="96%" class="pa-2">
                            <v-card-title>ID Order : #{{
                    this.$router.history.current.params.id
                  }}</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <table width="100%">
                                    <tr>
                                        <th class="d-flex justify-start">No Meja</th>
                                        <td>:</td>
                                        <td class="d-flex justify-end">{{ mejas.nomor_meja }}</td>
                                    </tr>
                                    <tr>
                                        <th class="d-flex justify-start">Cashier</th>
                                        <td>:</td>
                                        <td class="d-flex justify-end">
                                            {{ cashier[0].nama }}
                                        </td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-card width="98%" class="pa-2 mt-4" height="382px">
                        <v-card-title>Detail Orders</v-card-title>
                        <v-divider></v-divider>
                        <v-data-table :items-per-page="4" class="mt-1" :loading="load" :headers="headers" :items="details">
                            <template v-slot:[`item.harga`]="{ item }">
                                <div class="d-flex flex-row">
                                    <span>Rp {{ formatPrice(item.harga) }}</span>
                                </div>
                            </template>
                            <template v-slot:[`item.subtotal`]="{ item }">
                                <div class="d-flex flex-row">
                                    <span>Rp {{ formatPrice(item.subtotal) }}</span>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-row>
            </v-col>
            <v-col cols="4" md="4" height="600px">
                <v-row>
                    <v-card class="pa-2" width="100%">
                        <div>
                            <v-card-title class="d-flex justify-space-between">
                                Orders Summary
                                <v-chip :ripple="false" small v-if="reservasi.status_pembayaran == 'Lunas'" color="green lighten-4 teal--text">
                                    <div class="d-flex flex-row px-3">
                                        <b class="bold">Lunas</b>
                                    </div>
                                </v-chip>
                                <v-chip :ripple="false" small v-else-if="reservasi.status_pembayaran == 'Belum Lunas'" color="red lighten-4 pink--text">
                                    <div class="d-flex flex-row px-3">
                                        <b class="bold">Belum Lunas</b>
                                    </div>
                                </v-chip>
                            </v-card-title>
                        </div>
                        <v-divider></v-divider>
                        <v-card-text>
                            <table width="100%">
                                <tr>
                                    <th class="d-flex justify-start">SubTotal</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ formatPrice(hitungSubtotal) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">Pajak 10%</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ formatPrice(hitungSubtotal * 0.1) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">Service 5%</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ formatPrice(hitungSubtotal * 0.05) }}
                                    </td>
                                </tr>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-row>
                <v-row class="mt-4">
                    <v-card class="pa-2" width="100%">
                        <v-card-title class="d-flex">
                            <div class="d-flex justify-start">Total</div>
                            <v-spacer></v-spacer>
                            <div class="d-flex justify-end">
                                Rp {{ formatPrice(hitung_total) }}
                            </div>
                        </v-card-title>
                    </v-card>
                </v-row>
                <v-row class="mt-4">
                    <v-card class="pa-2" height="283px" width="100%">
                        <v-card-title>Payment Method </v-card-title>
                        <v-divider></v-divider>
                        <v-spacer></v-spacer>
                        <v-card-text v-if="reservasi.status_pembayaran != 'Lunas'" style="text-align: center; padding: auto">{{
                            no_detail
                        }}</v-card-text>
                        <v-card-text v-else>
                            <table width="100%">
                                <tr>
                                    <th class="d-flex justify-start">Nama Customer</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        {{ customer.nama }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">No Hp</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        {{ customer.no_telp }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">E-mail</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        {{ customer.email }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">Payment </th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        {{ reservasi.jenis_pembayaran }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'cash'"> Uang</v-text>
                                        <v-text v-else-if="reservasi.jenis_pembayaran == 'debit'"> No Kartu</v-text>
                                        <v-text v-else> No Kartu</v-text>
                                    </th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'cash'"> Rp {{ formatPrice(reservasi.cash) }}</v-text>
                                        <v-text v-else-if="reservasi.jenis_pembayaran == 'debit'"> {{reservasi.id_kartu}}</v-text>
                                        <v-text v-else> {{reservasi.id_kartu}}</v-text>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'cash'"> Kembalian</v-text>
                                        <v-text v-else-if="reservasi.jenis_pembayaran == 'kredit'"> Valid Date</v-text>
                                    </th>
                                    <td><v-text v-if="reservasi.jenis_pembayaran == 'kredit' || reservasi.jenis_pembayaran == 'cash'"> :</v-text></td>
                                    <td class="d-flex justify-end">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'cash'"> Rp {{ formatPrice(reservasi.cash - hitung_total) }}</v-text>
                                        <v-text v-else-if="reservasi.jenis_pembayaran == 'kredit'">  {{ card.exp_date }}</v-text>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'kredit'"> Nama Pemilik</v-text>
                                    </th>
                                    <td ><v-text v-if="reservasi.jenis_pembayaran == 'kredit'"> :</v-text></td>
                                    <td class="d-flex justify-end">
                                        <v-text v-if="reservasi.jenis_pembayaran == 'kredit'"> {{ card.nama_pemilik }}</v-text>
                                    </td>
                                </tr>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-col>
        </v-row>
        <div class="d-flex">
            <v-spacer></v-spacer>
            <div class="d-flex justify-end align-center">
                <router-link to="/order">
                    <v-btn class="mb-3 mr-3">
                        <v-icon class="mr-3">mdi-keyboard-backspace</v-icon> Back
                    </v-btn>
                </router-link>

                <v-btn color="#B71C1C" class="mb-3 white--text" style="margin-right: -13px" :disabled="reservasi.status_pembayaran != 'Belum Lunas'" @click="dialog = true">
                    <v-icon class="mr-3">mdi-credit-card-check</v-icon> Process Payment
                </v-btn>
            </div>
        </div>
        <v-dialog v-model="dialog" max-width="600" scrollable persistent transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#B71C1C" dark> Select Payment Method</v-toolbar>

                <v-divider></v-divider>

                <v-tabs v-if="reservasi.status_pembayaran == 'Belum Lunas'" fixed-tabs color="#B71C1C">
                    <v-tab @click="jenis_pembayaran = 'Cash'">Cash</v-tab>
                    <v-tab @click="jenis_pembayaran = 'Debit'">Debit</v-tab>
                    <v-tab @click="jenis_pembayaran = 'Kredit'">Kredit</v-tab>
                    <!-- Cash -->
                    <v-tab-item>
                        <v-card-text>
                            <table width="100%">
                                <tr>
                                    <th class="d-flex justify-start">Cash</th>
                                    <td width="5%" class="d-flex justify-start">:</td>
                                    <td>
                                        <v-text-field outlined dense class="ml-4" type="number" v-model="cash"></v-text-field>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start align-center">Kembalian</th>
                                    <td class="d-flex justify-start">:</td>
                                    <td>
                                        <v-text-field outlined dense class="ml-4" v-model="kembalian" readonly></v-text-field>
                                    </td>
                                </tr>
                            </table>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions class="justify-end">
                            <v-btn text @click="(dialog = false), close()">Close </v-btn>
                            <v-btn text @click="saveCash()"> Save </v-btn>
                        </v-card-actions>
                    </v-tab-item>
                    <!-- Debit -->
                    <v-tab-item>
                        <v-card-text>
                            <table width="100%">
                                <tr>
                                    <td class="d-flex justify-end">
                                        <v-text-field class="mt-2 mr-4" v-model="debitcard" outlined dense label="No Kartu" type="number" required></v-text-field>
                                    </td>
                                </tr>
                            </table>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions class="justify-end">
                            <v-btn text @click="(dialog = false), close()">Close </v-btn>
                            <v-btn text @click="saveDebit()"> Save </v-btn>
                        </v-card-actions>
                    </v-tab-item>
                    <!-- Kredit -->
                    <v-tab-item>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="creditcard" outlined dense label="No Kartu" type="number" required ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="nama_pemilik" outlined dense label="Nama Pemilik" type="text" required clearable></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="date" label="Valid Date (YYYY-MM)" outlined dense prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker color="#B71C1C" :min="mindate" v-model="date" type="month" @input="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="cvv" outlined dense label="EDC Code" type="number" required clearable></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions class="justify-end">
                            <v-btn text @click="(dialog = false), close()">Close </v-btn>
                            <v-btn text @click="saveCredit()"> Save </v-btn>
                        </v-card-actions>
                    </v-tab-item>
                </v-tabs>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_cetak" max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Cetak Struk</span>
                </v-card-title>
                <v-card-text> Apakah Anda ingin mencetak struk? </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog_cetak = false">
                        Tidak
                    </v-btn>
                    <v-btn color="red darken-1" text @click="cetak_struk(), dialog_cetak = false">
                        Ya
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>
    </v-container>
</v-main>
</template>

<style scoped>
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
            dialog_cetak: false,
            colorGreen: "#26A69A",
            colorRed: "#B71C1C",
            colorGrey: "#607D8B",
            e6: 1,
            menu1: false,
            menu2: false,
            mindate: new Date().toISOString().substr(0, 10),
            date: "",
            namaRules: [(v) => !!v || "Nama Customer is required"],
            emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
            nohpRules: [(v) => !!v || "No HP is required"],
            sesiRules: [(v) => !!v || "Sesi is required"],
            tanggalRules: [(v) => !!v || "Tanggal is required"],
            error_message: "",
            color: "",
            cash: 0,
            snackbar: false,
            load: true,
            valid: true,
            jenis_pembayaran: "",
            debit: [],
            kredit: [],
            headers: [{
                    text: "ID",
                    align: "start",
                    sortable: true,
                    value: "id",
                },
                {
                    text: "Nama Menu",
                    value: "nama_menu",
                },
                {
                    text: "Harga",
                    value: "harga",
                },
                {
                    text: "Kuantitas",
                    value: "kuantitas",
                },
                {
                    text: "Subtotal",
                    value: "subtotal",
                },
            ],
            no_detail: "Belum ada pembayaran pada Order ini ",
            details: [],
            reservasi: [],
            customer: [],
            card: [],
            debitcard: "",
            creditcard: "",
            nama_pemilik: "",
            cvv: "",
            waiter: [{
                nama: ""
            }],
            mejas: [],
            cashier: [{
                nama: ""
            }],
            form: {
                sesi: null,
                nomor_meja: null,
                tanggal_reservasi: null,
            },
        };
    },
    methods: {
        cetak_struk() {
            console.log("masuk")
            var WinPrint = window.open(
                "http://127.0.0.1:8000/cetak-struk/" +
                this.$router.history.current.params.id + "/" +
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
        getDetail() {
            var url =
                this.$api + "/Order/detail/" + this.$router.history.current.params.id;
            this.get(url, "detail");
        },
        getCashier() {
            var url = this.$api + "/Order/cashier/" + sessionStorage.getItem("id");
            this.get(url, "cashier");
        },
        getWaiter() {
            var url = this.$api + "/Order/waiter/" + this.reservasi.id_reservasi;
            this.get(url, "waiter");
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        get(url, data) {
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    if (data == "detail") {
                        if (response.data.data.length > 0) {
                            this.details = response.data.data;
                            this.form.sesi = this.details[0].sesi;
                            this.form.tanggal_reservasi = this.details[0].tanggal_reservasi;
                        }
                        this.customer = response.data.customer;
                        this.card = response.data.card;
                        console.log(this.customer)
                        this.mejas = response.data.meja;
                        this.reservasi = response.data.reservasi;
                        this.getWaiter();
                        this.getCashier();
                    }
                    if (data == "waiter") {
                        this.waiter = response.data.data;
                    }
                    if (data == "cashier") {
                        this.cashier = response.data.data;
                    }
                    this.load = false;
                })
                .catch((error) => {
                    this.error_message = error.data;
                    console.log(error);
                    this.color = "red";
                    this.snackbar = true;
                });
        },
        saveCash() {
            if (this.cash < this.hitung_total) {
                this.error_message = "Cash tidak cukup";
                this.color = "red";
                this.snackbar = true;
            } else {
                let data = {
                    id_karyawan: sessionStorage.getItem("id"),
                    total: this.hitungSubtotal,
                    tax: this.hitungSubtotal * 0.1,
                    services: this.hitungSubtotal * 0.05,
                    cash: this.cash,
                    jenis_pembayaran: "cash",
                    total_qty: this.hitung_totalqty,
                    total_item: this.details.length,
                    status_pembayaran: "Lunas",
                };
                console.log(data);
                var url = this.$api + "/payment-cash/" + this.$router.history.current.params.id;
                this.put(url, data)
            }
        },
        saveDebit() {
            if (this.debitcard == "") {
                this.error_message = "Masukan Nomor Kartu";
                this.color = "red";
                this.snackbar = true;
            } else {
                let data = {
                    no_kartu: this.debitcard,
                    id_karyawan: sessionStorage.getItem("id"),
                    total: this.hitungSubtotal,
                    tax: this.hitungSubtotal * 0.1,
                    services: this.hitungSubtotal * 0.05,
                    jenis_pembayaran: "debit",
                    total_qty: this.hitung_totalqty,
                    total_item: this.details.length,
                    status_pembayaran: "Lunas",
                };
                console.log(data)
                var url = this.$api + "/payment-debit/" + this.$router.history.current.params.id;
                this.put(url, data)
            }
        },
        saveCredit() {
            if (this.creditcard == "") {
                this.error_message = "Masukan Nomor Kartu";
                this.color = "red";
                this.snackbar = true;
            } else if (this.nama_pemilik == "") {
                this.error_message = "Masukan Nama Pemilik";
                this.color = "red";
                this.snackbar = true;
            } else if (this.cvv == "") {
                this.error_message = "Masukan EDC Code";
                this.color = "red";
                this.snackbar = true;
            } else {
                let data = {
                    no_kartu: this.creditcard,
                    cvv: this.cvv,
                    nama_pemilik: this.nama_pemilik,
                    valid_date: this.date,
                    id_karyawan: sessionStorage.getItem("id"),
                    total: this.hitungSubtotal,
                    tax: this.hitungSubtotal * 0.1,
                    services: this.hitungSubtotal * 0.05,
                    jenis_pembayaran: "kredit",
                    total_qty: this.hitung_totalqty,
                    total_item: this.details.length,
                    status_pembayaran: "Lunas",
                };
                console.log(data)
                var url = this.$api + "/payment-kredit/" + this.$router.history.current.params.id;
                this.put(url, data)
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
                    this.dialog = false;
                    this.dialog_cetak = true;
                    this.getDetail();
                })
                .catch((error) => {
                    this.error_message = error;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
    },
    computed: {
        hitungSubtotal() {
            let Total = 0;
            for (let i = 0; i < this.details.length; i++) {
                Total += this.details[i].subtotal;
            }
            return Total;
        },
        hitung_total() {
            return (
                this.hitungSubtotal +
                this.hitungSubtotal * 0.1 +
                this.hitungSubtotal * 0.05
            );
        },
        kembalian() {
            return "Rp " + this.formatPrice(this.cash - this.hitung_total);
        },
        hitung_totalqty() {
            let Total = 0;
            for (let i = 0; i < this.details.length; i++) {
                Total += this.details[i].kuantitas;
            }
            return Total;
        },
    },
    mounted() {
        this.getDetail();
    },
};
</script>

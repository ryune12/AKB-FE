import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from './store';

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);



const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/admin",
            component: importComponent('DashboardLayout'),
            // beforeEnter(to, from, next) {
            //     // logic here
            //     
            // },
            children: [
                //Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'AKB - Dashboard', requiredAuth: true, },
                    component: importComponent('Dashboard'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                    children: [
                        {
                            path: "/pendapatan",
                            name: "pendapatan",
                            meta: { title: 'AKB - Laporan', requiredAuth: true },
                            component: importComponent('Pendapatan'),
                            beforeEnter: (to, from, next) => {
                                if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                                    next();
                                } else if (sessionStorage.getItem('role') == 'Chef') {
                                    router.push('/bahan')
                                } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                                    router.push('/reservasi')
                                }
                            },
                        },
                        {
                            path: "/pengeluaran",
                            name: "pengeluaran",
                            meta: { title: 'AKB - Laporan', requiredAuth: true },
                            component: importComponent('Pengeluaran'),
                            beforeEnter: (to, from, next) => {
                                if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                                    next();
                                } else if (sessionStorage.getItem('role') == 'Chef') {
                                    router.push('/bahan')
                                } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                                    router.push('/reservasi')
                                }
                            },
                        },
                        {
                            path: "/penjualan",
                            name: "penjualan",
                            meta: { title: 'AKB - Laporan', requiredAuth: true },
                            component: importComponent('Penjualan'),
                            beforeEnter: (to, from, next) => {
                                if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                                    next();
                                } else if (sessionStorage.getItem('role') == 'Chef') {
                                    router.push('/bahan')
                                } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                                    router.push('/reservasi')
                                }
                            },
                        },
                        {
                            path: "/stok",
                            name: "stok",
                            meta: { title: 'AKB - Laporan', requiredAuth: true },
                            component: importComponent('Stok'),
                            beforeEnter: (to, from, next) => {
                                if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                                    next();
                                } else if (sessionStorage.getItem('role') == 'Chef') {
                                    router.push('/bahan')
                                } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                                    router.push('/reservasi')
                                }
                            },
                        },
                    ]
                },
                // Sidebar Admin
                {
                    path: "/reservasi",
                    name: "Reservasi",
                    meta: { title: 'AKB - Reservasi', requiredAuth: true },
                    component: importComponent('Reservasi'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == "Cashier" || sessionStorage.getItem('role') == "Operational Manager") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        }
                    },
                },
                {
                    path: "/reservasi/tambah",
                    name: "Reservasi Tambah",
                    meta: { title: 'AKB - Reservasi', requiredAuth: true },
                    component: importComponent('ReservasiTambah'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == "Cashier" || sessionStorage.getItem('role') == "Operational Manager") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        }
                    },
                },
                {
                    path: "/reservasi/edit/:id",
                    name: "/edit",
                    meta: { title: 'AKB - Reservasi', requiredAuth: true },
                    component: importComponent('ReservasiEdit'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == "Cashier" || sessionStorage.getItem('role') == "Operational Manager") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        }
                    },
                },
                {
                    path: "/order",
                    name: "order",
                    meta: { title: 'AKB - Order', requiredAuth: true },
                    component: importComponent('Order'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == "Cashier" || sessionStorage.getItem('role') == "Operational Manager") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        }
                    },
                },
                {
                    path: "/detail/:id",
                    name: "Detail Order",
                    meta: { title: 'AKB - Detail Order', requiredAuth: true },
                    component: importComponent('DetailOrder'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == "Cashier" || sessionStorage.getItem('role') == "Operational Manager") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        }
                    },
                },
                {
                    path: '/menu',
                    name: 'Menu',
                    meta: { title: 'AKB - Menu', requiredAuth: true },
                    component: importComponent('Menu'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Chef") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/bahan',
                    name: 'Bahan',
                    meta: { title: 'AKB - Bahan', requiredAuth: true },
                    component: importComponent('Bahan'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Chef") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/incoming',
                    name: 'Incoming Stok',
                    meta: { title: 'AKB - Incoming Stok', requiredAuth: true },
                    component: importComponent('Incoming'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Chef") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/waste',
                    name: 'Waste Stok',
                    meta: { title: 'AKB - Waste', requiredAuth: true },
                    component: importComponent('Waste'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Chef") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/pegawai',
                    name: 'Pegawai',
                    meta: { title: 'AKB - Pegawai', requiredAuth: true },
                    component: importComponent('Pegawai'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager' || sessionStorage.getItem('role') == "Owner") {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/bahan')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/meja',
                    name: 'Meja',
                    meta: { title: 'AKB - Meja', requiredAuth: true },
                    component: importComponent('Meja'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Operational Manager') {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier') {
                            router.push('/reservasi')
                        } else {
                            router.push('/reservasi')
                        }
                    },
                },
                {
                    path: '/customer',
                    name: 'Customer',
                    meta: { title: 'AKB - Customer', requiredAuth: true },
                    component: importComponent('Customer'),
                    beforeEnter: (to, from, next) => {
                        if (sessionStorage.getItem('role') == 'Waiter' || sessionStorage.getItem('role') == 'Cashier' || sessionStorage.getItem('role') == 'Operational Manager') {
                            next();
                        } else if (sessionStorage.getItem('role') == 'Owner') {
                            router.push('/dashboard')
                        } else if (sessionStorage.getItem('role') == 'Chef') {
                            router.push('/reservasi')
                        }
                    },
                },
            ]
        },
        {
            path: '/index',
            name: 'index',
            meta: { title: 'index' },
            beforeEnter(to, from, next) {
                // logic here
                if (sessionStorage.getItem('id') != 1) {
                    next();
                } else {
                    router.replace('/dashboard');
                }
            },
            component: importComponent('User/index'),
        },
        // Login
        {
            path: '/login',
            name: 'login',
            meta: { title: 'AKB - Login' },
            beforeEnter(to, from, next) {
                // logic here
                if (sessionStorage.getItem('id')) {
                    sessionStorage.getItem('id') != "" ? router.replace('/dashboard') : router.replace('/');
                } else {
                    next();
                }
            },
            component: importComponent('Login'),
        },
        {
            path: '',
            redirect: '/login'
        },
    ]
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if (to.matched.some(record => record.meta.requiredAuth)) {
        if (sessionStorage.getItem('token')) {
            //user is authenticated
            next();
        }
        else {
            //user is not authenticated
            router.replace('/login')
        }
    } else {
        next() // make sure to always call next()!
    }
})

export default router;
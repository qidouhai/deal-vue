import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./views/Register.vue')
        },
        {
            path: '/product',
            name: 'product',
            component: () => import('./views/Product.vue')
        },
        {
            path: '/shop',
            name: 'shop',
            component: () => import('./views/Shop.vue')
        },
        {
            path: '/item',
            name: 'item',
            component: () => import('./views/Item.vue')
        },
        {
            path: '/cart',
            name: 'cart',
            meta: {
                requireAuth: true
            },
            component: () => import('./views/Cart.vue')
        },
        {
            path: '/buy',
            name: 'buy',
            meta: {
                requireAuth: true
            },
            component: () => import('./views/Buy.vue')
        },
        {
            path: '/pay',
            name: 'pay',
            meta: {
                requireAuth: true
            },
            component: () => import('./views/Pay.vue')
        },
        {
            path: '/order',
            name: 'order',
            meta: {
                requireAuth: true
            },
            component: () => import('./views/Order.vue')
        },
        {
            path: '/order/detail',
            name: 'orderDetail',
            meta: {
                requireAuth: true
            },
            component: () => import('./views/OrderDetail.vue')
        },
        {
            path: '/user',
            name: 'user',
            redirect: '/user/info',
            meta: {
                requireAuth: true
            },
            children: [
                {
                    path: 'info',
                    name: 'userInfo',
                    component: () => import('./components/user/UserInfo.vue')
                },
                {
                    path: 'password',
                    name: 'userPassword',
                    component: () => import('./components/user/UserPassword.vue')
                },
                {
                    path: 'record',
                    name: 'userRecord',
                    component: () => import('./components/user/UserRecord.vue')
                },
                {
                    path: 'address',
                    name: 'userAddress',
                    component: () => import('./components/user/UserAddress.vue')
                }
            ],
            component: () => import('./views/User.vue')
        },
        {
            path: '/store/create',
            name: 'createStore',
            meta: {
                requireAuth: true
            },
            component: () => import('./components/store/CreateStore.vue')
        },
        {
            path: '/store',
            name: 'store',
            redirect: '/store/info',
            meta: {
                requireAuth: true
            },
            children: [
                {
                    path: 'info',
                    name: 'storeInfo',
                    component: () => import('./components/store/StoreInfo.vue')
                }, {
                    path: 'order',
                    name: 'storeOrder',
                    component: () => import('./components/store/StoreOrder.vue')
                },
                {
                    path: 'product',
                    name: 'storeProduct',
                    component: () => import('./components/store/StoreProduct.vue')
                },
                {
                    path: 'punish',
                    name: 'storePunish',
                    component: () => import('./components/store/StorePunish.vue')
                },
                {
                    path: 'statistic',
                    name: 'statistic',
                    component: () => import('./components/store/StoreStatistic.vue')
                }
            ],
            component: () => import('./views/Store.vue')
        },
        {
            path: '/manage',
            name: 'manage',
            redirect: '/manage/report',
            meta: {
                requireAuth: true
            },
            children: [
                {
                    path: 'report',
                    name: 'manageReport',
                    component: () => import('./components/manage/ManageReport.vue')
                },
                {
                    path: 'password',
                    name: 'managePassword',
                    component: () => import('./components/manage/ManagePassword.vue')
                }
            ],
            component: () => import('./views/Manage.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('./views/Error.vue')
        },
        {
            path: '*',
            redirect: '/error'
        }
    ]
})

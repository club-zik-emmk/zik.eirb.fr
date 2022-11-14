import {createRouter, createWebHashHistory} from "vue-router";
import {Router} from "vue-router";
import store from "./store";

type RouteMeta = {
    requiresAuth: boolean;
    requiresAdmin: boolean;
}

type Route = {
    path: string;
    name: string;
    component: any;
    meta?: RouteMeta;
}

const routes: Route[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
    },
    {
        path: "/planning",
        name: "Planning",
        component: () => import("@/views/PlanningView.vue"),
    },
    {
        path: "/book",
        name: "Réserver",
        component: () => import("@/views/BookingView.vue")
    },
    {
        path: "/auth",
        name: "Authentification",
        component: () => import("@/views/AuthView.vue")
    },
    {
        path: "/admin/users",
        name: "Gestion des utilisateurs",
        component: () => import("@/views/admin/UserManagementView.vue"),
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: "/member/me",
        name: "Mon compte",
        component: () => import("@/views/member/MemberView.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/member/events",
        name: "Événements",
        component: () => import("@/views/member/EventsView.vue"),
        meta: {
            requiresAuth: true
        }
    }
];

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta?.requiresAuth && store.state.user.id === "") {
        next({name: "Authentification"});
    } else if (to.meta?.requiresAdmin && !store.state.user?.admin) {
        next({name: "Home"});
    } else {
        next();
    }
});

export default router;
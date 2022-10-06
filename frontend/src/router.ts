import {createRouter, createWebHashHistory} from "vue-router";
import {Router} from "vue-router";

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
        children: [

        ]
    }
];

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
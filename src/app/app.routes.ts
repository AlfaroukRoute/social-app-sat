import { Routes } from "@angular/router";
import { EmptyLayoutComponents } from "./core/layouts/empty-layout/empty-layout.components";
import { LayoutWithNavbarComponents } from "./core/layouts/layout-with-navbar/layout-with-navbar.components";
import { authGuard } from "./core/auth/guards/auth-guard";

export const routes : Routes = [
    {
        path : "auth" ,
        component : EmptyLayoutComponents,
        loadChildren : ()=> import('./core/auth/auth.routes').then(r=>r.routes)
    },
    {
        path : "main" ,
        canActivate : [authGuard],
        component : LayoutWithNavbarComponents,
        loadChildren : ()=> import('./features/main.routes').then(r=>r.routes)
    }
]
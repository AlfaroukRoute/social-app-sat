import { Routes } from "@angular/router";
import { LoginComponents } from "./pages/login/login.components";
import { RegisterComponents } from "./pages/register/register.components";
import { ForgetPasswordComponents } from "./pages/forget-password/forget-password.components";

export const routes : Routes = [
    {path : "login" , component : LoginComponents} ,
    {path : "register" , component : RegisterComponents} ,
    {path : "forget-password" , component : ForgetPasswordComponents} ,
]
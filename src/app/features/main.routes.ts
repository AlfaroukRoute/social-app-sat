import { Routes } from "@angular/router";
import { FeedComponents } from "./feed/feed.components";
import { NotificationComponents } from "./notification/notification.components";
import { ProfileComponents } from "./profile/profile.components";

export const routes : Routes = [
    {path : "feed" , component : FeedComponents} ,
    {path : "notification" , component : NotificationComponents} ,
    {path : "profile" , component : ProfileComponents} ,
]
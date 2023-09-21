import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";

const routes: Routes = [
    { path: "all", component: AppComponent },
    { path: "active", component: AppComponent },
    { path: "completed", component: AppComponent },
    { path: "", redirectTo: "/all", pathMatch: "full" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}

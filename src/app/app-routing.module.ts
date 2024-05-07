import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path:"",
    redirectTo:"/home",
    pathMatch:"full"
  },
  {
    path:"",
    loadChildren:() => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path:"auth",
    loadChildren:() => import('./pages/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path:'juegos',
    loadChildren:() => import('./pages/juegos/juegos.module').then(m=> m.JuegosModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

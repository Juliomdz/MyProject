import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuJuegosComponent } from './menu-juegos/menu-juegos.component';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';

const routes: Routes = [
  {
    path:'',
    component:MenuJuegosComponent
  },
  {
    path:'ahorcado',
    component:AhorcadoComponent
  },
  {
    path:'mayormenor',
    component:MayorMenorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
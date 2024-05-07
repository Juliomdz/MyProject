import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MenuJuegosComponent } from './menu-juegos/menu-juegos.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';

@NgModule({
  declarations: [
    AhorcadoComponent,
    MenuJuegosComponent,
    MayorMenorComponent
  ],
  imports: [
    CommonModule,
    JuegosRoutingModule,
  ],
})
export class JuegosModule { }
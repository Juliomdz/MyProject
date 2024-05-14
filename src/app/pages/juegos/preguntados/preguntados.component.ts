import { Component } from '@angular/core';
import { CountriesApiService } from 'src/app/services/countries-api.service';
import { ToastifyService } from 'src/app/services/toastify.service';
import { SwalService } from 'src/app/services/swal.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as moment from 'moment';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent {
  usuario: any = null;
  listadoPaises: any = [];
  listadoPreguntas: any = [];
  victoria: boolean = false;
  juegoActivo: boolean = false;
  juegoFinalizado: boolean = false;
  textoJuegoFinalizado: string = '¡PERDISTE!';
  puntuacion: number = 0;
  intentos: number = 10;
  preguntaActual: any = null;
  preguntasCargadas: boolean = false;
  currentIndex: number = 0;
  respuestaCorrecta: boolean = false;
  respuestaIncorrecta: boolean = false;

  constructor(
    private apiPaises: CountriesApiService,
    private notifyService: ToastifyService,
    private swalService:SwalService,
    private userService:UserService,
    private firestore:FirestoreService
  ) 
  { }

  async ngOnInit(){
    this.userService.user$.subscribe(user => {
      if(user)
      {
        this.usuario = user
      }
    })

    this.apiPaises.TraerPaises().subscribe((response) => {
      this.listadoPaises = response.map((country: any) => {
        return {
          name: country.translations.spa.official,
          flag: country.flags.png,
        };
      });
      this.ComenzarJuego();
    });
  }

  ComenzarJuego() {
    this.GenerarPregunta();
    this.preguntaActual = this.listadoPreguntas[this.currentIndex];
    this.juegoActivo = true;
  }

  GenerarPregunta() {
    this.listadoPaises.sort(() => Math.random() - 0.5);
    this.listadoPreguntas = this.listadoPaises
      .slice(0, 10)
      .map((country: any) => {
        const option2 = this.listadoPaises[this.GenerarNumeroRandom()].name;
        const option3 = this.listadoPaises[this.GenerarNumeroRandom()].name;
        const option4 = this.listadoPaises[this.GenerarNumeroRandom()].name;
        const options = [country.name, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
        };
      });
    this.preguntasCargadas = true;
  } // end of GenerarPregunta

  GenerarNumeroRandom() {
    return Math.floor(Math.random() * 249);
  } // end of GenerarNumeroRandom

  SeleccionOpcion(opcion: string, event: Event) {
    if (this.juegoActivo) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (opcion === this.preguntaActual.answer) {
        this.puntuacion++;
        this.respuestaCorrecta = true;
        setTimeout(() => {
          this.respuestaCorrecta = false;
        }, 300);
        this.notifyService.showSuccess('¡Adivinaste!', 'Preguntados');
      } else {
        this.respuestaIncorrecta = true;
        setTimeout(() => {
          this.respuestaIncorrecta = false;
        }, 300);
        this.notifyService.showError(
          `No adivinaste!, era ${this.preguntaActual.answer}`,
          'Preguntados'
        );
      }

      if (this.currentIndex < 9) {
        this.currentIndex++;
        setTimeout(() => {
          this.preguntaActual = this.listadoPreguntas[this.currentIndex];
        }, 500);
      }

      if (this.intentos > 0) {
        this.intentos--;
        if (this.intentos === 0) {
          this.juegoActivo = false;
          this.juegoFinalizado = true;
          if (this.puntuacion >= 4) {
            this.victoria = true;
            this.textoJuegoFinalizado = '¡GANASTE!';
            this.swalService.MostrarExito("¡GANASTE!","Has ganado: " + this.puntuacion + " puntos!");
          } else {
            this.swalService.MostrarError('¡PERDISTE!', 'No conseguiste lo minimo para ganar');
          }
          this.CrearResultado();
        }
      }
    }
  } // end of SeleccionOpcion

  ReiniciarJuego() {
    this.GenerarPregunta();
    this.currentIndex = 0;
    this.puntuacion = 0;
    this.intentos = 10;
    this.juegoActivo = true;
    this.victoria = false;
    this.juegoFinalizado = false;
    this.textoJuegoFinalizado = '¡PERDISTE!';
    this.preguntaActual = this.listadoPreguntas[this.currentIndex];
    this.notifyService.showInfo('Juego Reiniciado', 'Preguntados');
  } // end of ReiniciarJuego

  CrearResultado() {
    let resultado = {
      juego:'Preguntados',
      puntaje: this.puntuacion,
      usuario: this.usuario,
      victoria:this.victoria,
      fecha:moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    }
    this.firestore.guardarResultado(resultado);
  }
}
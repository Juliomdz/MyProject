import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastifyService } from 'src/app/services/toastify.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss']
})
export class MayorMenorComponent {
  usuario: any = null;
  botonJuego: string = 'Comenzar Juego';
  victoria: boolean = false;
  juegoActivado: boolean = false;
  juegoFinalizado: boolean = false;
  textoJuegoFinalizado: string = '¡PERDISTE!';
  imagenCarta: string = '../../../../assets/mayor-menor/blanca.png';
  cardList: any = [
    { type: 'trebol', number: 1 },
    { type: 'trebol', number: 2 },
    { type: 'trebol', number: 3 },
    { type: 'trebol', number: 4 },
    { type: 'trebol', number: 5 },
    { type: 'trebol', number: 6 },
    { type: 'trebol', number: 7 },
    { type: 'trebol', number: 8 },
    { type: 'trebol', number: 9 },
    { type: 'trebol', number: 10 },
    { type: 'trebol', number: 11 },
    { type: 'trebol', number: 12 },
    { type: 'trebol', number: 13 },
    { type: 'diamante', number: 1 },
    { type: 'diamante', number: 2 },
    { type: 'diamante', number: 3 },
    { type: 'diamante', number: 4 },
    { type: 'diamante', number: 5 },
    { type: 'diamante', number: 6 },
    { type: 'diamante', number: 7 },
    { type: 'diamante', number: 8 },
    { type: 'diamante', number: 9 },
    { type: 'diamante', number: 10 },
    { type: 'diamante', number: 11 },
    { type: 'diamante', number: 12 },
    { type: 'diamante', number: 13 },
    { type: 'corazon', number: 1 },
    { type: 'corazon', number: 2 },
    { type: 'corazon', number: 3 },
    { type: 'corazon', number: 4 },
    { type: 'corazon', number: 5 },
    { type: 'corazon', number: 6 },
    { type: 'corazon', number: 7 },
    { type: 'corazon', number: 8 },
    { type: 'corazon', number: 9 },
    { type: 'corazon', number: 10 },
    { type: 'corazon', number: 11 },
    { type: 'corazon', number: 12 },
    { type: 'corazon', number: 13 },
  ];
  cartasAAdivinar: any = [];
  puntuacion: number = 0;
  intentos: number = 10;
  currentCard: any = null;
  currentNumber: number = 0;
  indiceActual: number = 0;

  constructor(
    private notifyService: ToastifyService,
    public userService:UserService,
    private swalService:SwalService,
    private firestore:FirestoreService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      if(user)
      {
        this.usuario = user
      }
    })
  }

  IniciarJuego() {
    this.intentos = 10;
    this.victoria = false;
    this.juegoActivado = true;
    this.juegoFinalizado = false;
    this.textoJuegoFinalizado = '¡PERDISTE!';
    this.puntuacion = 0;
    this.indiceActual = 0;
    this.botonJuego = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cartasAAdivinar = this.cardList.slice(0, 11);
    this.currentCard = this.cartasAAdivinar[this.indiceActual];
    this.currentNumber = this.currentCard.number;
    this.imagenCarta = `/assets/mayor-menor/${this.currentCard.type}_${this.currentCard.number}.png`;
  }

  DeterminarMayorMenor(mayorMenor: string) {
    const previousNumber: number = this.currentNumber;
    this.indiceActual++;
    this.intentos--;
    this.currentCard = this.cartasAAdivinar[this.indiceActual];
    this.currentNumber = this.currentCard.number;
    this.imagenCarta = `/assets/mayor-menor/${this.currentCard.type}_${this.currentCard.number}.png`;

    switch (mayorMenor) {
      case 'menor':
        if (previousNumber > this.currentNumber) {
          this.puntuacion++;
          this.notifyService.showSuccess(
            '¡Muy bien, es MENOR!',
            'Mayor o Menor'
          );
        } else if (previousNumber === this.currentNumber) {
          this.intentos++;
          this.notifyService.showInfo('Las cartas son iguales', 'Mayor o Menor');
        } else {
          this.notifyService.showError('No acertaste', 'Mayor o Menor');
        }
        break;
      case 'mayor':
        if (previousNumber < this.currentNumber) {
          this.puntuacion++;
          this.notifyService.showSuccess(
            '¡Muy bien, es MAYOR!',
            'Mayor o Menor'
          );
        } else if (previousNumber === this.currentNumber) {
          this.intentos++;
          this.notifyService.showInfo('Las cartas son iguales', 'Mayor o Menor');
        } else {
          this.notifyService.showError('No acertaste', 'Mayor o Menor');
        }
        break;
    }

    if (this.indiceActual === 10) {
      this.juegoActivado = false;
      this.juegoFinalizado = true;
      if (this.puntuacion >= 3) {
        this.victoria = true;
        this.textoJuegoFinalizado = '¡GANASTE!';
        this.swalService.MostrarExito("GANASTE","Has ganado: " + this.puntuacion + " puntos!");
      } else {
        this.swalService.MostrarError("PERDISTE","No conseguiste un minimo de 3 puntos!");
      }
      this.CrearResultado();
    }
  }

  CrearResultado() {
    let resultado = {
      juego:'MayorMenor',
      puntaje: this.puntuacion,
      usuario: this.usuario,
      victoria:this.victoria,
      fecha:moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    }

    this.firestore.guardarResultado(resultado);
  }
}
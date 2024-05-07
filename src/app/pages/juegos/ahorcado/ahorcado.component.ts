import { Component } from '@angular/core';
import * as moment from 'moment';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastifyService } from 'src/app/services/toastify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss']
})
export class AhorcadoComponent {

  usuario:any;
  letras: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  listOfWords: string[] = [
    'PERRO',
    'SAPO',
    'GATO',
    'MARCA',
    'COLGADO',
    'EMPRESA',
    'CURSO',
    'SOFTWARE',
    'LENGUAJE'
  ];
  victoria: boolean = false;
  juegoActivado: boolean = true;
  intentos: number = 6;
  puntuacion: number = 0;
  imagen: number | any = 0;
  palabra: string = '';
  palabraSeleccionada: string[] = [];
  botonReinicio = 'JUGAR OTRA'

  constructor(
    private toastService: ToastifyService,
    public userService: UserService,
    private firestore:FirestoreService) 
    { }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      if(user)
      {
        this.usuario = user
      }
    })
    this.palabra = this.listOfWords[Math.round(Math.random() * (this.listOfWords.length - 1))];
    this.palabraSeleccionada = Array(this.palabra.length).fill('_');
  }

  restartGame() {
    this.palabra =this.listOfWords[Math.round(Math.random() * (this.listOfWords.length - 1))];
    this.palabraSeleccionada = Array(this.palabra.length).fill('_');
    this.juegoActivado = true;
    this.intentos = 6;
    if(this.puntuacion == 0)
    {
      this.puntuacion = 0
    }
    this.imagen = 0;
    this.victoria = false;
    this.toastService.showInfo('Juego reiniciado', 'Ahorcado');
  }

  sendLetter(letraSeleccionada: string) {
    let banderaLetra: boolean = false;
    let gano: boolean = false;

    if (this.juegoActivado) {
      const letraYaSeleccionada: boolean = this.palabraSeleccionada.some(
        (c) => c === letraSeleccionada
      );
      for (let i = 0; i < this.palabra.length; i++) {
        const letraPalabra = this.palabra[i];
        if (letraPalabra === letraSeleccionada && !letraYaSeleccionada) {
          this.palabraSeleccionada[i] = letraSeleccionada;
          banderaLetra = true;
          this.puntuacion++;
          gano = this.palabraSeleccionada.some((guion) => guion == '_');
          if (!gano) {
            this.imagen = this.imagen + '_vic';
            this.juegoActivado = false;
            this.victoria = true;
            this.toastService.showSuccess('Desea jugar de vuelta?', 'GANASTE');
            this.CrearResultado();
            break;
          }
        }
      }

      if (!banderaLetra && !letraYaSeleccionada) {
        if (this.intentos > 0) {
          this.intentos--;
          this.imagen++;
          this.toastService.showError('¡NO adivinaste!', 'Ahorcado');
          if (this.intentos === 0) {
            this.toastService.showError('PERDISTE', 'Ahorcado');
            this.botonReinicio = 'REINICIAR JUEGO'
            this.juegoActivado = false;
            this.CrearResultado();
          }
        }

        if (this.puntuacion > 0) {
          this.puntuacion--;
        }
      } else if (letraYaSeleccionada) {
        this.toastService.showWarning('La letra ya fue adivinada', 'Ahorcado');
      } else if (banderaLetra) {
        if(!this.victoria) {
          this.toastService.showSuccess('¡Adivinaste!', 'Ahorcado');
        }
      }
    } else {
      this.toastService.showInfo(
        '¿Quieres seguir jugando?, reinicia el juego!',
        'Ahorcado'
      );
    }
  }

  CrearResultado()
  {
    const resultado = {
      juego:'Ahorcado',
      puntaje: this.puntuacion,
      usuario: this.usuario,
      victoria:this.victoria,
      fecha:moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    }

    this.firestore.guardarResultado(resultado)
  }
}
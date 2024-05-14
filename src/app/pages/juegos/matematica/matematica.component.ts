import { Component,OnDestroy } from '@angular/core';
import { SwalService } from 'src/app/services/swal.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastifyService } from 'src/app/services/toastify.service';
import * as moment from 'moment';

@Component({
  selector: 'app-matematica',
  templateUrl: './matematica.component.html',
  styleUrls: ['./matematica.component.scss']
})
export class MatematicaComponent implements OnDestroy {
  usuario:any = null
  juegoActivo:boolean = false
  victoria:boolean = false;
  tiempo:number = 30
  puntuacion:number = 0
  juegoFinalizado:boolean = false
  textoJuegoFinalizado:string = '¡PERDISTE!'
  opciones:any 
  a:number = 0
  b:number = 0
  operador:string = ''
  respuestaCorrecta:boolean = false
  respuestaIncorrecta:boolean = false
  textoBotonJuego:string = 'Comenzar Juego'
  yaJugo:boolean = true;
  timer:any

  constructor(
    private notifyService: ToastifyService,
    private swalService:SwalService,
    private userService:UserService,
    private firestore:FirestoreService
  ) 
  { }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      if(user)
      {
        this.usuario = user
      }
    })

    this.GenerarCalculoMatematico()
    this.opciones = this.GenerarOpciones().sort(() => Math.random() - 0.5);
  }

  IniciarJuego()
  {
    if(this.yaJugo)
    {
      this.yaJugo = false
      this.juegoActivo = true
      this.textoBotonJuego = "Reiniciar Juego"
      this.GenerarCalculoMatematico()
      this.opciones = this.GenerarOpciones().sort(() => Math.random() - 0.5);
      this.IniciarContador()
    }
    else
    {
      this.ReiniciarJuego()
    }
  }

  ReiniciarJuego()
  {
    this.juegoFinalizado = false
    this.juegoActivo = true
    this.victoria = false
    this.puntuacion = 0
    this.tiempo = 30
    this.textoJuegoFinalizado = '¡PERDISTE!'
    this.GenerarCalculoMatematico()
    this.opciones = this.GenerarOpciones().sort(() => Math.random() - 0.5);
    this.IniciarContador()
    this.notifyService.showInfo('Juego Reiniciado', 'Destreza Matematica');
  }

  IniciarContador()
  {
    this.timer = setInterval(() => {
      this.tiempo--
      if(this.tiempo === 0)
      {
        clearInterval(this.timer);
        this.TiempoTerminado()
      }
    },1000)
  }

  GenerarCalculoMatematico()
  {
    this.a = Math.floor(Math.random() * 100);
    this.b = Math.floor(Math.random() * 100);
    this.operador = Math.floor(Math.random() * 2) === 0 ? '+' : '-';
  }

  GenerarOpciones()
  {
    const respuestaCorrecta = this.EvaluarOperacion();

    return [
      respuestaCorrecta,
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
  }

  EvaluarOperacion()
  {
    let resultado = 0

    switch (this.operador) {
      case '+':
        resultado = this.a + this.b;
        break;
      case '-':
        resultado = this.a - this.b;
        break;
    }

    return resultado;
  }

  Resolver(respuesta:number,event:Event) {
    if(this.juegoActivo)
    {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (respuesta === this.EvaluarOperacion()) {
        this.puntuacion++;
        this.respuestaCorrecta = true;
        setTimeout(() => {
          this.respuestaCorrecta = false;
        }, 300);
        this.notifyService.showSuccess('¡Correcto!', 'Destreza Matematica');
      } else {
        this.respuestaIncorrecta = true;
        setTimeout(() => {
          this.respuestaIncorrecta = false;
        }, 300);
        this.notifyService.showError(
          `¡Incorrecto!, era ${respuesta}`,
          'Destreza Matematica'
        );
      }

      setTimeout(() => {
        this.GenerarCalculoMatematico();
        this.opciones = this.GenerarOpciones().sort(() => Math.random() - 0.5);
      }, 400);
    }
  }

  TiempoTerminado()
  {
    this.juegoActivo = false;
    this.juegoFinalizado = true;
    if(this.puntuacion >= 7)
    {
      this.textoJuegoFinalizado = '¡GANASTE!'
      this.victoria = true
      this.swalService.MostrarExito("¡GANASTE!",'¡Has acertado ' + this.puntuacion + ' puntos!')
    }
    else
    {
      this.swalService.MostrarError('¡PERDISTE!', 'No conseguiste lo minimo para ganar');
    }
    this.CrearResultado()
  }

  CrearResultado() {
    let resultado = {
      juego:'Destreza Matematica',
      puntaje: this.puntuacion,
      usuario: this.usuario,
      victoria:this.victoria,
      fecha:moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    }

    this.firestore.guardarResultado(resultado);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SwalService } from './swal.service';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap,filter } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<any>;
  seLogueo:boolean = false;
  esAdmin:boolean = false;

  constructor(private swal:SwalService,
    private router:Router,
    private afAuth:AngularFireAuth,
    private afStore:AngularFirestore
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user) {
            this.seLogueo = true;
            return this.afStore.doc<any>(`usuarios/${user.uid}`).valueChanges();
          }
          else {
            return of(null);
          }
        })
      );
  }


  async Login({email,clave}:any)
  {
    return this.afAuth.signInWithEmailAndPassword(email,clave)
  }

  SignOut()
  {
    this.afAuth.signOut().then(() =>{
      this.seLogueo = false;
      this.esAdmin = false;
      this.swal.MostrarExito("Seras redirigido...","Se ha cerrado la sesion con exito!").then(() => {
        this.router.navigate([''])
      })
    }).catch((error) => {
      this.swal.MostrarError("¡Se produjo un error!",this.ObtenerMensajeError(error.errorCode))
      console.log(error)
    })
  }

  async RegistrarUsuario(usuario:any)
  {
      await this.afAuth.createUserWithEmailAndPassword(usuario.email,usuario.clave).then((data) =>{
        this.afStore.collection('usuarios').doc(data.user?.uid).set({
        idUsuario: data.user?.uid,
        nombre:usuario.nombre,
        email:usuario.email,
        registradoEn:moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
        rol:"Usuario"
      })
    }).catch((error) => {
      this.swal.MostrarError("¡ERROR!",this.ObtenerMensajeError(error.errorCode))
    })
  }

  GuardarLogUsuario(data:any)
  {
    return this.afStore.collection("RegistroIngresos").add(data);
  }

  ObtenerMensajeError(errorCode: string): string {

    let mensaje: string = '';

    switch (errorCode) {
      case 'auth/operation-not-allowed':
        mensaje = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        mensaje = 'El email ya está registrado.';
        break;
      case 'auth/user-not-found':
        mensaje = 'El usuario no existe.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El email no es valido.';
        break;
      case 'auth/wrong-password':
        mensaje = 'La contraseña es inválida';
        break;
      default:
        mensaje = 'Se produjo un error';
        break;
    }
    return mensaje;
  } 
}
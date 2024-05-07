import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore:AngularFirestore) { }
  
  traerColeccion(nombreDeLaColeccion:string){
    return this.firestore.collection<any>(nombreDeLaColeccion).valueChanges();
  }

  guardarResultado(resultado:any)
  {
    this.firestore.collection<any>('resultadosJuegos').add(resultado);
  }
}
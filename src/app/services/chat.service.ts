import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afStore:AngularFirestore,private userService:UserService) { }

  TraerChats()
  {
    const col = this.afStore.collection("chats", (ref:any) => ref.orderBy('fecha', 'asc'));
    return col.valueChanges();
  }

  GuardarChat(texto:any)
  {
    this.afStore.collection<any>('chats').add(texto);
  }
}

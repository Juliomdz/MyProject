import { Component} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { SwalService } from 'src/app/services/swal.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  usuario:any = null
  mensajesTraidos: any[] = []
  mensajeAEnviar = ""

  constructor(private chatService: ChatService, 
    public userService: UserService,
    private swal:SwalService,
    private router:Router) {}
  
  ngOnInit() {
    this.userService.user$.subscribe((user:any) => {
      if(user){
        this.usuario = user
      }
      else{
        this.router.navigate([''])
      }
    })

    this.chatService.TraerChats().subscribe(mensajes => {
      this.mensajesTraidos = mensajes;
      setTimeout(() => {
        this.scrollToTheLastElementByClassName();
      }, 300);
    })
  }

  EnviarMensaje() {
    if(this.mensajeAEnviar.trim() != "")
    {
      const mensaje = {
        usuario:this.usuario,
        mensaje:this.mensajeAEnviar,
        fecha:moment().format('MMMM Do YYYY, h:mm:ss a')
      }
  
      this.chatService.GuardarChat(mensaje);
      this.mensajeAEnviar = "";
      this.scrollToTheLastElementByClassName();
    }
    else{
      this.swal.MostrarError("¡ERROR!","Asegurese de escribir algo")
    }
  }

  scrollToTheLastElementByClassName(){
    let elements = document.getElementsByClassName('mensajes');
    let ultimo:any = elements[(elements.length - 1)];
    let toppos = ultimo.offsetTop;
    //@ts-ignore
    document.getElementById('card-body').scrollTop = toppos;
  }
}

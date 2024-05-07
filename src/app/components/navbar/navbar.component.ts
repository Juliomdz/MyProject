import { Component, OnInit,Output,EventEmitter} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  usuario:any = null
  chatActivado = false;
  @Output() ActivarChat = new EventEmitter<boolean>();

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((user:any) => {
      if(user){
        this.usuario = user
      }
      else{
        this.usuario = null
      }
    }) 
  }

  CerrarSesion()
  {
    Swal.fire({
      title:"ATENCIÓN",
      text: "¿Estas seguro que desea cerrar la sesion?",
      showCancelButton: true,
      confirmButtonText: 'Salir',
      confirmButtonColor: "red",
      cancelButtonText:"Cancelar",
      cancelButtonColor:"blue",
      icon:"question"
    }).then((res) => {
      if(res.isConfirmed){
        this.chatActivado = false
        this.userService.SignOut()
      }
      else{
        Swal.fire('Se cancelo la operación', '', 'info')
      }
    })
  }

  MostrarChat()
  {
    this.chatActivado = !this.chatActivado;
    this.ActivarChat.emit(this.chatActivado)
  }
}
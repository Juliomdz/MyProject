import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SwalService } from 'src/app/services/swal.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  formRegister:FormGroup
  usuario:any

  ngOnInit(): void {
    this.angularFireAuth.user$.subscribe((user:any) =>{
      if(user){
        this.router.navigate([''])
      }
    });
  }

  constructor(private router:Router,private formBuilder:FormBuilder,private angularFireAuth:UserService,private swal:SwalService) {
    this.formRegister = this.formBuilder.group({
      nombre: ['',[Validators.required,this.ValidadorEspacio]],
      clave: ['',[Validators.required,Validators.minLength(6)]],
      email:['', [Validators.email, Validators.required]]
    });
  }

  async Registro()
  {
    const user = this.formRegister.value
    this.angularFireAuth.RegistrarUsuario(user).then(() => {
      this.angularFireAuth.user$.subscribe((user) => {
        if (user) {
          this.usuario = user;
          this.CrearLogUsuario();
        }
      })
      this.swal.MostrarExito("EXITO","¡Has sido registrado con exito!")
    })
  }

  private ValidadorEspacio(control: AbstractControl): null | object {
    const nombre = control.value;
    const spaces = nombre.includes(' ');

    return spaces ? { containsSpaces: true } : null; 
  }

  
  CrearLogUsuario()
  {
    const log= {
      fecha:moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
      usuario: this.usuario
    }

    this.angularFireAuth.GuardarLogUsuario(log)
  }
}
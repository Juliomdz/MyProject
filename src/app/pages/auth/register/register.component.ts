import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SwalService } from 'src/app/services/swal.service';
import { Router } from '@angular/router';

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
        this.usuario = user
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

  Registro()
  {
    const user = this.formRegister.value
    this.angularFireAuth.RegistrarUsuario(user)
  }

  private ValidadorEspacio(control: AbstractControl): null | object {
    const nombre = control.value;
    const spaces = nombre.includes(' ');

    return spaces ? { containsSpaces: true } : null; 
  }
}

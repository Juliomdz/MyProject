import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  MostrarError(titulo:string,mensaje:string)
  {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon:"error",
    })
  }

  MostrarExito(titulo:string,mensaje:string)
  {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon:"success",
      showConfirmButton: false,
      timer:2000
    })
  }
}

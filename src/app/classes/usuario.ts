export class Usuario {
    email:string
    clave:string
    nombreUsuario:string
    fechaRegistrado:number
    rol:string

    constructor() {
        this.nombreUsuario = '';
        this.email = '';
        this.clave = '';
        this.fechaRegistrado = Date.now();
        this.rol = "Usuario"
    }
}

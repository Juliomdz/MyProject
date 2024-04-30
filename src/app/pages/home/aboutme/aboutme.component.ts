import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.scss']
})
export class AboutmeComponent {

  perfil:any;
  urlApi:string = "https://api.github.com/users/Juliomdz";

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
      this.http.get(this.urlApi).subscribe(res => this.perfil = res);
  }

}

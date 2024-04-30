import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-juegos',
  templateUrl: './menu-juegos.component.html',
  styleUrls: ['./menu-juegos.component.scss']
})
export class MenuJuegosComponent implements OnInit {

  user:any

  constructor(private userService:UserService)
  { }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if(user)
      {
        this.user = user
      }
    })
  }

}

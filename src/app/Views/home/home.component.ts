import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export default class HomeComponent{
  userInfo: any = {};
  name = signal<string>('');
  hiddenThings = signal<boolean>(false);
  partidas: any[] = [];

  constructor(private userService: UserService, private router: Router, 
    private cookies: CookieService, private gameService: GameService){
    }

  ngOnInit(): void{
    this.userService.getUserInfo().subscribe(
      (response) =>{
        this.userInfo = response.data;
        this.name.set(response.data.name);
        this.hiddenThings.set(true);
      },
      (error) => {
        console.log(error);
      }
    );

    this.gameService.getHistorial().subscribe(
      (response) =>{
        this.partidas = response.partidas;
      },
      (error) =>{
        console.error(error.error);
      }
    )
  }

  iniciarPartida() {
    this.gameService.crearPartida().subscribe(
      (response) => {
        console.log(response);
        if (response.game_id && response.game_id.id) {
          console.log(response);
          this.cookies.set('gameId', response.game_id.id);
        }

        if (response.message === 'Has creado una nueva partida, espera a que alguien se una') {
          this.router.navigate(['/waitingPlayers']);
        } else if (response.message === 'Te has unido a una partida pendiente como jugador 2') {
          this.cookies.set('turnoInicial', response.turnoName.name);
          this.router.navigate(['/game']);
          console.log(response);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  
  logout(){
    this.userService.logout('').subscribe(
      (response) =>{
        this.hiddenThings.set(false);
        this.cookies.delete('token');
        window.location.reload();
      },
      (error) =>{
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    )
  }
}

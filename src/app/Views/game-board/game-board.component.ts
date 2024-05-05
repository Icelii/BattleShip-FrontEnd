import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import Swal from 'sweetalert2';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
(window as any).Pusher = Pusher

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css'
})
export default class GameBoardComponent {
  tablero: string[][] = [[]];
  tableroEnemigo: string[][] = [[]];
  cellStates: boolean[][] = [[]];
  turno = signal<string>('');
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  letters: string[] = ['A', 'B', 'C', 'D', 'E'];
  userInfo: any = {};
  name = signal<string>('');

  constructor(private gameService: GameService, private router:Router, private cookies: CookieService, private userService: UserService) {
  }

  echo: Echo = new Echo({
    broadcaster: 'pusher',
    key: 'battleship_key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    disableStats: true,
    forceTLS: false,
    cluster: 'mt1',
  }); 

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(
      (response) =>{
        this.userInfo = response.data;
        this.name.set(response.data.name);
      },
      (error) => {
        console.log(error);
      }
    );

    this.turno.set(this.cookies.get('turnoInicial'));
    this.turnoEvent();
    this.movimientoEvent();
    this.terminarPartidaEvent();
    this.generarTableroEnemigo();
    const gameId = Number(this.cookies.get('gameId'));

    if(gameId){
      this.gameService.generarTablero(gameId).subscribe(
        (response) =>{
          this.tablero = JSON.parse(response.tablero.tablero_estado);
        },
        (error) =>{
          console.error('Error al generar el tablero:', error);
        }
      )
    } else{
      console.error('No se encontro la partida, error en ID');
    }
  }

  accion(x: number, y: number){
    const gameId = Number(this.cookies.get('gameId'));
    this.gameService.movimiento(gameId, x, y).subscribe(
      (response) =>{
        if (response.message === '¡Has golpeado un barco!') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.tablero[x][y] = 'K';
        } else if (response.message === 'Solo hay agua en esta posición.') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.tableroEnemigo[x][y] = 'F';
        }
        else if (response.message === '¡Felicidades! Has hundido todos los barcos del oponente. ¡Has ganado!.') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      (error) =>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500
        });
        console.log(error.error)
      }
    )
  }

  movimientoEvent(){
    this.echo.channel('Movimiento').listen('movimiento', (data: any) =>{
      if(data.message == '¡Felicidades! Has hundido todos los barcos del oponente. ¡Has ganado!'){}
        this.recargarTablero();
        this.recargarTablero2();
    });
    this.echo.connect();
  }

  turnoEvent(){
    this.echo.channel('Turno').listen('turno', (data: any) => {
      console.log(data.turno);
      console.log(data.username);
      this.cookies.delete('turnoInicial');
      this.turno.set(data.username);
    });
    this.echo.connect();
  }

  terminarPartidaEvent(){
    this.echo.channel('finish').listen('terminarparida', (data: any) => {
      Swal.fire({
        title: 'El juegoFinalizo',
        text: 'Ganador\n'+ data.username,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      this.router.navigate(['/home']);
    });
    this.echo.connect();
  }

  generarTableroEnemigo(){
    const gameId = Number(this.cookies.get('gameId'));
    if(gameId){
      this.gameService.generarTableroEnemigo(gameId).subscribe(
        (response) =>{
          this.tableroEnemigo = JSON.parse(response.tablero.tablero_estado);
        },
        (error) =>{
          console.error('Error al generar el tablero:', error);
        }
      )
    }else {
      console.error('No se encontro la partida, error en ID');
    }
  }

  recargarTablero(){
    const gameId = Number(this.cookies.get('gameId'));

    if(gameId){
      this.gameService.generarTablero(gameId).subscribe(
        (response) =>{
          this.tablero = JSON.parse(response.tablero.tablero_estado);
        },
        (error) =>{
          console.error('Error al generar el tablero:', error);
        }
      )
    } else{
      console.error('ID del juego no disponible');
    }
  }

  recargarTablero2(){
    const gameId = Number(this.cookies.get('gameId'));

    if(gameId){
      this.gameService.generarTableroEnemigo(gameId).subscribe(
        (response) =>{
          this.tableroEnemigo = JSON.parse(response.tablero.tablero_estado);
        },
        (error) =>{
          console.error('Error al generar el tablero:', error);
        }
      )
    } else{
      console.error('ID del juego no disponible');
    }
  }

  logout(){
    this.userService.logout('').subscribe(
      (response) =>{
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

  ngOnDestroy(): void{
  }
}

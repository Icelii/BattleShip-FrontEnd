import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
(window as any).Pusher = Pusher;

@Component({
  selector: 'app-search-players',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-players.component.html',
  styleUrl: './search-players.component.css'
})
export default class SearchPlayersComponent {

  constructor(private cookies: CookieService, private router: Router){}

  echo: Echo = new Echo({
    broadcaster: 'pusher',
    key: 'battleship_key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    disableStats: true,
    forceTLS: false,
    cluster: 'mt1',
  }); 

  ngOnInit(): void{
    this.esperandoJugador();
  }

  esperandoJugador(){
    this.echo.channel('match').listen('Buscarpartida', (data: any) =>{
      this.router.navigate(['/game']);
      this.cookies.set('gameId', data.registroid.toString());
      this.cookies.set('turnoInicial', data.username);
    });
    this.echo.connect();
  }
}

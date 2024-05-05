import { Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SpinnerComponent from './Layouts/spinner/spinner.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'juegoRemeFront';
  changeIconVolumen = signal<boolean>(false);
  isPlaying: boolean = false;
  
  playMusic(audio: HTMLAudioElement){
    this.isPlaying = !this.isPlaying;

    if(this.isPlaying){
      this.changeIconVolumen.set(true);
      audio.play();
    } else{
      this.changeIconVolumen.set(false);
      audio.pause();
    }
  }
}

import { Component } from '@angular/core';
import { SwalService } from 'src/app/services/swal.service';
import { ToastifyService } from 'src/app/services/toastify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss']
})
export class AhorcadoComponent {

  user: any = null;
  buttonLetters: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  listOfWords: string[] = [
    'PERRO',
    'SERPIENTE',
    'KOALA',
    'SAPO',
    'GATO'
  ];
  victory: boolean = false;
  activeGame: boolean = true;
  attempts: number = 6;
  score: number = 0;
  imagen: number | any = 0;
  word: string = '';
  hyphenatedWord: string[] = [];

  constructor(
    private toastService: ToastifyService,
    public loginService: UserService,
    private swalService: SwalService) 
    { }

  ngOnInit(): void {
    this.word =
    this.listOfWords[
    Math.round(Math.random() * (this.listOfWords.length - 1))
    ];
    this.hyphenatedWord = Array(this.word.length).fill('_');
  }

  restartGame() {
    this.word =
      this.listOfWords[
      Math.round(Math.random() * (this.listOfWords.length - 1))
      ];
    this.hyphenatedWord = Array(this.word.length).fill('_');
    this.activeGame = true;
    this.attempts = 6;
    this.score = 0;
    this.imagen = 0;
    this.victory = false;
    this.resetClassBotones();
    this.toastService.showInfo('Reiniciando partida...', 'Ahorcado');
  } // end of restartGame

  resetClassBotones() {
    for (let index = 0; index < this.buttonLetters.length; index++) {
      const elemento = document.getElementById("boton" + index) as HTMLButtonElement;
      elemento?.classList.remove("btn-error");
      elemento?.classList.remove("btn-acierto");
      elemento?.classList.add("btn-letra");
      if (elemento != null) {
        elemento.disabled = false;
      }
    }
  }

  sendLetter(letter: string, idDelBoton: number) {
    let letterFlag: boolean = false;
    let winGame: boolean = false;

    if (this.activeGame) {
      const alreadyGuessedLetterFlag: boolean = this.hyphenatedWord.some(
        (c) => c === letter
      );
      for (let i = 0; i < this.word.length; i++) {
        const wordLetter = this.word[i];
        if (wordLetter === letter && !alreadyGuessedLetterFlag) {
          this.hyphenatedWord[i] = letter;
          letterFlag = true;
          this.score++;
          winGame = this.hyphenatedWord.some((hyphen) => hyphen == '_');
          if (!winGame) {
            this.imagen = this.imagen + '_vic';
            this.activeGame = false;
            this.victory = true;
            this.toastService.showSuccess('Excelente Ganaste!!', 'Ahorcado');
            break;
          }
        }
      }

      if (!letterFlag && !alreadyGuessedLetterFlag) {
        if (this.attempts > 0) {
          this.attempts--;
          this.imagen++;
          this.toastService.showError('¡Te equivocaste!', 'Ahorcado');
          const elemento = document.getElementById("boton" + idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-error");
          if (elemento != null) {
            elemento.disabled = true;
          }
          if (this.attempts === 0) {
            this.toastService.showError('Mejor suerte la proxima. Perdiste.', 'Ahorcado');
            this.activeGame = false;
          }
        }

        if (this.score > 0) {
          this.score--;
        }
      } else if (alreadyGuessedLetterFlag) {
        this.toastService.showWarning('Esta letra ya fue utilizada', 'Ahorcado');
      } else if (letterFlag) {
        if (!this.victory) {
          this.toastService.showSuccess('Acertaste!!', 'Ahorcado');
          const elemento = document.getElementById("boton" + idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-acierto");
          if (elemento != null) {
            elemento.disabled = true;
          }
        }
      }
    } else {
      this.toastService.showWarning(
        '¿Quieres volver a jugar?',
        'Ahorcado', 'warning'
      );
    }
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Destinazione {
  nome: string;
  descrizione: string;
  immagine: string;
  icona: string;
}

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage {
  destinazioni: Destinazione[] = [
    {
      nome: 'Mare',
      descrizione: 'Costa Smeralda',
      immagine: 'images/homepage/sea_location_1.png',
      icona: 'fa-solid fa-water'
    },
    {
      nome: 'Mare',
      descrizione: 'Riviera Adriatica',
      immagine: 'images/homepage/sea_location_2.png',
      icona: 'fa-solid fa-umbrella-beach'
    },
    {
      nome: 'Montagna',
      descrizione: 'Lago di Braies',
      immagine: 'images/homepage/mountains_lake_1.png',
      icona: 'fa-solid fa-mountain'
    },
    {
      nome: 'Borghi',
      descrizione: 'Civita di Bagnoregio',
      immagine: 'images/homepage/little_town_1.png',
      icona: 'fa-solid fa-city'
    }
  ];
}

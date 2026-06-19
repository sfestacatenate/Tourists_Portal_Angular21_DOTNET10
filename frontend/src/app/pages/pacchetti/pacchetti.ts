import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PacchettiService } from '../../services/pacchetti';
import { Pacchetto } from '../../models/pacchetto.model';
import { pacchettoSchema } from '../../schemas/validazione';

@Component({
  selector: 'app-pacchetti',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pacchetti.html',
  styleUrl: './pacchetti.scss'
})
export class Pacchetti implements OnInit {
  private readonly pacchettiService = inject(PacchettiService);
  private readonly fb = inject(FormBuilder);

  pacchetti: Pacchetto[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showDetailModal = false;
  selectedItem: Pacchetto | null = null;
  formErrors: Record<string, string> = {};

  pacchettoForm = this.fb.group({
    nome: [''],
    descrizione: [''],
    prezzo: [0],
    durataGiorni: [0],
    destinazione: ['']
  });

  detailForm = this.fb.group({
    nome: [''],
    descrizione: [''],
    prezzo: [0],
    durataGiorni: [0],
    destinazione: ['']
  });

  ngOnInit(): void {
    this.caricaPacchetti();
  }

  caricaPacchetti(): void {
    this.loading = true;
    this.errorMessage = '';

    this.pacchettiService.getPacchetti().subscribe({
      next: data => {
        this.pacchetti = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = 'Errore nel caricamento dei pacchetti.';
        console.error(err);
      }
    });
  }

  openModal(): void {
    this.pacchettoForm.reset();
    this.formErrors = {};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    const result = pacchettoSchema.safeParse(this.pacchettoForm.value);

    if (!result.success) {
      this.formErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!this.formErrors[field]) {
          this.formErrors[field] = issue.message;
        }
      }
      return;
    }

    this.formErrors = {};

    this.pacchettiService.createPacchetto(result.data).subscribe({
      next: nuovo => {
        this.pacchetti.push(nuovo);
        this.closeModal();
      },
      error: err => {
        console.error('Errore creazione pacchetto:', err);
      }
    });
  }

  openDetail(item: Pacchetto): void {
    this.selectedItem = item;
    this.formErrors = {};
    this.detailForm.setValue({
      nome: item.nome,
      descrizione: item.descrizione,
      prezzo: item.prezzo,
      durataGiorni: item.durataGiorni,
      destinazione: item.destinazione
    });
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedItem = null;
  }

  onUpdate(): void {
    if (!this.selectedItem) return;

    const result = pacchettoSchema.safeParse(this.detailForm.value);

    if (!result.success) {
      this.formErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!this.formErrors[field]) {
          this.formErrors[field] = issue.message;
        }
      }
      return;
    }

    this.formErrors = {};

    this.pacchettiService.updatePacchetto(this.selectedItem.id, result.data).subscribe({
      next: aggiornato => {
        const idx = this.pacchetti.findIndex(p => p.id === aggiornato.id);
        if (idx !== -1) {
          this.pacchetti[idx] = aggiornato;
        }
        this.closeDetail();
      },
      error: err => {
        console.error('Errore aggiornamento pacchetto:', err);
      }
    });
  }

  onDelete(): void {
    if (!this.selectedItem) return;

    if (!confirm('Eliminare questo pacchetto?')) return;

    this.pacchettiService.deletePacchetto(this.selectedItem.id).subscribe({
      next: () => {
        this.pacchetti = this.pacchetti.filter(p => p.id !== this.selectedItem!.id);
        this.closeDetail();
      },
      error: err => {
        console.error('Errore eliminazione pacchetto:', err);
      }
    });
  }
}

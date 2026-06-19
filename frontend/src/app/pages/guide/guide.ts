import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GuideService } from '../../services/guide';
import { Guida } from '../../models/guida.model';
import { guidaSchema } from '../../schemas/validazione';

@Component({
  selector: 'app-guide',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guide.html',
  styleUrl: './guide.scss'
})
export class Guide implements OnInit {
  private readonly guideService = inject(GuideService);
  private readonly fb = inject(FormBuilder);

  guide: Guida[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showDetailModal = false;
  selectedItem: Guida | null = null;
  formErrors: Record<string, string> = {};

  guidaForm = this.fb.group({
    nome: [''],
    cognome: [''],
    specializzazione: [''],
    lingue: ['']
  });

  detailForm = this.fb.group({
    nome: [''],
    cognome: [''],
    specializzazione: [''],
    lingue: ['']
  });

  ngOnInit(): void {
    this.caricaGuide();
  }

  caricaGuide(): void {
    this.loading = true;
    this.errorMessage = '';

    this.guideService.getGuide().subscribe({
      next: data => {
        this.guide = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = 'Errore nel caricamento delle guide.';
        console.error(err);
      }
    });
  }

  openModal(): void {
    this.guidaForm.reset();
    this.formErrors = {};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    const result = guidaSchema.safeParse(this.guidaForm.value);

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

    const raw = this.guidaForm.value;
    const data = {
      nome: result.data.nome,
      cognome: result.data.cognome,
      specializzazione: result.data.specializzazione ?? '',
      lingue: (raw.lingue ?? '').split(',').map(l => l.trim()).filter(l => l.length > 0)
    };

    this.guideService.createGuida(data as any).subscribe({
      next: nuovo => {
        this.guide.push(nuovo);
        this.closeModal();
      },
      error: err => {
        console.error('Errore creazione guida:', err);
      }
    });
  }

  openDetail(item: Guida): void {
    this.selectedItem = item;
    this.formErrors = {};
    this.detailForm.setValue({
      nome: item.nome,
      cognome: item.cognome,
      specializzazione: item.specializzazione,
      lingue: item.lingue.join(', ')
    });
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedItem = null;
  }

  onUpdate(): void {
    if (!this.selectedItem) return;

    const result = guidaSchema.safeParse(this.detailForm.value);

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

    const raw = this.detailForm.value;
    const data = {
      nome: result.data.nome,
      cognome: result.data.cognome,
      specializzazione: result.data.specializzazione ?? '',
      lingue: (raw.lingue ?? '').split(',').map(l => l.trim()).filter(l => l.length > 0)
    };

    this.guideService.updateGuida(this.selectedItem.id, data as any).subscribe({
      next: aggiornato => {
        const idx = this.guide.findIndex(g => g.id === aggiornato.id);
        if (idx !== -1) {
          this.guide[idx] = aggiornato;
        }
        this.closeDetail();
      },
      error: err => {
        console.error('Errore aggiornamento guida:', err);
      }
    });
  }

  onDelete(): void {
    if (!this.selectedItem) return;

    if (!confirm('Eliminare questa guida?')) return;

    this.guideService.deleteGuida(this.selectedItem.id).subscribe({
      next: () => {
        this.guide = this.guide.filter(g => g.id !== this.selectedItem!.id);
        this.closeDetail();
      },
      error: err => {
        console.error('Errore eliminazione guida:', err);
      }
    });
  }
}

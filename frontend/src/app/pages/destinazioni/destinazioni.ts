import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DestinazioniService } from '../../services/destinazioni';
import { Destinazione } from '../../models/destinazione.model';
import { destinazioneSchema } from '../../schemas/validazione';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destinazioni',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './destinazioni.html',
  styleUrl: './destinazioni.scss'
})
export class Destinazioni implements OnInit {
  private readonly destinazioniService = inject(DestinazioniService);
  private readonly fb = inject(FormBuilder);

  destinazioni: Destinazione[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showDetailModal = false;
  selectedItem: Destinazione | null = null;
  formErrors: Record<string, string> = {};

  destinazioneForm = this.fb.group({
    nome: [''],
    descrizione: [''],
    localita: [''],
    immagine: ['']
  });

  detailForm = this.fb.group({
    nome: [''],
    descrizione: [''],
    localita: [''],
    immagine: ['']
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  detailSelectedFile: File | null = null;
  detailImagePreview: string | null = null;

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${environment.serverUrl}${path}`;
  }

  ngOnInit(): void {
    this.caricaDestinazioni();
  }

  caricaDestinazioni(): void {
    this.loading = true;
    this.errorMessage = '';

    this.destinazioniService.getDestinazioni().subscribe({
      next: data => {
        this.destinazioni = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMessage = 'Errore nel caricamento delle destinazioni.';
        console.error(err);
      }
    });
  }

  openModal(): void {
    this.destinazioneForm.reset();
    this.formErrors = {};
    this.selectedFile = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    const formValues = this.destinazioneForm.value;

    if (this.selectedFile) {
      this.destinazioniService.uploadImage(this.selectedFile).subscribe({
        next: resp => {
          formValues.immagine = resp.imageUrl;
          this.submitCreate(formValues);
        },
        error: err => {
          console.error('Errore upload immagine:', err);
        }
      });
    } else {
      this.submitCreate(formValues);
    }
  }

  private submitCreate(formValues: any): void {
    const result = destinazioneSchema.safeParse(formValues);

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

    this.destinazioniService.createDestinazione(result.data).subscribe({
      next: nuovo => {
        this.destinazioni.push(nuovo);
        this.closeModal();
      },
      error: err => {
        console.error('Errore creazione destinazione:', err);
      }
    });
  }

  openDetail(item: Destinazione): void {
    this.selectedItem = item;
    this.formErrors = {};
    this.detailSelectedFile = null;
    this.detailImagePreview = item.immagine ? this.getImageUrl(item.immagine) : null;
    this.detailForm.setValue({
      nome: item.nome,
      descrizione: item.descrizione,
      localita: item.localita,
      immagine: item.immagine
    });
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedItem = null;
    this.detailSelectedFile = null;
    this.detailImagePreview = null;
  }

  onDetailFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.detailSelectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.detailImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.detailSelectedFile);
    }
  }

  onUpdate(): void {
    if (!this.selectedItem) return;

    const formValues = this.detailForm.value;

    if (this.detailSelectedFile) {
      this.destinazioniService.uploadImage(this.detailSelectedFile).subscribe({
        next: resp => {
          formValues.immagine = resp.imageUrl;
          this.submitUpdate(formValues);
        },
        error: err => {
          console.error('Errore upload immagine:', err);
        }
      });
    } else {
      this.submitUpdate(formValues);
    }
  }

  private submitUpdate(formValues: any): void {
    if (!this.selectedItem) return;

    const result = destinazioneSchema.safeParse(formValues);

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

    this.destinazioniService.updateDestinazione(this.selectedItem.id, result.data).subscribe({
      next: aggiornato => {
        const idx = this.destinazioni.findIndex(d => d.id === aggiornato.id);
        if (idx !== -1) {
          this.destinazioni[idx] = aggiornato;
        }
        this.closeDetail();
      },
      error: err => {
        console.error('Errore aggiornamento destinazione:', err);
      }
    });
  }

  onDelete(): void {
    if (!this.selectedItem) return;

    if (!confirm('Eliminare questa destinazione?')) return;

    this.destinazioniService.deleteDestinazione(this.selectedItem.id).subscribe({
      next: () => {
        this.destinazioni = this.destinazioni.filter(d => d.id !== this.selectedItem!.id);
        this.closeDetail();
      },
      error: err => {
        console.error('Errore eliminazione destinazione:', err);
      }
    });
  }
}

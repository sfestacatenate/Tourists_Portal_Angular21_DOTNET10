import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ClientiService } from '../../services/clienti';
import { Cliente } from '../../models/cliente.model';
import { clienteSchema } from '../../schemas/validazione';

@Component({
  selector: 'app-clienti',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clienti.html',
  styleUrl: './clienti.scss'
})
export class Clienti implements OnInit {
  private readonly clientiService = inject(ClientiService);
  private readonly fb = inject(FormBuilder);

  clienti: Cliente[] = [];
  loading = false;
  errorMessage = '';
  showModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedItem: Cliente | null = null;
  itemToDelete: Cliente | null = null;
  formErrors: Record<string, string> = {};

  clienteForm = this.fb.group({
    nome: [''],
    cognome: [''],
    codiceFiscale: [''],
    dataNascita: [''],
    email: [''],
    citta: ['']
  });

  editForm = this.fb.group({
    nome: [''],
    cognome: [''],
    codiceFiscale: [''],
    dataNascita: [''],
    email: [''],
    citta: ['']
  });

  ngOnInit(): void {
    this.caricaClienti();
  }

  caricaClienti(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clientiService.getClienti().subscribe({
      next: data => {
        this.clienti = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;

        if (err instanceof ProgressEvent) {
          this.errorMessage = 'Impossibile contattare il server. Verifica che il backend sia in esecuzione su http://localhost:5000.';
        } else if (err instanceof Error) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Errore sconosciuto durante il caricamento.';
        }

        console.error('Errore HTTP:', err);
      }
    });
  }

  openModal(): void {
    this.clienteForm.reset();
    this.formErrors = {};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    const result = clienteSchema.safeParse(this.clienteForm.value);

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

    this.clientiService.createCliente(result.data).subscribe({
      next: nuovo => {
        this.clienti.push(nuovo);
        this.closeModal();
      },
      error: err => {
        console.error('Errore creazione cliente:', err);
      }
    });
  }

  openEdit(item: Cliente): void {
    this.selectedItem = item;
    this.formErrors = {};
    this.editForm.setValue({
      nome: item.nome,
      cognome: item.cognome,
      codiceFiscale: item.codiceFiscale,
      dataNascita: item.dataNascita,
      email: item.email,
      citta: item.citta
    });
    this.showEditModal = true;
  }

  closeEdit(): void {
    this.showEditModal = false;
    this.selectedItem = null;
  }

  onUpdate(): void {
    if (!this.selectedItem) return;

    const result = clienteSchema.safeParse(this.editForm.value);

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

    this.clientiService.updateCliente(this.selectedItem.id, result.data).subscribe({
      next: aggiornato => {
        const idx = this.clienti.findIndex(c => c.id === aggiornato.id);
        if (idx !== -1) {
          this.clienti[idx] = aggiornato;
        }
        this.closeEdit();
      },
      error: err => {
        console.error('Errore aggiornamento cliente:', err);
      }
    });
  }

  confirmDelete(item: Cliente): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  closeDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  onDelete(): void {
    if (!this.itemToDelete) return;

    this.clientiService.deleteCliente(this.itemToDelete.id).subscribe({
      next: () => {
        this.clienti = this.clienti.filter(c => c.id !== this.itemToDelete!.id);
        this.closeDelete();
      },
      error: err => {
        console.error('Errore eliminazione cliente:', err);
      }
    });
  }
}

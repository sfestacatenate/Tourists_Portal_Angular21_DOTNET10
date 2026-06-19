import { z } from 'zod';

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio'),
  cognome: z.string().min(1, 'Cognome obbligatorio'),
  codiceFiscale: z.string().length(16, 'Il codice fiscale deve avere 16 caratteri'),
  dataNascita: z.string().min(1, 'Data di nascita obbligatoria'),
  email: z.string().email('Email non valida').or(z.literal('')),
  citta: z.string().default('')
});

export const destinazioneSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio'),
  descrizione: z.string().default(''),
  localita: z.string().default(''),
  immagine: z.string().default('')
});

export const pacchettoSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio'),
  descrizione: z.string().default(''),
  prezzo: z.coerce.number()
    .min(0, 'Il prezzo non può essere negativo'),
  durataGiorni: z.coerce.number()
    .int('Deve essere un numero intero')
    .min(1, 'La durata deve essere almeno 1 giorno'),
  destinazione: z.string().default('')
});

export const guidaSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio'),
  cognome: z.string().min(1, 'Cognome obbligatorio'),
  specializzazione: z.string().default(''),
  lingue: z.string().default('')
});

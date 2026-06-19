# Tourist Portal

Applicazione web per la gestione di destinazioni turistiche, pacchetti viaggio, guide turistiche e clienti.

## Tecnologie utilizzate

### Lato server (Backend)
- **Runtime**: ASP.NET Core (.NET 10)
- **ORM**: Entity Framework Core 9.0
- **Database**: MySQL con Pomelo.EntityFrameworkCore.MySql 9.0
- **Autenticazione**: Session-based con cookie HTTP
- **Hashing password**: BCrypt.Net-Next 4.0.3
- **Documentazione API**: OpenAPI + Swagger UI 10.1.7

### Lato client (Frontend)
- **Framework**: Angular 21 (Standalone components)
- **Linguaggio**: TypeScript 5.9
- **Stili**: SCSS
- **Icone**: FontAwesome Free 7.2
- **Validazione form**: Zod 4.4
- **Proxy di sviluppo**: proxy.conf.json (indirizza `/api` e `/images` verso il backend)

## Come funziona l'autenticazione

L'applicazione utilizza un sistema di autenticazione basato su sessione lato server con cookie:

1. L'utente inserisce email e password nella pagina di login.
2. Il frontend invia una richiesta `POST /api/auth/login` al backend.
3. Il backend verifica le credenziali: cerca l'utente per email, confronta l'hash della password con BCrypt.
4. Se le credenziali sono valide, viene generato un token casuale (32 byte, base64) e salvato nella tabella `sessioni` con scadenza 30 minuti.
5. Il backend imposta un cookie `session_token` nella risposta HTTP.
6. A ogni richiesta successiva, il middleware `SessionAuthenticationHandler` legge il cookie, cerca la sessione nel database e verifica che non sia scaduta.
7. Il frontend tramite `CredentialsInterceptor` aggiunge `withCredentials: true` a ogni chiamata HTTP per inviare automaticamente il cookie.
8. Il `authGuard` sulle rotte protegge le pagine: se non c'è una sessione valida, l'utente viene reindirizzato al login.
9. Il logout (`POST /api/auth/logout`) elimina la sessione dal database.

## Prerequisiti

- .NET SDK 10
- Node.js (compatibile con Angular 21)
- MySQL Server 8.0+
- npm (incluso con Node.js)

## Avvio del database

Crea il database ed esegui il seed dei dati:

```bash
mysql -u root -p < backend/ScriptsSQL/seed_data.sql
```

### Credenziali utente di default

| Utente | Email | Password | Ruolo |
|--------|-------|----------|-------|
| Admin | admin@touristportal.com | admin | Amministratore |

### Configurazione connessione MySQL

Modifica il file `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=tourist_portal;User=root;Password=tua_password;"
  }
}
```

## Avvio del backend

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

Il backend si avvia su `http://localhost:5000`.

La documentazione Swagger è disponibile su `http://localhost:5000/swagger`.

## Avvio del frontend

In un secondo terminale:

```bash
cd frontend
npm install
npm start
```

Il frontend si avvia su `http://localhost:4200`.

Durante lo sviluppo, il proxy integrato (`proxy.conf.json`) reindirizza automaticamente le richieste verso `/api` e `/images` al backend su `http://localhost:5000`, evitando problemi di CORS.

## API disponibili

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Dati utente corrente

### Destinazioni
- `GET /api/destinazioni` — Elenco
- `GET /api/destinazioni/{id}` — Dettaglio
- `POST /api/destinazioni` — Crea
- `PUT /api/destinazioni/{id}` — Modifica
- `DELETE /api/destinazioni/{id}` — Elimina
- `POST /api/destinazioni/upload` — Upload immagine (multipart)

### Pacchetti
- `GET /api/pacchetti` — Elenco
- `GET /api/pacchetti/{id}` — Dettaglio
- `POST /api/pacchetti` — Crea
- `PUT /api/pacchetti/{id}` — Modifica
- `DELETE /api/pacchetti/{id}` — Elimina

### Guide
- `GET /api/guide` — Elenco
- `GET /api/guide/{id}` — Dettaglio
- `POST /api/guide` — Crea
- `PUT /api/guide/{id}` — Modifica
- `DELETE /api/guide/{id}` — Elimina

### Clienti
- `GET /api/clienti` — Elenco
- `GET /api/clienti/{id}` — Dettaglio
- `POST /api/clienti` — Crea
- `PUT /api/clienti/{id}` — Modifica
- `DELETE /api/clienti/{id}` — Elimina

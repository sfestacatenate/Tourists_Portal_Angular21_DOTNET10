-- ============================================================
-- Script di seed del database per TouristPortal
-- ============================================================

CREATE DATABASE IF NOT EXISTS touristportal;
USE touristportal;

-- ============================================================
-- TABELLE
-- ============================================================

CREATE TABLE IF NOT EXISTS destinazioni (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descrizione TEXT,
    localita VARCHAR(100),
    immagine VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pacchetti (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descrizione TEXT,
    prezzo DECIMAL(10,2) NOT NULL,
    durata_giorni INT NOT NULL,
    destinazione VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS guide (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    specializzazione VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS guide_lingue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    guida_id INT NOT NULL,
    lingua VARCHAR(50) NOT NULL,
    FOREIGN KEY (guida_id) REFERENCES guide(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clienti (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    codice_fiscale VARCHAR(16) NOT NULL,
    data_nascita DATE NOT NULL,
    email VARCHAR(255),
    citta VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS utenti (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_utente VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(50) NULL,
    cognome VARCHAR(50) NULL,
    ruolo VARCHAR(50) NOT NULL DEFAULT 'Utente',
    data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_accesso DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessioni (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utente_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_scadenza DATETIME NOT NULL,
    data_ultimo_utilizzo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_indirizzo VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    FOREIGN KEY (utente_id) REFERENCES utenti(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATI
-- ============================================================

INSERT INTO utenti (nome_utente, email, password_hash, ruolo) VALUES
('Admin', 'admin@touristportal.com', '$2b$11$kFH5fYBSbRrbwUjeufzEk.g9XBwJItzm4WF3HhULHt5cS6z6auWWS', 'Amministratore');

INSERT INTO destinazioni (id, nome, descrizione, localita, immagine) VALUES
(1, 'Roma',              'Esplora la città eterna tra storia, arte e cultura millenaria.',                  'Lazio',    '/images/destinations/69b0ee5c-3c60-4bfd-ab2f-c6769bf2e74d.png'),
(2, 'Firenze',           'Il cuore del Rinascimento italiano, tra musei e capolavori.',                     'Toscana',  '/images/destinations/67332049-7272-4ec0-8f0a-942324d4cc1c.png'),
(3, 'Venezia',           'La città dei canali, del romanticismo e del Carnevale.',                          'Veneto',   '/images/destinations/ff09fe05-69ab-47aa-bd6b-561a0571c411.png'),
(4, 'Costiera Amalfitana','Costiera mozzafiato tra mare cristallino e borghi pittoreschi.',                 'Campania', '/images/destinations/3417e75b-775c-4c61-82c2-1410299da80f.png');

INSERT INTO pacchetti (id, nome, descrizione, prezzo, durata_giorni, destinazione) VALUES
(1, 'Roma Classica',     'Weekend a Roma con visita guidata al Colosseo, Fori Imperiali e Città del Vaticano.',   299.00, 3, 'Roma'),
(2, 'Tesori di Firenze', 'Pacchetto di 4 giorni con ingressi prioritari a Uffizi e Galleria dell''Accademia.',   399.00, 4, 'Firenze'),
(3, 'Venezia Romantica', 'Soggiorno a Venezia con giro in gondola e cena in un palazzo storico.',                 549.00, 3, 'Venezia'),
(4, 'Divina Costiera',   'Tour di 5 giorni tra Positano, Amalfi e Ravello con pranzi tipici.',                   899.00, 5, 'Costiera Amalfitana');

INSERT INTO guide (id, nome, cognome, specializzazione) VALUES
(1, 'Marco',       'Ferrari', 'Arte e Storia'),
(2, 'Sofia',       'Conti',   'Enogastronomia'),
(3, 'Alessandro',  'Russo',   'Natura e Trekking');

INSERT INTO guide_lingue (guida_id, lingua) VALUES
(1, 'Italiano'),
(1, 'Inglese'),
(1, 'Francese'),
(2, 'Italiano'),
(2, 'Inglese'),
(2, 'Tedesco'),
(3, 'Italiano'),
(3, 'Inglese'),
(3, 'Spagnolo');

INSERT INTO clienti (id, nome, cognome, codice_fiscale, data_nascita, email, citta) VALUES
(1, 'Mario',    'Rossi',   'RSSMRA80A01H501U', '1980-01-01', 'mario.rossi@example.com',    'Roma'),
(2, 'Laura',    'Bianchi', 'BNCLRA85B41F205X', '1985-02-01', 'laura.bianchi@example.com',  'Milano'),
(3, 'Giuseppe', 'Verdi',   'VRDGPP90C15L219Z', '1990-03-15', 'giuseppe.verdi@example.com', 'Torino'),
(4, 'Anna',     'Neri',    'NRENNA92D55D612K', '1992-04-15', 'anna.neri@example.com',      'Firenze');

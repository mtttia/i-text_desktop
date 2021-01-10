# i-text_desktop
desktop app for interactive text, a superset notepad

# comandi da terminale
  - npm install : per installare le dipendenze
  - npm run start : per debuggare
  - per impacchettare l'app : aggiungere alla fine del progetto --electronVersion=//versione corrente di electron installato nel tuo computer
  - npm run package-win : per impacchettare l'app per windows
  - npm run package-mac : per impacchettare l'app per Macos
  - npm run package-linux : per impacchettare l'app per linux

# panoramica progetto i-text
i-text è un progetto nato per creare un notepad con più funzioni del notepad classico che possono rivelarsi molto utili durante la vita quotidiana.
I-text è nato come app web, però solo in forma statica, è stato poi riscritto come app desktop utilizzando il framework electron js, perchè in quanto desktop app può accedere allo spazio di archiviazione, e permette di fornire servizi molto utili

# funzionalità
qui verranno riportate tutte le funzionalità che i-text ha rispetto ad un notepad classico

# file sempre pronti
Ad ogni modifica effettuata i-text salva tutti i testi su un file json che verrà poi ricaricato all'alpertura dell'app in modo da aver i documenti sempre pronti anche senza salvarli ogni volta

# lettore ad alta voce
I-text ti permette di leggere tutti i testi ad alta voce, consentendo di regolare la velocità e di regolare la lingua (per ora solo italiano e inglese)

# ordinamento / formattazione del testo
I-text contiene uno script che permette in tempo reale di aggingere spazi in caso di dimenticanza dell'utente ad esempio dopo una ',', oppure di mettere la lettera maiuscola dopo i '.'

# tecnologie utilizzate
Per realizzare quest'app è stato utilizzato node js con electron js.
Come pacchetti npm sono stati utilizzati :
  - bootstrap
  - popper.js
  - jquery
  - typescript
  - swiper.js

# i-text_desktop
desktop app for interactive text, a superset notepad made with electron js

# versione 1.0.0
  - salva i file in automatico, perciò non c'è il bisogno di salvarli ogni volta prima di chiudere l'app
  - consente di leggere in italiano o in inglese il testo di qualsiasi file, a velocità 1x, 2x e 0.5x
  - ordina in automatico il testo in tempo reale, inserisce lo spazio dopo la ',' o le maiuscole dopo il '.', e cancella punteggiature o spazi doppi, consente di creare elenchi
  - consente di aprire file dal file-system (per è supportato ufficialmente solo il formato txt, pertanto aprirà tutti i file come file di testo)
  - consente di salvare i file con nome o di sovrascrivere il file originale
  - consente di modificare la grandezza del carattere e l'ordinamento
  
l'app è in continuo sviluppamento, questa è soltanto la prima versione, ma sono in arrivo moltissime novità : dall'aggiunta di nuove opzioni di formattazione, all'aggiunta di nuove lingue, nuovi script per interagire il più possibile col file system e nuovi tool / utilities per avere il 100% dal tuo notepad. NON PERDERTELE!

# come eseguirlo?
  - Per eseguirlo bisogna avere installato node js.
  - portarsi col prompt dei comandi nella cartella dell'app
  - Digitare npm install dal prompt dei comandi per installare tutte le dipendenze necessarie all'esecuzione dell'app.
  - Digitare npm start per avviare l'app
  - Se si riscontrano problemi durante l'avvio dell'app installare electron con l'npm nel progetto (https://www.electronjs.org/)

# comandi da terminale
  - npm install : per installare le dipendenze
  - npm run start : per debuggare
  - per impacchettare l'app : aggiungere alla fine del comando package-... --electronVersion=//versione corrente di electron installato nel tuo computer
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
ordina in automatico il testo in tempo reale, inserisce lo spazio dopo i caratteri che la necessano (per ora sono supportati ', . : ? !'), le maiuscole dopo i punti (per ora sono supportati . ? !), e cancella punteggiature o spazi doppi, consente di creare elenchi e inserisce le frecce (per ora sono supportati ->, <-, =>, <=).
Dalle impostazioni si possono scegliere quali opzioni usare e quali disattivare

# tecnologie utilizzate
Per realizzare quest'app è stato utilizzato node js con electron js.
Come pacchetti npm sono stati utilizzati :
  - bootstrap
  - popper.js
  - jquery
  - typescript
  - swiper.js

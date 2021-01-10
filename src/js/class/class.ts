/*
classi che vengono utilizzate all'interno di questo progetto

indice 
Lettore
LetturaVeloce
Libreria
Sostituto
Testo
GestoreEventi
Evento

*/


class Lettore
{
    private isReading : boolean;
    private inPausa : boolean;
    volume : number;
    rate : number;
    lang : string;
    velocita : number;

    constructor()
    {
        this.isReading = false;
        this.inPausa = false;
        this.volume = 1;
        this.rate = 1;
        this.lang = "it-IT";
        this.velocita = 1;
    }

    Leggi(messaggio : string) : SpeechSynthesisUtterance
    {
        
        
        var speech = new SpeechSynthesisUtterance();
        speech.text = messaggio;  
        speech.volume = this.volume
        speech.rate = this.rate
        speech.pitch = 1;
        speech.rate= this.velocita;
        speech.lang = this.lang;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
        this.isReading = true;
        this.inPausa = false;
        return speech;

        speech.addEventListener('end', () =>
        {
            this.isReading = false;
            this.inPausa = false;
        })
    }

    Pausa()
    {
        window.speechSynthesis.pause();
        this.inPausa = true;
    }

    Riprendi()
    {
        window.speechSynthesis.resume();
        this.inPausa = false;
    }

    StopLeggi()
    {
        window.speechSynthesis.cancel();
        this.isReading = false;
        this.inPausa = false;

    }

    Lettura(message : string)
    {
        if(this.isReading)
        {
            this.StopLeggi();
        }
        else
        {
            this.Leggi(message);
        }
    }

    staLeggendo() : boolean
    {
        return this.isReading;
    }

    LeggiInPausa() : boolean
    {
        return this.inPausa;
    }

}




class LetturaVeloce
{
    testo : string;
    idElemento : string;
    private timer : number;
    isPlaying : boolean;
    idVecchio : number;
    riprendi : boolean;

    constructor(testo : string, id : string, timer : number)
    {
        this.testo = testo;
        this.idElemento = id;
        this.timer = timer;
        this.isPlaying = false;
        this.idVecchio = 0;
        this.riprendi = false;
    }

    getTimer() : number
    {
        return this.timer;
    }

    setTimer(velocita : number) : void
    {
        if(velocita > 99)
        {
            this.timer = velocita;
        }
        else
        {
            throw new Error("velocità non valida");
        }
    }

    parti(testo : string = "") : void
    {
        if(!this.isPlaying)
        {
            this.isPlaying = true;
            if(!this.riprendi)
            {
                this.testo = testo;
            }
            let array = this.testo.split(' ');
            if(!this.riprendi)
            {
                this.leggiParola(array);
            }
            else
            {
                //continua
                var id = this.idVecchio;
                this.idVecchio = 0;
                this.leggiParola(array, id);
            }
        }
    }

    private leggiParola(array : string[], i : number = 0) : void
    {
        if(this.isPlaying)
        {
            if(i == array.length)
            {
                //l'array è finito
                this.cancella();
                gestoreEventi.attiva("fineLetturaVeloce");
            }
            else
            {
                $("#" + this.idElemento).text(array[i]);
                setTimeout(() => {
                    this.leggiParola(array, ++i);
                }, this.timer);
            }
        }
        else
        {
            this.idVecchio = i;
        }
    }

    stop() : void
    {
        this.isPlaying = false;
        this.riprendi = true;
    }

    cancella() : void
    {
        this.riprendi = false;
        this.idVecchio = 0;
        $("#" + this.idElemento).text("");
        this.isPlaying = false;
    }

    inPausa() : boolean
    {
        if(this.idVecchio > 0)
        {
            //è in pausa
            return true;
        }
        else{
            //non è in pausa
            return false;
        }
    }
    
}




class Libreria
{
    private testi : Testo[];
    private testoCorrente : number;
    

    constructor(testi : any)
    {      
        
        if(testi != "")
        {
            this.testi = testi;            
            this.testoCorrente = testi[0].getId();
        }
        else
        {
            this.testi = new Array();
            this.addTestoAndGoTo("", "");
            this.testoCorrente = 0;
        }
    }

    

    getTesti() : Testo[]
    {
        return this.testi;
    }

    setTesti(t : Testo[]) : void
    {
        this.testi = t;
    }

    getTestoCorrente() : number
    {
        return this.testoCorrente;
    }

    setTestoCorrente(n : number) : Testo
    {
        try
        {
            this.testoCorrente = n;
            return this.getTestoAt(n);
        }catch(ex)
        {
            throw new Error("errore interno");
        }
    }

    getTesto() : Testo
    {
        return this.getTestoAt(this.testoCorrente);
    }


    addTesto(testo : string, titolo : string, path : string = "") : Testo
    {
        let id = this.getIdLibero();
        if(titolo == "")
        {
            titolo = "file " + id;
        }
        let t = new Testo(titolo, testo, "text", id, path);
        this.testi.push(t);
        return t;
    }

    addTestoAndGoTo(testo : string, titolo : string, path : string = "") : Testo
    {
        let id = this.getIdLibero();
        if(titolo == "")
        {
            titolo = "file " + id;
        }
        let t = new Testo(titolo, testo, "text", id, path);
        this.testi.push(t);
        this.testoCorrente = id;
        return t;
    }

    private getIdLibero() {
        let i = 0;
        while(true)
        {
            if(!this.idOccupato(i))
            {
                return i;
            }
            i++;
        }
    }

    private idOccupato(id : number) {
        var occupato = false;
        this.testi.forEach(el => {
            if(el.getId() == id)
            {
                occupato = true;
            }
        });
        return occupato;

    }

    private getTestiPosition(id : number)
    {
        for(var i = 0; i < this.testi.length; i++)
        {
            if(this.testi[i].getId() == id)
            {
                return i;
            }
        }
        throw new Error("errore interno");
    }

    removeTesto(id : number)
    {
        if(id == this.testoCorrente)
        {
            this.removeTestoCorrente();    
        }
        else{
            let pos = this.getTestiPosition(id);
            if(pos == -1)
            {
                console.error("testo non presente");
            }
            else
            {
                //cancello il testo alla posizione pos
                this.testi.splice(pos, 1);
            }
        }
    }

    removeTestoCorrente()
    {
        if(this.testi.length == 1)
        {
            let pos = this.getTestiPosition(this.testoCorrente);
            this.testi.splice(pos, 1);
            this.testoCorrente = -1;
        }
        else
        {
            let pos = this.getTestiPosition(this.testoCorrente);
            this.testi.splice(pos, 1);
            return this.setTestoCorrente(this.testi[0].getId());
        }        
    }

    getTestoAt(id : number) : Testo
    {
        return this.testi[this.getTestiPosition(id)];
    }

    aggiornaTesto()
    {
        this.getTestoAt(this.testoCorrente).aggiornaText();
    }

    rinominaTestoAt(id : number, titolo : string) : void
    {
        this.testi[this.getTestiPosition(id)].titolo = titolo;
    }

    rinominaTesto(titolo : string)
    {
        this.testi[this.getTestiPosition(this.testoCorrente)].titolo = titolo;
    }

    getTestoDaLeggereAt(id : number)
    {
        return this.getTestoAt(id).getText();
    }

    getTestoDaLeggere()
    {
        return this.getTesto().getText();
    }

    makeFile(path : string)
    {
        this.testi[this.getTestiPosition(this.testoCorrente)].makeFile(path);

    }

}





class Sostituto
{
    substring : string;
    sostitute : string;

    constructor(sub : string, sos : string)
    {
        this.substring = sub;
        this.sostitute = sos;   
    }

    sostituisci(testo : string) : String
    {
        let arr = testo.split(this.substring);
        let t = "";
        for(var i = 0; i < arr.length; i++)
        {
            if(i == arr.length-1)
            {
                t += arr[i];
            }
            else
            {
                t += arr[i] + " " + this.sostitute;
            }
        }

        return t;
    }

    presente(testo : string) : boolean
    {
        if(testo.split(this.substring).length >= 2)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    lunghezzaSubstring()
    {
        return this.substring.length;
    }

    
}




class Testo
{
    public titolo : string;
    private text : string;
    private idElemento : string;
    private id : number;
    private file : boolean; //dice se si riferisce a un file esistente oppure no
    private pathFile : string; //eventuale file esistente

    constructor(titolo : string, text : string, idElement : string, id : number, path : string = "")
    {
        this.text = text;
        this.idElemento = idElement;
        this.id = id;
        this.titolo = titolo;
        if(path != "")
        {
            //c'è un path
            this.file = true;
            this.pathFile = path;
        }
        else
        {
            this.file = false;
            this.pathFile = "";
        }
    }

    //metodi

    getText() : string
    {
        return this.text;
    }

    setText(text : string)
    {
        this.text = text;
    }

    getElemento() : string
    {
        return this.idElemento;
    }

    setElemento(elemento : string)
    {
        this.idElemento = elemento;
    }

    getId() : number
    {
        return this.id;
    }

    setId(id : number)
    {
        this.id = id;
    }

    makeFile(path : string)
    {
        this.pathFile = path;
        this.file = true;
    }

    delFile()
    {
        this.file = false;
        this.pathFile = "";
    }

    getPath() : string
    {
        if(this.file)
        {
            return this.pathFile;
        }
        else
        {
            return "";
        }
    }

    isFile()
    {
        return this.file;
    }

    aggiornaText()
    {
        try
        {
            this.text = <string> $("#" + this.idElemento).val();
        }catch(ex)
        {
            console.error(ex);
        }
    }

    scriviElemento()
    {
        try
        {
            $("#" + this.idElemento).val(this.text);            
        }catch(ex)
        {
            console.error(ex);
        }
    }


    
}




class GestoreEventi{
    eventi : Evento[];

    constructor()
    {
        this.eventi = new Array();
    }

    attiva(nome : string)
    {
        this.eventi.forEach(element => {
            if(element.nome == nome)
            {
                element.esegui();
            }
        });
    }

    aggiungiEvento(nome : string, callback : () => void)
    {
        this.eventi.push(new Evento(nome, callback));
    }
}

class Evento
{
    nome : string;
    callback : () => void;

    constructor(nome : string, callback : () => void)
    {
        this.nome = nome;
        this.callback = callback;
    }

    esegui() : void
    {
        this.callback();
    }
}

var gestoreEventi = new GestoreEventi();
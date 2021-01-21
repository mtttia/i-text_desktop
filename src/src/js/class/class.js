"use strict";
var Lettore = (function () {
    function Lettore() {
        this.isReading = false;
        this.inPausa = false;
        this.volume = 1;
        this.rate = 1;
        this.lang = "it-IT";
        this.velocita = 1;
    }
    Lettore.prototype.Leggi = function (messaggio) {
        var _this = this;
        var speech = new SpeechSynthesisUtterance();
        speech.text = messaggio;
        speech.volume = this.volume;
        speech.rate = this.rate;
        speech.pitch = 1;
        speech.rate = this.velocita;
        speech.lang = this.lang;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
        this.isReading = true;
        this.inPausa = false;
        return speech;
        speech.addEventListener('end', function () {
            _this.isReading = false;
            _this.inPausa = false;
        });
    };
    Lettore.prototype.Pausa = function () {
        window.speechSynthesis.pause();
        this.inPausa = true;
    };
    Lettore.prototype.Riprendi = function () {
        window.speechSynthesis.resume();
        this.inPausa = false;
    };
    Lettore.prototype.StopLeggi = function () {
        window.speechSynthesis.cancel();
        this.isReading = false;
        this.inPausa = false;
    };
    Lettore.prototype.Lettura = function (message) {
        if (this.isReading) {
            this.StopLeggi();
        }
        else {
            this.Leggi(message);
        }
    };
    Lettore.prototype.staLeggendo = function () {
        return this.isReading;
    };
    Lettore.prototype.LeggiInPausa = function () {
        return this.inPausa;
    };
    return Lettore;
}());
var LetturaVeloce = (function () {
    function LetturaVeloce(testo, id, timer) {
        this.testo = testo;
        this.idElemento = id;
        this.timer = timer;
        this.isPlaying = false;
        this.idVecchio = 0;
        this.riprendi = false;
    }
    LetturaVeloce.prototype.getTimer = function () {
        return this.timer;
    };
    LetturaVeloce.prototype.setTimer = function (velocita) {
        if (velocita > 99) {
            this.timer = velocita;
        }
        else {
            throw new Error("velocità non valida");
        }
    };
    LetturaVeloce.prototype.parti = function (testo) {
        if (testo === void 0) { testo = ""; }
        if (!this.isPlaying) {
            this.isPlaying = true;
            if (!this.riprendi) {
                this.testo = testo;
            }
            var array = this.testo.split(' ');
            if (!this.riprendi) {
                this.leggiParola(array);
            }
            else {
                var id = this.idVecchio;
                this.idVecchio = 0;
                this.leggiParola(array, id);
            }
        }
    };
    LetturaVeloce.prototype.leggiParola = function (array, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        if (this.isPlaying) {
            if (i == array.length) {
                this.cancella();
                gestoreEventi.attiva("fineLetturaVeloce");
            }
            else {
                $("#" + this.idElemento).text(array[i]);
                setTimeout(function () {
                    _this.leggiParola(array, ++i);
                }, this.timer);
            }
        }
        else {
            this.idVecchio = i;
        }
    };
    LetturaVeloce.prototype.stop = function () {
        this.isPlaying = false;
        this.riprendi = true;
    };
    LetturaVeloce.prototype.cancella = function () {
        this.riprendi = false;
        this.idVecchio = 0;
        $("#" + this.idElemento).text("");
        this.isPlaying = false;
    };
    LetturaVeloce.prototype.inPausa = function () {
        if (this.idVecchio > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    return LetturaVeloce;
}());
var Libreria = (function () {
    function Libreria(testi) {
        if (testi != "") {
            this.testi = testi;
            this.testoCorrente = testi[0].getId();
        }
        else {
            this.testi = new Array();
            this.addTestoAndGoTo("", "");
            this.testoCorrente = 0;
        }
    }
    Libreria.prototype.getTesti = function () {
        return this.testi;
    };
    Libreria.prototype.setTesti = function (t) {
        this.testi = t;
    };
    Libreria.prototype.getTestoCorrente = function () {
        return this.testoCorrente;
    };
    Libreria.prototype.setTestoCorrente = function (n) {
        try {
            this.testoCorrente = n;
            return this.getTestoAt(n);
        }
        catch (ex) {
            throw new Error("errore interno");
        }
    };
    Libreria.prototype.getTesto = function () {
        return this.getTestoAt(this.testoCorrente);
    };
    Libreria.prototype.addTesto = function (testo, titolo, path) {
        if (path === void 0) { path = ""; }
        var id = this.getIdLibero();
        if (titolo == "") {
            titolo = "file " + id;
        }
        var t = new Testo(titolo, testo, "text", id, path);
        this.testi.push(t);
        return t;
    };
    Libreria.prototype.addTestoAndGoTo = function (testo, titolo, path) {
        if (path === void 0) { path = ""; }
        var id = this.getIdLibero();
        if (titolo == "") {
            titolo = "file " + id;
        }
        var t = new Testo(titolo, testo, "text", id, path);
        this.testi.push(t);
        this.testoCorrente = id;
        return t;
    };
    Libreria.prototype.getIdLibero = function () {
        var i = 0;
        while (true) {
            if (!this.idOccupato(i)) {
                return i;
            }
            i++;
        }
    };
    Libreria.prototype.idOccupato = function (id) {
        var occupato = false;
        this.testi.forEach(function (el) {
            if (el.getId() == id) {
                occupato = true;
            }
        });
        return occupato;
    };
    Libreria.prototype.getTestiPosition = function (id) {
        for (var i = 0; i < this.testi.length; i++) {
            if (this.testi[i].getId() == id) {
                return i;
            }
        }
        throw new Error("errore interno");
    };
    Libreria.prototype.removeTesto = function (id) {
        if (id == this.testoCorrente) {
            this.removeTestoCorrente();
        }
        else {
            var pos = this.getTestiPosition(id);
            if (pos == -1) {
                console.error("testo non presente");
            }
            else {
                this.testi.splice(pos, 1);
            }
        }
    };
    Libreria.prototype.removeTestoCorrente = function () {
        if (this.testi.length == 1) {
            var pos = this.getTestiPosition(this.testoCorrente);
            this.testi.splice(pos, 1);
            this.testoCorrente = -1;
        }
        else {
            var pos = this.getTestiPosition(this.testoCorrente);
            this.testi.splice(pos, 1);
            return this.setTestoCorrente(this.testi[0].getId());
        }
    };
    Libreria.prototype.getTestoAt = function (id) {
        return this.testi[this.getTestiPosition(id)];
    };
    Libreria.prototype.aggiornaTesto = function () {
        this.getTestoAt(this.testoCorrente).aggiornaText();
    };
    Libreria.prototype.rinominaTestoAt = function (id, titolo) {
        this.testi[this.getTestiPosition(id)].titolo = titolo;
    };
    Libreria.prototype.rinominaTesto = function (titolo) {
        this.testi[this.getTestiPosition(this.testoCorrente)].titolo = titolo;
    };
    Libreria.prototype.getTestoDaLeggereAt = function (id) {
        return this.getTestoAt(id).getText();
    };
    Libreria.prototype.getTestoDaLeggere = function () {
        return this.getTesto().getText();
    };
    Libreria.prototype.makeFile = function (path) {
        this.testi[this.getTestiPosition(this.testoCorrente)].makeFile(path);
    };
    return Libreria;
}());
var Sostituto = (function () {
    function Sostituto(sub, sos) {
        this.substring = sub;
        this.sostitute = sos;
    }
    Sostituto.prototype.sostituisci = function (testo) {
        var arr = testo.split(this.substring);
        var t = "";
        for (var i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                t += arr[i];
            }
            else {
                t += arr[i] + " " + this.sostitute;
            }
        }
        return t;
    };
    Sostituto.prototype.presente = function (testo) {
        if (testo.split(this.substring).length >= 2) {
            return true;
        }
        else {
            return false;
        }
    };
    Sostituto.prototype.lunghezzaSubstring = function () {
        return this.substring.length;
    };
    return Sostituto;
}());
var Testo = (function () {
    function Testo(titolo, text, idElement, id, path) {
        if (path === void 0) { path = ""; }
        this.text = text;
        this.idElemento = idElement;
        this.id = id;
        this.titolo = titolo;
        if (path != "") {
            this.file = true;
            this.pathFile = path;
        }
        else {
            this.file = false;
            this.pathFile = "";
        }
    }
    Testo.prototype.getText = function () {
        return this.text;
    };
    Testo.prototype.setText = function (text) {
        this.text = text;
    };
    Testo.prototype.getElemento = function () {
        return this.idElemento;
    };
    Testo.prototype.setElemento = function (elemento) {
        this.idElemento = elemento;
    };
    Testo.prototype.getId = function () {
        return this.id;
    };
    Testo.prototype.setId = function (id) {
        this.id = id;
    };
    Testo.prototype.makeFile = function (path) {
        this.pathFile = path;
        this.file = true;
    };
    Testo.prototype.delFile = function () {
        this.file = false;
        this.pathFile = "";
    };
    Testo.prototype.getPath = function () {
        if (this.file) {
            return this.pathFile;
        }
        else {
            return "";
        }
    };
    Testo.prototype.isFile = function () {
        return this.file;
    };
    Testo.prototype.aggiornaText = function () {
        try {
            this.text = $("#" + this.idElemento).val();
        }
        catch (ex) {
            console.error(ex);
        }
    };
    Testo.prototype.scriviElemento = function () {
        try {
            $("#" + this.idElemento).val(this.text);
        }
        catch (ex) {
            console.error(ex);
        }
    };
    return Testo;
}());
var GestoreEventi = (function () {
    function GestoreEventi() {
        this.eventi = new Array();
    }
    GestoreEventi.prototype.attiva = function (nome) {
        this.eventi.forEach(function (element) {
            if (element.nome == nome) {
                element.esegui();
            }
        });
    };
    GestoreEventi.prototype.aggiungiEvento = function (nome, callback) {
        this.eventi.push(new Evento(nome, callback));
    };
    return GestoreEventi;
}());
var Evento = (function () {
    function Evento(nome, callback) {
        this.nome = nome;
        this.callback = callback;
    }
    Evento.prototype.esegui = function () {
        this.callback();
    };
    return Evento;
}());
var gestoreEventi = new GestoreEventi();

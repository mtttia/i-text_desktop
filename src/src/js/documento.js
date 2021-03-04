"use strict";
var fs = require('fs');
var path = require('path');
var setting = {
    schermoIntero: false,
    ordinaTesto: true,
    spellcheck: true,
    cancellaDoppie: true,
    capsDopoPunto: true,
    cancellaDoppioSpazio: true,
    chiusuraParentesiAutomatica: true,
    grandezzaTesto: 15,
    orientamento: "sinistra",
    velocitaLettura: 1,
    linguaLettura: "it-IT",
    backgroundColor: "#ffffff",
    color: "#707070"
};
var libreria = new Libreria("");
var lettore = new Lettore();
var letturaVeloce = new LetturaVeloce("", "textVeloce", 500);
$(document).ready(function () {
    if (fs.existsSync(path.join(__dirname, "files.json")) && fs.existsSync(path.join(__dirname, "setting.json"))) {
        caricaSetting();
        caricaFile();
    }
    else {
        var settingJson = JSON.stringify(setting);
        var filesJson = JSON.stringify(libreria);
        fs.writeFileSync(path.join(__dirname, "setting.json"), settingJson);
        fs.writeFileSync(path.join(__dirname, "files.json"), filesJson);
        UIaggiungiTesto(libreria.getTesto());
        UICambiaTesto(0);
    }
    $('#char_plus').click(function () {
        incrementsFontSise('chooseSize', 1);
    });
    $('#char_minus').click(function () {
        decrementsFontSise('chooseSize', 1);
    });
    $('#lightmode').click(function () {
        lightmode();
    });
    $('#darkmode').click(function () {
        darkmode();
    });
    $("#cancellaDoppie").change(function () {
        setting.cancellaDoppie = $("#cancellaDoppie").is(":checked");
        salvaSetting();
    });
    $("#capsDopoPunto").change(function () {
        setting.capsDopoPunto = $("#capsDopoPunto").is(":checked");
        salvaSetting();
    });
    $("#cancellaDoppiSpazi").change(function () {
        setting.cancellaDoppioSpazio = $("#cancellaDoppiSpazi").is(":checked");
        salvaSetting();
    });
    $("#chiusuraParentesiAutomatica").change(function () {
        setting.chiusuraParentesiAutomatica = $("#chiusuraParentesiAutomatica").is(":checked");
        salvaSetting();
    });
    $("#chooseSize").change(function () {
        var ff = $("#chooseSize").val();
        setting.grandezzaTesto = ff;
        salvaSetting();
        $("#text").css("font-size", ff + "px");
        $("#lblCarattere").text(ff);
    });
    $("#velocitaLettura").change(function () {
        lettore.velocita = $("#velocitaLettura").val();
        setting.velocitaLettura = lettore.velocita;
        salvaSetting();
    });
    $("#linguaLettura").change(function () {
        lettore.lang = $("#linguaLettura").val();
        setting.linguaLettura = lettore.lang;
        salvaSetting();
    });
    $("#container").change(function () {
        $("#home").toggleClass("container");
        $("#home").toggleClass("container-fluid");
        setting.schermoIntero = !$("#container").is(":checked");
        salvaSetting();
    });
    $("#b_ordinaTesto").change(function () {
        var attivo = $("#b_ordinaTesto").is(":checked");
        cambiaOrdinaTesto(attivo);
    });
    $("#m_ordinaTesto").change(function () {
        var attivo = $("#m_ordinaTesto").is(":checked");
        cambiaOrdinaTesto(attivo);
    });
    $('#spellcheck').change(function () {
        var attivo = $('#spellcheck').is(':checked');
        setting.spellcheck = attivo;
        document.getElementById('text').setAttribute('spellcheck', setting.spellcheck.toString());
        salvaSetting();
    });
    function cambiaOrdinaTesto(attivo) {
        setting.ordinaTesto = attivo;
        salvaSetting();
        var m = document.getElementById("m_ordinaTesto");
        if (attivo) {
            ordinaTesto = true;
            m.checked = true;
        }
        else {
            ordinaTesto = false;
            m.checked = false;
        }
    }
    $(".tornaHome").click(function () {
        window.open("index.html", "_self");
    });
    $("#btnChiudiList").click(function () {
        elenco = false;
        $("#btnChiudiList").removeClass("visible");
        $("#btnChiudiList").addClass("invisible");
    });
    $("#text").keyup(function () {
        var key = window.event.keyCode;
        change(key);
    });
    document.getElementById("text").addEventListener("keypress", function () {
        salvaFile();
        var key = window.event.keyCode;
        change(key);
    });
    $("#text").change(function () {
        libreria.aggiornaTesto();
        salvaFile();
    });
    $("#b_tuttiIFile").click(function () {
        menu("tuttiIFile");
    });
    $("#impostazioni").click(function () {
        menu("impostazioni");
    });
    $("#nuovo").click(function () {
        nuovoFile("", true);
    });
    $(".play").click(function () {
        if (lettore.staLeggendo()) {
            lettore.StopLeggi();
            finitaLettura();
        }
        else {
            lettore.Leggi(libreria.getTestoDaLeggere()).addEventListener("end", function () {
                finitaLettura();
            });
            $("#player").removeClass("d-none");
            $("#play").html("<p class='non-selezionabile'>" + getStopIcon(true) + " stop" + "</p>");
        }
    });
    $(".detta").click(function () {
        console.log("detta");
        runSpeechRecognition();
    });
    $("#btnSpeed").click(function () {
        if ($("#lblSpeed").val() > 99) {
            $("#alert-cambio-velocita").toggleClass("d-none");
            setTimeout(function () {
                $("#alert-cambio-velocita").toggleClass("d-none");
            }, 2000);
        }
        else {
            $("#alert-cambio-velocita-danger").toggleClass("d-none");
            setTimeout(function () {
                $("#alert-cambio-velocita-danger").toggleClass("d-none");
            }, 2000);
        }
    });
    $("#partiVeloce").click(function () {
        letturaVeloce.parti(libreria.getTesto().getText());
        if ($("#partiVeloce").text() == "riprendi") {
            $("#partiVeloce").text("parti");
            $("#stopVeloce").text("stop");
        }
    });
    $("#stopVeloce").click(function () {
        if (letturaVeloce.inPausa()) {
            letturaVeloce.cancella();
            $("#stopVeloce").text("stop");
            $("#partiVeloce").text("parti");
        }
        else {
            letturaVeloce.stop();
            $("#stopVeloce").text("cancella");
            $("#partiVeloce").text("riprendi");
        }
    });
    $("#p_stop").click(function () {
        lettore.StopLeggi();
    });
    $("#p_pause").click(function () {
        if (lettore.LeggiInPausa()) {
            lettore.Riprendi();
            $("#p_pause").html(playerPause());
        }
        else {
            lettore.Pausa();
            $("#p_pause").html(playerPlay());
        }
    });
    $('#sostituisci').click(function () {
        var daSostituire = $('#daSostituire').val();
        var sostituta = $('#sostituta').val();
        replace(daSostituire, sostituta);
    });
});
function leggi() {
    if (lettore.staLeggendo()) {
        lettore.StopLeggi();
        finitaLettura();
    }
    else {
        lettore.Leggi(libreria.getTestoDaLeggere()).addEventListener("end", function () {
            finitaLettura();
        });
        $("#player").removeClass("d-none");
        $("#play").html("<p class='non-selezionabile'>" + getStopIcon(true) + " stop" + "</p>");
    }
}
function finitaLettura() {
    $("#player").addClass("d-none");
    $("#p_pause").html(playerPause());
    $("#play").html("<p class='non-selezionabile'>" + getPlayIcon(true) + " leggi</p>");
    $("#m_play").html(getPlayIcon(false));
}
function getStopIcon(b) {
    if (b === void 0) { b = true; }
    if (b) {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stop-fill action-icon" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>';
    }
    else {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stop-fill m_icon" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>';
    }
}
function getPlayIcon(b) {
    if (b === void 0) { b = true; }
    if (b) {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill action-icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
    }
    else {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill m_icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
    }
}
function playerPlay() {
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill p_icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
}
function playerPause() {
    return '<svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-pause-fill p_icon" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
}
function menuDo(nome) {
    $("#space_" + nome).toggleClass("d-none");
    $("#menu_" + nome).toggleClass("menu-no");
}
function menu(nome) {
    for (var i = 0; i < arguments.length; i++) {
        menuDo(arguments[i]);
    }
}
function nuovoFile(titolo, aprilo, path) {
    if (path === void 0) { path = ""; }
    var t;
    if (aprilo) {
        t = libreria.addTestoAndGoTo("", titolo, path);
        UIaggiungiTesto(t);
        UICambiaTesto(t.getId());
    }
    else {
        t = libreria.addTesto("", titolo, path);
        UIaggiungiTesto(t);
    }
}
function aggiungiFile(contenuto, titolo, aprilo, path) {
    if (path === void 0) { path = ""; }
    var t;
    if (aprilo) {
        t = libreria.addTestoAndGoTo(contenuto, titolo, path);
        UIaggiungiTesto(t);
        UICambiaTesto(t.getId());
    }
    else {
        t = libreria.addTesto(contenuto, titolo, path);
        UIaggiungiTesto(t);
    }
}
function UIaggiungiTesto(t) {
    var div = document.createElement("div");
    div.setAttribute("id", "file" + t.getId());
    div.setAttribute("class", "file swiper-slide btn-group");
    var btn1 = document.createElement("button");
    btn1.setAttribute("class", "btn btn-dark btn-no-bg padding-no");
    btn1.setAttribute("onclick", "cambiaTesto(" + t.getId() + ")");
    btn1.setAttribute("id", "titolo" + t.getId());
    btn1.setAttribute("style", "overflow-x: auto;");
    btn1.innerHTML = t.titolo;
    var cancella = document.createElement("button");
    cancella.innerHTML = xIcon();
    cancella.setAttribute("onclick", "cancella(" + t.getId() + ")");
    cancella.setAttribute("class", "cursor-pointer btn btn-dark btn-no-bg padding-no");
    var rinomina = document.createElement("button");
    rinomina.innerHTML = rinominaIcon();
    rinomina.setAttribute("onclick", "rinomina(" + t.getId() + ")");
    rinomina.setAttribute("class", "cursor-pointer btn btn-dark btn-no-bg padding-no");
    div.appendChild(btn1);
    div.appendChild(rinomina);
    div.appendChild(cancella);
    var files = document.getElementById("files");
    files.appendChild(div);
    newSwiper();
}
function xIcon() {
    return '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
}
function rinominaIcon() {
    return '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
}
function cambiaTesto(id) {
    libreria.setTestoCorrente(id);
    UICambiaTesto(id);
}
function UICambiaTesto(id) {
    var t = libreria.getTestoAt(id);
    $("#text").val(t.getText());
    $(".file").removeClass("current");
    $("#file" + id).addClass("current");
    $("#file");
}
var idToRen;
var tToRen;
var ren = new bootstrap.Modal(document.getElementById('rinomina'), {
    keyboard: false
});
function rinomina(id) {
    var t = libreria.getTestoAt(id);
    idToRen = id;
    tToRen = t;
    $("#rinominaTitolo").text("Rinomina " + t.titolo);
    $("#txtrinomina").val(t.titolo);
    ren.show();
}
function rinominaDef() {
    var id = idToRen;
    var t = tToRen;
    var titolo = $("#txtrinomina").val();
    libreria.rinominaTestoAt(id, titolo);
    $("#titolo" + id).text(titolo);
    salvaFile();
}
function cancella(id) {
    if (libreria.getTesti().length == 1) {
        libreria.removeTesto(id);
        $("#file" + id).remove();
        console.log("cancellato...n^" + id);
        nuovoFile("", true);
    }
    else {
        libreria.removeTesto(id);
        $("#file" + id).remove();
    }
    UICambiaTesto(libreria.getTestoCorrente());
    salvaFile();
}
function cancellaCorrente() {
    cancella(libreria.getTestoCorrente());
}
function rinominaCorrente() {
    rinomina(libreria.getTestoCorrente());
}
function mostraVeloce() {
    $("#home").css("display", "none");
    $("#veloce").css("display", "block");
    $(".mostraHome").removeClass("select");
    $(".mostraVeloce").addClass("select");
}
function mostraHome() {
    $("#home").css("display", "block");
    $("#veloce").css("display", "none");
    $(".mostraHome").addClass("select");
    $(".mostraVeloce").removeClass("select");
}
gestoreEventi.aggiungiEvento("fineLetturaVeloce", fineLetturaVeloce);
function fineLetturaVeloce() {
    $("#partiVeloce").text("parti");
    $("#stopVeloce").text("stop");
}
var elementoLettore = "";
var fileReader = new FileReader();
fileReader.addEventListener("load", function (event) {
    var element = document.getElementById(elementoLettore);
    var value = element.value;
    var nome = value.split("\\")[value.split("\\").length - 1];
    aggiungiFile(fileReader.result, nome, true, value);
});
$("#b_file").change(function (event) {
    elementoLettore = "b_file";
    fileReader.readAsText(event.target.files[0]);
});
$("#oFile").change(function (event) {
    elementoLettore = "oFile";
    fileReader.readAsText(event.target.files[0]);
});
var apr = new bootstrap.Modal(document.getElementById('apriF'), {
    keyboard: false
});
function apriFile() {
    apr.show();
    console.log('show');
}
var ordinaTesto = true;
var virgola = ", ";
var duePunti = " : ";
var elencoChar = "-";
var chiusuraElementiAutomatica = true;
var caps = false;
var elenco = false;
var possibileElenco = false;
var proxTrattino = false;
var sostituto = new Array();
RiempiSostituti();
function RiempiSostituti() {
    sostituto.push(new Sostituto('->', '→'));
    sostituto.push(new Sostituto('=>', '⇒'));
    sostituto.push(new Sostituto('<-', '←'));
    sostituto.push(new Sostituto('<=', '⇐'));
}
function change(keyPressed) {
    if (ordinaTesto) {
        var t = $("#text").val();
        libreria.aggiornaTesto();
        if (proxTrattino) {
            text(GetSubstring(t, 0) + "   -  ");
            proxTrattino = false;
        }
        getCursor('#text');
        if (t.length > 1 && keyPressed != 8 && !(keyPressed >= 37 && keyPressed <= 40) && !isCursorInText()) {
            switch (t[t.length - 1]) {
                case ',':
                    text(GetSubstring(t) + virgola);
                    if (setting.cancellaDoppie) {
                        if (t[t.length - 3] == ',') {
                            text(GetSubstring(t, 1));
                        }
                    }
                    break;
                case ':':
                    text(GetSubstring(t) + duePunti);
                    if (setting.cancellaDoppie) {
                        if (getCharByCursor(t, 3) == ':') {
                            text(GetSubstring(t, 1));
                        }
                    }
                    break;
                case '.':
                    setting.capsDopoPunto ? caps = true : caps = false;
                    text(GetSubstring(t) + ". ");
                    break;
                case '!':
                    setting.capsDopoPunto ? caps = true : caps = false;
                    text(GetSubstring(t) + "! ");
                    break;
                case '?':
                    setting.capsDopoPunto ? caps = true : caps = false;
                    text(GetSubstring(t) + "? ");
                    break;
                case ' ':
                    for (var h = 0; h < sostituto.length; h++) {
                        var indiceP = t.length - sostituto[h].lunghezzaSubstring() - 1;
                        if (sostituto[h].presente(t.substring(indiceP, t.length + 1))) {
                            var txt = t.substring(indiceP, t.length + 1);
                            text(GetSubstring(t, sostituto[h].lunghezzaSubstring() + 1) + sostituto[h].sostituisci(txt));
                        }
                    }
                    if (possibileElenco && t[t.length - 2] == '-') {
                        possibileElenco = false;
                        elenco = true;
                        $("#btnChiudiList").addClass("visible");
                        $("#btnChiudiList").removeClass("invisible");
                        text(GetSubstring(t, 2) + "   -  ");
                    }
                    else {
                        if (setting.cancellaDoppioSpazio) {
                            if (t[t.length - 2] == " ") {
                                text(GetSubstring(t));
                            }
                        }
                    }
                    break;
                case '(':
                    if (setting.chiusuraParentesiAutomatica) {
                        text(t + ')');
                        moveCursor('text', 1);
                    }
                    break;
                case '[':
                    if (setting.chiusuraParentesiAutomatica) {
                        text(t + ']');
                        moveCursor('text', 1);
                    }
                    break;
                case '{':
                    if (setting.chiusuraParentesiAutomatica) {
                        text(t + '}');
                        moveCursor('text', 1);
                    }
                    break;
            }
        }
        if (t.length == 1)
            caps = true;
        if (keyPressed == 13) {
            if (elenco) {
                proxTrattino = true;
            }
            else {
                possibileElenco = true;
            }
        }
        if (caps) {
            var codice = lastChar(t).charCodeAt(0);
            if (codice >= 65 && codice <= 90) {
                caps = false;
            }
            if (codice >= 97 && codice <= 122) {
                codice -= 32;
                text(GetSubstring(t) + String.fromCharCode(codice));
                caps = false;
            }
        }
    }
}
function isCursorInText() {
    var t = $('#text').val();
    if (getCursor('#text') < t.length)
        return true;
    return false;
}
function moveCursor(id, fromEnd) {
    var el = document.getElementById(id);
    el.focus();
    {
        var end = el.selectionEnd;
        el.selectionEnd = end - fromEnd;
    }
}
function setCursos(id, pos) {
    var el = document.getElementById(id);
    el.focus();
    {
        el.selectionEnd = pos;
    }
}
function getCharByCursor(t, minus) {
    if (minus === void 0) { minus = 1; }
    return t[getCursor('#text') - minus];
}
function write(t, toAdd, sub) {
    if (sub === void 0) { sub = 0; }
    console.log('testo : ', t);
    var cursorPosition = getCursor('#text') - 1;
    console.log("posizione del cursore : ", cursorPosition, ", lunghezza testo : " + t.length);
    var sub1 = t.substr(0, cursorPosition - sub);
    var sub2 = t.substr(cursorPosition + 1, t.length);
    console.log('sub : ' + toAdd + ', sub1 : ' + sub1 + ', sub2 : ' + sub2);
    sub1 += toAdd;
    var t1 = sub1 + sub2;
    text(t1);
    setCursos('#text', getCursor('#text') + 1);
}
function getCursor(id) {
    var cursorPosition = $(id).prop("selectionEnd");
    return cursorPosition;
}
function GetSubstring(t, fine) {
    if (fine === void 0) { fine = 1; }
    return t.substring(0, t.length - fine);
}
function lastChar(t) {
    return t[t.length - 1];
}
function text(text) {
    $("#text").val(text);
}
function formattaTutto() {
    var testo = $('#text').val();
    $('#text').val(formattaTesto(testo));
}
var correggiVirgole = true;
var correggiDuePunti = true;
var correggiPunti = true;
var correggiPuntiEsclamativi = true;
var correggiPuntiInterrogativi = true;
function formattaTesto(t) {
    var lunghezzaTesto = t.length;
    var toCaps = false;
    var toReturn = "";
    for (var i = 0; i < lunghezzaTesto - 1; i++) {
        switch (t[i]) {
            case ',':
                if (correggiVirgole) {
                    if (t[i + 1] != " ") {
                        t = AggiungiStringAt(t, " ", i + 1);
                    }
                }
                break;
            case ':':
                if (correggiDuePunti) {
                    if (i == 0) {
                        if (t[i + 1] != " ") {
                            t = AggiungiStringAt(t, " ", i + 1);
                        }
                    }
                    else {
                        if (t[i + 1] != " ") {
                            t = AggiungiStringAt(t, " ", i + 1);
                            if (t[i - 1] != " ") {
                                t = AggiungiStringAt(t, " ", i);
                            }
                        }
                        else if (t[i - 1] != " ") {
                            t = AggiungiStringAt(t, " ", i);
                        }
                    }
                }
                break;
            case '.':
                if (correggiPunti) {
                    if (t[i + 1] != " ") {
                        t = AggiungiStringAt(t, " ", i + 1);
                    }
                    toCaps = true;
                }
                break;
            case '!':
                if (correggiPuntiEsclamativi) {
                    if (t[i + 1] != " ") {
                        t = AggiungiStringAt(t, " ", i + 1);
                    }
                    toCaps = true;
                }
                break;
            case '?':
                if (correggiPuntiInterrogativi) {
                    if (t[i + 1] != " ") {
                        t = AggiungiStringAt(t, " ", i + 1);
                    }
                    toCaps = true;
                }
                break;
        }
        if (toCaps) {
            if (t[i].charCodeAt(0) >= 97 && t[i].charCodeAt(0) <= 122) {
                t = SostituisciCharAt(t, String.fromCharCode(t[i].charCodeAt(0) - 32), i);
                toCaps = false;
            }
            if (t[i].charCodeAt(0) >= 65 && t[i].charCodeAt(0) <= 90) {
                toCaps = false;
            }
        }
    }
    return t;
}
function AggiungiStringAt(stringa, stringaDaAggiungere, indice) {
    var substr = stringa.split(stringa.substring(0, indice));
    var fineStringa = "";
    for (var i = 1; i < substr.length; i++) {
        fineStringa += substr[i];
    }
    return stringa.substring(0, indice) + stringaDaAggiungere + fineStringa;
}
function SostituisciCharAt(stringa, sostituta, indice) {
    if (indice + 1 == stringa.length) {
        return stringa.substring(0, stringa.length - 1) + sostituta;
    }
    else {
        var SecondaParte = stringa.substring(indice + 1, stringa.length);
        return stringa.substring(0, indice) + sostituta + SecondaParte;
    }
}
function orientamento(value) {
    setting.orientamento = value;
    salvaSetting();
    $("#text").css("text-align", value);
}
function salvaFile() {
    var json = JSON.stringify(libreria);
    fs.writeFileSync(path.join(__dirname, 'files.json'), json);
}
function caricaFile() {
    if (fs.existsSync(path.join(__dirname, 'files.json'))) {
        try {
            var objJson = fs.readFileSync(path.join(__dirname, 'files.json'), "utf-8");
            var obj = JSON.parse(objJson);
            var tes = Array();
            obj.testi.forEach(function (el) {
                if (el.pathFile != "") {
                    if (!fs.existsSync(el.pathFile)) {
                        alert("il file " + el.pathFile + " non esiste, controlla se il file esiste o se è stato spostato ricaricalo");
                    }
                }
                tes.push(new Testo(el.titolo, el.text, el.idElemento, el.id, el.pathFile));
                UIaggiungiTesto(tes[tes.length - 1]);
            });
            libreria = new Libreria(tes);
            var t = libreria.setTestoCorrente(obj.testoCorrente);
            UICambiaTesto(libreria.getTesto().getId());
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        UIaggiungiTesto(libreria.getTesto());
        UICambiaTesto(0);
    }
}
function caricaSetting() {
    var file = fs.readFileSync(path.join(__dirname, "setting.json"), "utf-8");
    setting = JSON.parse(file);
    console.log(setting);
    console.log(setting.ordinaTesto.toString());
    document.getElementById("m_ordinaTesto").checked = setting.ordinaTesto;
    document.getElementById("container").checked = !setting.schermoIntero;
    document.getElementById('spellcheck').checked = setting.spellcheck;
    if (setting.schermoIntero) {
        $("#home").toggleClass("container");
        $("#home").toggleClass("container-fluid");
    }
    document.getElementById('text').setAttribute('spellcheck', setting.spellcheck.toString());
    document.getElementById("cancellaDoppie").checked = setting.cancellaDoppie;
    document.getElementById("capsDopoPunto").checked = setting.capsDopoPunto;
    document.getElementById("cancellaDoppiSpazi").checked = setting.cancellaDoppioSpazio;
    document.getElementById("chiusuraParentesiAutomatica").checked = setting.chiusuraParentesiAutomatica;
    $("#chooseSize").val(setting.grandezzaTesto);
    $("#lblCarattere").text(setting.grandezzaTesto + " px");
    $("#text").css("font-size", setting.grandezzaTesto + "px");
    $("#lblCarattere").text(setting.grandezzaTesto);
    $('#text').css({
        'background-color': setting.backgroundColor,
        'color': setting.color
    });
    switch (setting.velocitaLettura) {
        case 1:
            $("#velNormale").attr("selected", "true");
            lettore.velocita = 1;
            break;
        case 2:
            $("#velVeloce").attr("selected", "true");
            lettore.velocita = 2;
            break;
        case 0.5:
            $("#velLenta").attr("selected", "true");
            lettore.velocita = 0.5;
            break;
        default:
            $("#velNormale").attr("selected", "true");
            setting.velocitaLettura = 1;
            lettore.velocita = 1;
            break;
    }
    switch (setting.linguaLettura) {
        case "it-IT":
            $("#ita").attr("selected", "true");
            lettore.lang = "it-IT";
            break;
        case "en-EN":
            $("#eng").attr("selected", "true");
            lettore.lang = "en-EN";
            break;
        default:
            $("#ita").attr("selected", "true");
            setting.linguaLettura = "it-IT";
            lettore.lang = "it-IT";
            break;
    }
}
function salvaSetting() {
    var json = JSON.stringify(setting);
    console.log(setting);
    fs.writeFileSync(path.join(__dirname, "setting.json"), json);
}
function correggiFile() {
    if (libreria.getTesto().isFile()) {
        fs.writeFileSync(libreria.getTesto().getPath(), libreria.getTesto().getText());
    }
}
function getFileCorr() {
    var obj = {
        titolo: libreria.getTesto().titolo,
        testo: libreria.getTesto().getText(),
        isFile: libreria.getTesto().isFile(),
        path: libreria.getTesto().getPath()
    };
    return obj;
}
function getAllFile() {
    var lst = new Array();
    libreria.getTesti().forEach(function (el) {
        var obj = {
            titolo: el.titolo,
            testo: el.getText(),
            isFile: el.isFile(),
            path: el.getPath()
        };
        lst.push(obj);
    });
    return lst;
}
function makeTestoAsFile(path) {
    libreria.makeFile(path);
}
function leggiFile(file) {
    var fileCont = fs.readFileSync(file, { encoding: 'utf-8' });
    var nome = file.split("\\")[file.split("\\").length - 1];
    aggiungiFile(fileCont, nome, true, file);
}
function risolvi(s) {
    var split = s.split('\\');
    var n = "";
    for (var i = 0; i < split.length; i++) {
        if (i != split.length - 1) {
            n += split[i] + "\\\\";
        }
        else {
            n += split[i];
        }
    }
    return n;
}
function callReplace() {
    var replaceModal = new bootstrap.Modal(document.getElementById('replaceModal'), {
        keyboard: false
    });
    replaceModal.show();
}
function runSpeechRecognition() {
    var Speech = require('electron-speech');
    var recog = Speech({
        lang: 'it-IT',
        continuous: true
    });
    recog.on('text', function (text) {
        console.log(text);
    });
    recog.listen();
}
function replace(old, nuovo) {
    var text = $('#text').val();
    var v = text.split(old);
    for (var i = 0; i < v.length; i++) {
        if (i != v.length - 1) {
            v[i] += nuovo;
        }
    }
    var toRet = "";
    v.forEach(function (el) {
        toRet += el;
    });
    $('#text').val(toRet);
}
var theText = document.getElementById('text');
var fastmenuOpen = false;
function showFastmenu() {
    if (fastmenuOpen) {
        $('.fastmenu').addClass('fastmenu-no');
        theText.style.paddingRight = '0px';
    }
    else {
        $('.fastmenu').removeClass('fastmenu-no');
        theText.style.paddingRight = '120px';
    }
    fastmenuOpen = !fastmenuOpen;
}
function incrementsFontSise(fontElement, toAdd) {
    if (toAdd === void 0) { toAdd = 1; }
    var fontActualSize = $('#' + fontElement).val();
    if (fontActualSize <= 100) {
        console.log(fontElement + ', val : ' + fontActualSize);
        var fontSize = fontActualSize * 1 + toAdd * 1;
        console.log('new font size : ' + fontSize);
        theText.style.fontSize = fontSize + 'px';
        $('#' + fontElement).val(fontSize);
        $('#lblCarattere').text(fontSize);
        setting.grandezzaTesto = fontSize;
        salvaSetting();
    }
}
function decrementsFontSise(fontElement, toRemove) {
    if (toRemove === void 0) { toRemove = 1; }
    toRemove *= -1;
    var fontActualSize = $('#' + fontElement).val();
    if (fontActualSize >= 5) {
        console.log(fontElement + ', val : ' + fontActualSize);
        var fontSize = fontActualSize * 1 + toRemove * 1;
        console.log('new font size : ' + fontSize);
        theText.style.fontSize = fontSize + 'px';
        $('#' + fontElement).val(fontSize);
        $('#lblCarattere').text(fontSize);
        setting.grandezzaTesto = fontSize;
        salvaSetting();
    }
}
function changeFontColor(colorPicker) {
    var toUpdate = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        toUpdate[_i - 1] = arguments[_i];
    }
    var cp = document.getElementById(colorPicker);
    var bgC = cp.value;
    theText.style.color = bgC;
    for (var i = 0; i < toUpdate.length; i++) {
        var el = document.getElementById(toUpdate[i]);
        el.value = bgC;
    }
}
function changeBgColor(colorPicker) {
    var toUpdate = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        toUpdate[_i - 1] = arguments[_i];
    }
    var cp = document.getElementById(colorPicker);
    var bgC = cp.value;
    theText.style.backgroundColor = bgC;
    for (var i = 0; i < toUpdate.length; i++) {
        var el = document.getElementById(toUpdate[i]);
        el.value = bgC;
    }
}
function lightmode() {
    var font = '#707070';
    var back = '#ffffff';
    theText.style.backgroundColor = back;
    theText.style.color = font;
    setting.backgroundColor = back;
    setting.color = font;
    salvaSetting();
}
function darkmode() {
    var font = '#dedede';
    var back = '#343434';
    theText.style.backgroundColor = back;
    theText.style.color = font;
    setting.backgroundColor = back;
    setting.color = font;
    salvaSetting();
}
var ipcRenderer = require('electron').ipcRenderer;
var BrowserWindow = require('electron').remote.BrowserWindow;
var data = ipcRenderer.sendSync('get-file-data');
if (data === null || data === undefined || data.type == 1) {
    console.log("There is no file");
}
else {
    var type = data.type;
    var url_1 = data.url;
    if (type == 1) {
        var file = fs.readFile(url_1, ['utf-8'], function (err, cont) {
            if (err) {
                return console.error('err');
            }
            aggiungiFile(cont, fs_getFileName(url_1), true, risolvi(url_1));
        });
    }
    else if (type == 2) {
        openSpeciaDocument(url_1);
    }
}
function fs_getFileName(file) {
    var files = file.split('\\');
    var name = files[files.length - 1];
    return name;
}
function openSpeciaDocument(url) {
    var extension = path.extname(url);
    var file = url;
    file = risolvi(file);
    var newWin = new BrowserWindow({
        minWidth: 695,
        minHeight: 300,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });
    if (extension == '.pdf') {
        newWin.loadFile(file);
    }
    else if (extension == '.png' || extension == '.jpg' || extension == '.svg') {
        newWin.loadFile('src/openImage.html');
        var content_1 = newWin.webContents;
        content_1.on('did-finish-load', function () {
            content_1.executeJavaScript("setSrc('" + file + "')");
        });
    }
    else {
        newWin.loadFile('src/viewer.html');
        var content_2 = newWin.webContents;
        content_2.on('did-finish-load', function () {
            content_2.executeJavaScript("render('" + file + "')");
        });
    }
}

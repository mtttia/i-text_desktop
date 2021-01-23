
const fs = require('fs'); 
const path = require('path');


//oggetto setting
let setting = {
    schermoIntero : false,
    ordinaTesto : true,
    spellcheck : true,
    cancellaDoppie : true,
    capsDopoPunto : true,
    cancellaDoppioSpazio : true,
    chiusuraParentesiAutomatica : true,
    grandezzaTesto : 15,
    orientamento : "sinistra",
    velocitaLettura : 1,
    linguaLettura : "it-IT",
    backgroundColor : "#ffffff",
    color : "#707070"
}


//variabili utili per il corretto funzionamento
var libreria = new Libreria("");
var lettore = new Lettore();
var letturaVeloce = new LetturaVeloce("", "textVeloce", 500);





$(document).ready(() =>{
    if(fs.existsSync(path.join(__dirname, "files.json")) && fs.existsSync(path.join(__dirname, "setting.json")))
    {
        //se i file esistono allora li carico
        caricaSetting();
        caricaFile();
    }
    else
    {
        //se i file non esistono, li creo
        let settingJson = JSON.stringify(setting);
        let filesJson = JSON.stringify(libreria);
        fs.writeFileSync(path.join(__dirname, "setting.json"), settingJson);
        fs.writeFileSync(path.join(__dirname, "files.json"), filesJson);
        UIaggiungiTesto(libreria.getTesto());    
        UICambiaTesto(0);

    }
    

    //metodi per il fastmenu
    $('#char_plus').click(()=>{
        incrementsFontSise('chooseSize', 1);
    })
    $('#char_minus').click(()=>{
        decrementsFontSise('chooseSize', 1);
    })
    $('#lightmode').click(()=>{
        lightmode();
    })
    $('#darkmode').click(()=>{
        darkmode();
    })


    //metodi delle impostazioni del Dom
    //IMPOSTAZIONI DI ORDINE
    $("#cancellaDoppie").change(function () {           
        setting.cancellaDoppie = $("#cancellaDoppie").is(":checked");
        salvaSetting();
        //console.log(cancellaDoppie);
    });

    $("#capsDopoPunto").change(function () {
        setting.capsDopoPunto = $("#capsDopoPunto").is(":checked");
        salvaSetting();
    })

    $("#cancellaDoppiSpazi").change(function () {
        setting.cancellaDoppioSpazio = $("#cancellaDoppiSpazi").is(":checked");
        salvaSetting();
    })

    $("#chiusuraParentesiAutomatica").change(function(){
        setting.chiusuraParentesiAutomatica = $("#chiusuraParentesiAutomatica").is(":checked");
        salvaSetting();
    })

    //IMPOSTAZIONI DI FORMATTAZIONE
    $("#chooseSize").change(function(){
        let ff = <number> $("#chooseSize").val();
        setting.grandezzaTesto = ff;
        salvaSetting();
        $("#text").css("font-size", ff + "px");
        $("#lblCarattere").text(ff);
    })

    //IMPOSTAZIONI GENERALI
    $("#velocitaLettura").change(() => {        
        lettore.velocita = <number> $("#velocitaLettura").val();
        setting.velocitaLettura = lettore.velocita;
        salvaSetting();

        
    })

    $("#linguaLettura").change(() => {
        lettore.lang = <string> $("#linguaLettura").val();
        setting.linguaLettura = lettore.lang;
        salvaSetting();

    })

    //Impostazioni visualizzazione schermata
    $("#container").change(() => {
        $("#home").toggleClass("container");
        $("#home").toggleClass("container-fluid");
        setting.schermoIntero = !$("#container").is(":checked");
        salvaSetting();
    })

    //ordina testo
    $("#b_ordinaTesto").change(() => {
        let attivo = $("#b_ordinaTesto").is(":checked");
        cambiaOrdinaTesto(attivo);
    });
    $("#m_ordinaTesto").change(() => {
        let attivo = $("#m_ordinaTesto").is(":checked");
        cambiaOrdinaTesto(attivo);
    });
    $('#spellcheck').change(()=>{
        let attivo = $('#spellcheck').is(':checked');
        setting.spellcheck = attivo;
        document.getElementById('text').setAttribute('spellcheck', setting.spellcheck.toString());
        salvaSetting();
    })
    function cambiaOrdinaTesto(attivo : boolean)
    {
        setting.ordinaTesto = attivo;
        salvaSetting();
        var m = <HTMLElement> document.getElementById("m_ordinaTesto");
        if(attivo)
        {
            ordinaTesto = true;
            m.checked = true;
        }
        else
        {
            ordinaTesto = false;
            m.checked = false;
        }
    }


    //torna alla home
    $(".tornaHome").click(() => {
        window.open("index.html", "_self");
    })


    //chiudo le list aperte
    $("#btnChiudiList").click(function()
    {
        elenco = false;
        $("#btnChiudiList").removeClass("visible");
        $("#btnChiudiList").addClass("invisible");
    })

    
    


    $("#text").keyup(function(){
        let key = <number> window.event.keyCode;
        change(key);
    });

    document.getElementById("text").addEventListener("keypress", function(){
        salvaFile();
        var key = <number> window.event.keyCode;
        change(key);
        
    })

    $("#text").change(function (){
        libreria.aggiornaTesto();
        salvaFile();
    })

    $("#b_tuttiIFile").click(function ()
    {
        menu("tuttiIFile");
    });

    $("#impostazioni").click(function (){
        menu("impostazioni");
    });

    $("#nuovo").click(function()
    {
        nuovoFile("", true);
    })

    $(".play").click(function(){
        if(lettore.staLeggendo())
        {
            lettore.StopLeggi();
            finitaLettura();
        }
        else
        {
            lettore.Leggi(libreria.getTestoDaLeggere()).addEventListener("end", function(){
                finitaLettura();
            });
            $("#player").removeClass("d-none");
            //cambio l'icon con quella dello stop
            $("#play").html("<p class='non-selezionabile'>" + getStopIcon(true)+ " stop" + "</p>");
        }
    })

    $("#btnSpeed").click(function(){
        if(<number> $("#lblSpeed").val() > 99)
        {
            //modifica la variabile per il cambiamento della velocità
            $("#alert-cambio-velocita").toggleClass("d-none");
            setTimeout(() => {
                $("#alert-cambio-velocita").toggleClass("d-none");
            }, 2000);
        }
        else
        {
            $("#alert-cambio-velocita-danger").toggleClass("d-none");
            setTimeout(() => {
                $("#alert-cambio-velocita-danger").toggleClass("d-none");
            }, 2000);

            //$("#lblSpeed").val(valoreDellaVariabile);
        }
    })

    $("#partiVeloce").click(function(){
        //se LetturaVeloce.inPausa == true -> riprendi
        letturaVeloce.parti(libreria.getTesto().getText());
        //il metodo fineLetturaVeloce() scrive parti quando finisce la lettura veloce, viene richiamata dalla classe
        if($("#partiVeloce").text() == "riprendi")
        {
            $("#partiVeloce").text("parti");
            $("#stopVeloce").text("stop");
        }
        
    });

   

    $("#stopVeloce").click(function(){
        //se LetturaVeloce.inPausa == true -> cancella
        //il metodo fineLetturaVeloce() scrive stop quando finisce la lettura veloce, viene richiamata dalla classe
        if(letturaVeloce.inPausa())
        {
            //la cancello
            letturaVeloce.cancella();
            $("#stopVeloce").text("stop");
            $("#partiVeloce").text("parti");
        }
        else
        {
            //la fermo
            letturaVeloce.stop();
            $("#stopVeloce").text("cancella");
            $("#partiVeloce").text("riprendi");
        }
    });

    $("#p_stop").click(function(){
        lettore.StopLeggi();
    })

    $("#p_pause").click(function(){
        //diventa play se è in pausa
        if(lettore.LeggiInPausa())
        {
            lettore.Riprendi();            
            $("#p_pause").html(playerPause());
        }
        else
        {
            lettore.Pausa();
            $("#p_pause").html(playerPlay());
        }
    })

})

function leggi(){
    if(lettore.staLeggendo())
        {
            lettore.StopLeggi();
            finitaLettura();
        }
        else
        {
            lettore.Leggi(libreria.getTestoDaLeggere()).addEventListener("end", function(){
                finitaLettura();
            });
            $("#player").removeClass("d-none");
            //cambio l'icon con quella dello stop
            $("#play").html("<p class='non-selezionabile'>" + getStopIcon(true)+ " stop" + "</p>");
        }
}
function finitaLettura()
{
    $("#player").addClass("d-none");
    $("#p_pause").html(playerPause());
    //cambio l'icon col play
    $("#play").html("<p class='non-selezionabile'>" + getPlayIcon(true) + " leggi</p>");
    $("#m_play").html(getPlayIcon(false));
}
//icone
function getStopIcon(b : boolean = true ) : string
{
    if(b)
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stop-fill action-icon" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>';
    }
    else
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-stop-fill m_icon" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>';
    }
}
function getPlayIcon(b : boolean = true) : string
{
    if(b)
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill action-icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>'
    }
    else
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill m_icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>'
    }
}

function playerPlay()
{
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-play-fill p_icon" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>'
}
function playerPause()
{
    return '<svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-pause-fill p_icon" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
}


function menuDo(nome : string)
{
    $("#space_" + nome).toggleClass("d-none");
    $("#menu_" + nome).toggleClass("menu-no");
}

function menu(nome : string)
{
    for(var i = 0; i < arguments.length; i++)
    {
        menuDo(arguments[i]);
    }
}


/*metodi */
function nuovoFile(titolo : string, aprilo : boolean, path : string = "")
{
    let t : Testo;
    if(aprilo)
    {
        t = libreria.addTestoAndGoTo("", titolo, path);
        UIaggiungiTesto(t);
        UICambiaTesto(t.getId());
    }
    else
    {
        t = libreria.addTesto("", titolo, path);
        UIaggiungiTesto(t);
    }
    
}

function aggiungiFile(contenuto : string, titolo : string, aprilo : boolean, path : string = "")
{
    let t : Testo;
    if(aprilo)
    {
        t = libreria.addTestoAndGoTo(contenuto, titolo, path);
        UIaggiungiTesto(t);
        UICambiaTesto(t.getId());
    }
    else
    {
        t = libreria.addTesto(contenuto, titolo, path);
        UIaggiungiTesto(t);
    }
}

function UIaggiungiTesto(t : Testo)
{
/*
    <!-- Example split danger button -->
<div class="btn-group">
  <button type="button" class="btn btn-danger">Action</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>
    */
   var div = document.createElement("div");
   div.setAttribute("id", "file" +t.getId())
   div.setAttribute("class", "file swiper-slide btn-group");
   var btn1 = document.createElement("button");
   btn1.setAttribute("class", "btn btn-dark btn-no-bg padding-no");
   btn1.setAttribute("onclick", "cambiaTesto(" + t.getId() +")");
   btn1.setAttribute("id", "titolo" + t.getId());
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
   var files = <HTMLElement> document.getElementById("files");
   files.appendChild(div);
   newSwiper();

    
}

function xIcon() : string
{
    return '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
}

function rinominaIcon()
{
    return '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'
}

function cambiaTesto(id : number)
{
    libreria.setTestoCorrente(id);
    UICambiaTesto(id);
}

function UICambiaTesto(id : number)
{
    var t = libreria.getTestoAt(id);
    //console.log("id : " + id);
    $("#text").val(t.getText());
    $(".file").removeClass("current");
    $("#file" + id).addClass("current");
    $("#file")
}

//=====================================================================
//RINOMINA
var idToRen : number;
var tToRen : Testo;
var ren = new bootstrap.Modal(document.getElementById('rinomina'), {
    keyboard: false
})

function rinomina(id : number)
{
    var t = libreria.getTestoAt(id);
    idToRen = id;
    tToRen = t;
    $("#rinominaTitolo").text("Rinomina " + t.titolo);
    $("#txtrinomina").val(t.titolo);
    ren.show();
    
}

function rinominaDef()
{
    let id = idToRen
    let t = tToRen;
    let titolo = <string> $("#txtrinomina").val();
    libreria.rinominaTestoAt(id, titolo);

    //cambio la UI
    $("#titolo" + id).text(titolo);
    salvaFile();
}

function cancella(id : number)
{
    if(libreria.getTesti().length == 1)
    {
        //console.log("cancella...1")
        libreria.removeTesto(id);
        //onsole.log("cancella...2");
        $("#file" + id).remove();
        console.log("cancellato...n^" + id);
        nuovoFile("", true);
    }
    else{
        //console.log("cancella...1")
        libreria.removeTesto(id);
        //console.log("cancella...2");
        $("#file" + id).remove();
        //console.log("cancellato...n^" + id);
    }
    //console.log(libreria.getTestoCorrente());
    UICambiaTesto(libreria.getTestoCorrente());
    salvaFile();
}

function cancellaCorrente()
{
    cancella(libreria.getTestoCorrente());
}

function rinominaCorrente()
{
    rinomina(libreria.getTestoCorrente());
}

//switch lettutura veloce / home
function mostraVeloce() : void
{
    $("#home").css("display", "none");
    $("#veloce").css("display", "block");
    $(".mostraHome").removeClass("select");
    $(".mostraVeloce").addClass("select");
}

function mostraHome() : void
{
    $("#home").css("display", "block");
    $("#veloce").css("display", "none");
    $(".mostraHome").addClass("select");
    $(".mostraVeloce").removeClass("select");
}

//========================================================================================
/*
var myModal = new bootstrap.Modal(document.getElementById('tutorial'), {
    keyboard: false
})

function apriModal()
{
    myModal.show();
}
*/
//========================================================================================
//CODICE DI lettoreVeloce
//variabili
gestoreEventi.aggiungiEvento("fineLetturaVeloce", fineLetturaVeloce);

function fineLetturaVeloce() : void
{
    $("#partiVeloce").text("parti");
    $("#stopVeloce").text("stop");
}

//========================================================================================
//GESTIONE DEI FILE IMPORTATI
//fileReader
let elementoLettore : string = "";
let fileReader = new FileReader();
fileReader.addEventListener("load", function(event) {
    var element = <HTMLElement>document.getElementById(elementoLettore);
    var value = <string> element.value;
    let nome = value.split("\\")[value.split("\\").length - 1];
    aggiungiFile(<string>fileReader.result, nome, true, value);
})
$("#b_file").change(function(event){
    elementoLettore = "b_file";
    fileReader.readAsText(event.target.files[0]);
})
$("#oFile").change(function(event){
    elementoLettore = "oFile";
    fileReader.readAsText(event.target.files[0]);
});

var apr = new bootstrap.Modal(document.getElementById('apriF'), {
    keyboard: false
});

function apriFile()
{
    apr.show();
    console.log('show')
}

//========================================================================================
//CODICE DI testo-ordinato
//potranno essere modificati
var ordinaTesto = true;
var virgola = ", ";
var duePunti = " : ";
var elencoChar = "-";
//var cancellaDoppie = true;
//var capsDopoPunto = true;
var chiusuraElementiAutomatica = true;
//var cancellaDoppioSpazio = true;
var caps = false;
var elenco = false;
var possibileElenco = false;
var proxTrattino = false; //indica che al prossimo carattere premuto dovrà essere inserito un trattino
var sostituto = new Array(); //si attivano quando si scrive la substring e poi si spinge il comandi "spazio"
RiempiSostituti();
//sostituzioni di default
function RiempiSostituti()
{
    //sostituti di default
    /*
    -> = → 8594
    <- = ← 8592
    --> = ⇉ 8649
    <-- = ⇇ 8647
    => = ⇒ 8658
    <= = ⇐ 8656
    */
    sostituto.push(new Sostituto('->', '→'));
    sostituto.push(new Sostituto('=>', '⇒'));
    sostituto.push(new Sostituto('<-', '←'));
    sostituto.push(new Sostituto('<=', '⇐'));
}



function change(keyPressed : number)
{    
    if(ordinaTesto)
    {
    //console.log(keyPressed);    
    var t = <string> $("#text").val();
    libreria.aggiornaTesto();
    if(proxTrattino)
    {
        text(GetSubstring(t, 0) + "   -  ");
        proxTrattino = false;
    }
    //console.log(t[t.length-1] + ", stringa -> " + t + ", lunghezza -> " + t.length);
    
    getCursor('#text');
    if(t.length > 1 && keyPressed != 8 && !(keyPressed >= 37 && keyPressed <= 40) && !isCursorInText())//se cancello non modifico niente
    {
        switch(t[t.length-1]){
            case ',':
                text(GetSubstring(t)+virgola);
                if(setting.cancellaDoppie)
                {
                    if(t[t.length-3] == ',')
                    {
                        text(GetSubstring(t, 1))
                    }
                }
                break;
            case ':':
                text(GetSubstring(t) + duePunti);            
                if(setting.cancellaDoppie)
                {
                    if(getCharByCursor(t, 3) == ':')
                    {
                        text(GetSubstring(t, 1))
                    }
                }
                break;
            case '.':
                setting.capsDopoPunto ? caps = true : caps = false;
                text(GetSubstring(t) + ". ");
                //console.log("caps");
                break;
            case '!':
                setting.capsDopoPunto ? caps = true : caps = false;
                text(GetSubstring(t) + "! ");
                //console.log("caps");
                break;
            case '?':
                setting.capsDopoPunto ? caps = true : caps = false;
                text(GetSubstring(t) + "? ");
                //console.log("caps");
                break;
            case ' ':
                //controllo se è una textsostitute
                for(var h = 0; h < sostituto.length; h++)
                {
                    let indiceP = t.length - sostituto[h].lunghezzaSubstring() - 1;
                    if(sostituto[h].presente(t.substring(indiceP, t.length + 1)))
                    {                        
                        let txt = t.substring(indiceP, t.length + 1);
                        text(GetSubstring(t, sostituto[h].lunghezzaSubstring() + 1) + sostituto[h].sostituisci(txt));
                    }
                }
                if(possibileElenco && t[t.length-2] == '-'){
                    possibileElenco = false;
                    elenco = true;
                    $("#btnChiudiList").addClass("visible");
                    $("#btnChiudiList").removeClass("invisible");
                    text(GetSubstring(t, 2) + "   -  ");
                }
                else
                {
                    if(setting.cancellaDoppioSpazio)
                    {
                        if(t[t.length-2] == " ")
                        {
                            text(GetSubstring(t));
                        }
                    }
                }
                
                break;
            case '(':
                if(setting.chiusuraParentesiAutomatica)
                {
                    text(t + ')');
                    moveCursor('text', 1);
                }
                break;
            case '[':
                if(setting.chiusuraParentesiAutomatica)
                {
                    text(t + ']');
                    moveCursor('text', 1);
                }
                break;
            case '{':
                if(setting.chiusuraParentesiAutomatica)
                {
                    text(t + '}');
                    moveCursor('text', 1);
                }
                break;

        }
    }
    if(t.length == 1)
        caps = true;//la prima lettera va messa maiusola
    if(keyPressed == 13)
    {
        //ha spinto l'invio, potrebbe arrivare un elenco
        if(elenco)
        {
            proxTrattino = true;
        }
        else
        {
            possibileElenco = true;
        }
    }
    
    if(caps)
    {        
        var codice = lastChar(t).charCodeAt(0);
        //ascii -> a -> 97, z -> 122
        if(codice >= 65 && codice <= 90)
        {
            caps = false;
        }
        if(codice >= 97 && codice <= 122)
        {
            codice -= 32;
            text(GetSubstring(t) + String.fromCharCode(codice));
            caps = false;
        }
        
    }
    }
}

function isCursorInText()
{
    //dice se il cursore è all'interno del testo, in quel caso non si fa niente
    let t = <string>$('#text').val();
    if(getCursor('#text') < t.length)
        return true;
    return false;
}
    
function moveCursor(id : string, fromEnd : number)
{
	let el = <HTMLElement>document.getElementById(id);
	el.focus()
	{
		let end = el.selectionEnd;
		el.selectionEnd = end - fromEnd;
		
	}
}

function setCursos(id : string, pos : number)
{
    let el = <HTMLElement>document.getElementById(id);
	el.focus()
	{
		//let end = el.selectionEnd;
		el.selectionEnd = pos;
		
	}
}

function getCharByCursor(t:string, minus : number = 1)
{
    return t[getCursor('#text') - minus];
}

function write(t : string, toAdd : string, sub : number = 0 )
{
    //non funziona bene (cavato dal codice)
    console.log('testo : ', t);
    let cursorPosition = getCursor('#text') - 1;
    console.log("posizione del cursore : ", cursorPosition, ", lunghezza testo : " + t.length);
    let sub1 = t.substr(0, cursorPosition - sub);
    let sub2 = t.substr(cursorPosition + 1, t.length);
    console.log('sub : ' + toAdd + ', sub1 : ' + sub1 + ', sub2 : ' + sub2);
    sub1 += toAdd;
    let t1 = sub1 + sub2;
    text(t1);
    setCursos('#text', getCursor('#text') + 1);
}

function getCursor(id : string) : number
{
    let cursorPosition = $(id).prop("selectionEnd");
    return cursorPosition;
}


function GetSubstring(t : string, fine = 1)
{
    return t.substring(0, t.length - fine);
}


function lastChar(t : string){
    return t[t.length-1];
}

function text(text : string)
{
    $("#text").val(text);
}

function formattaTutto()
{
    const testo = <string>$('#text').val();
    $('#text').val(formattaTesto(testo));
}


var correggiVirgole = true;
var correggiDuePunti = true;
var correggiPunti = true;
var correggiPuntiEsclamativi = true;
var correggiPuntiInterrogativi = true;
function formattaTesto(t : string)
{
    //il simbolo a capo viene letto come /n
    var lunghezzaTesto = t.length;
    //var UltimaModifica = 0;
    var toCaps = false;
    var toReturn = "";

    for(var i = 0; i < lunghezzaTesto - 1; i++)
    {
        switch(t[i])
        {
            case ',':
                if(correggiVirgole)
                {
                    if(t[i+1] != " ")
                    {
                        //correggo aggiungendo uno spazio
                        t = AggiungiStringAt(t, " ", i+1)
                        /*UltimaModifica = i;
                        toReturn += */
                    }
                }
                break;
            case ':':
                if(correggiDuePunti)
                {
                    if(i == 0)
                    {
                        if(t[i+1] != " ")
                        {
                            //correggo aggiungendo uno spazio
                            t = AggiungiStringAt(t, " ", i+1)
                        }
                    }
                    else
                    {
                        if(t[i+1] != " ")
                        {
                            //correggo aggiungendo uno spazio
                            t = AggiungiStringAt(t, " ", i+1)
                            if(t[i-1] != " ")
                            {
                                t = AggiungiStringAt(t, " ", i);
                            }
                        }
                        else if(t[i-1] != " ")
                        {
                            t = AggiungiStringAt(t, " ", i);
                        }
                    }
                }
                break;
            case '.':
                if(correggiPunti)
                {
                    if(t[i+1] != " ")
                    {
                        //correggo aggiungendo uno spazio
                        t = AggiungiStringAt(t, " ", i+1)
                    }
                    //dice che la prossima lettera deve essere maiuscola
                    toCaps = true;
                }
                break;
            case '!':
                if(correggiPuntiEsclamativi)
                {
                    if(t[i+1] != " ")
                    {
                        //correggo aggiungendo uno spazio
                        t = AggiungiStringAt(t, " ", i+1)
                    }
                    //dice che la prossima lettera deve essere maiuscola
                    toCaps = true;
                }
                break;
            case '?':
                if(correggiPuntiInterrogativi)
                {
                    if(t[i+1] != " ")
                    {
                        //correggo aggiungendo uno spazio
                        t = AggiungiStringAt(t, " ", i+1)
                    }
                    //dice che la prossima lettera deve essere maiuscola
                    toCaps = true;
                }
                break;
        }

        if(toCaps)
        {
            if(t[i].charCodeAt(0) >= 97 && t[i].charCodeAt(0) <= 122)
            {
                //sostituisco con una lettere maiuscola
                //32 è la differenza tra le codifiche delle lettere maiuscole e di quelle minuscole nel codice ASCII
                t = SostituisciCharAt(t, String.fromCharCode(t[i].charCodeAt(0)-32), i);
                toCaps = false;
            }
            if(t[i].charCodeAt(0) >= 65 && t[i].charCodeAt(0) <= 90)
            {
                //la lettera maiuscola c'è già
                toCaps = false;
            }
        }
    }
    return t;
}

function AggiungiStringAt(stringa : string, stringaDaAggiungere : string, indice : number)
{
    //il valore viene messo dopo l'indice
    var substr = stringa.split(stringa.substring(0, indice));
    var fineStringa = "";
    for(var i = 1; i < substr.length; i++)
    {
        fineStringa += substr[i];
    }
    return stringa.substring(0, indice) + stringaDaAggiungere + fineStringa;
    
}

function SostituisciCharAt(stringa : string, sostituta : string, indice : number)
{
    //controllo se l'indice è l'ultima posizione
    if(indice+1 == stringa.length)
    {
        return stringa.substring(0, stringa.length-1) + sostituta;
    }
    else
    {
        var SecondaParte = stringa.substring(indice + 1, stringa.length);      
        return stringa.substring(0, indice) + sostituta + SecondaParte;
    }
}


//metodi delle impostazioni
//questi metodi sono al servizio del DOM
function orientamento(value : string) : void
{
    setting.orientamento = value;
    salvaSetting();
    $("#text").css("text-align", value);
}


//================================================================================================
//SALVA SU FILE
//file di salvataggio



function salvaFile()
{
    //console.log("salva");
    var json = JSON.stringify(libreria);
    fs.writeFileSync(path.join(__dirname, 'files.json'), json)
}

function caricaFile()
{
    if(fs.existsSync(path.join(__dirname, 'files.json')))
    {
        try
        {
            var objJson = <string> fs.readFileSync(path.join(__dirname, 'files.json'), "utf-8");

            var obj = JSON.parse(objJson);
            //console.log(obj);
            var tes : Testo[] = Array();
            obj.testi.forEach(el => {
                //controllo che se il path è diverso da "" il file deve esistere
                if(el.pathFile != "")
                {
                    if(!fs.existsSync(el.pathFile))
                    {
                        alert("il file " + el.pathFile + " non esiste, controlla se il file esiste o se è stato spostato ricaricalo")
                    }
                }
                tes.push(new Testo(el.titolo, el.text, el.idElemento, el.id, el.pathFile));
                UIaggiungiTesto(tes[tes.length - 1]);
            });

            libreria = new Libreria(tes);
            var t = libreria.setTestoCorrente(obj.testoCorrente);            
            UICambiaTesto(libreria.getTesto().getId());

        }catch(err)
        {
            console.error(err);
        }
    }
    else
    {
        UIaggiungiTesto(libreria.getTesto());    
        UICambiaTesto(0);
    }
 
    
    
}

function caricaSetting()
{
    var file = fs.readFileSync(path.join(__dirname, "setting.json"), "utf-8");
    setting = JSON.parse(file);
    console.log(setting);
    
    //aggiorno l'interfaccia delle applicazioni
    //impostazioni
    console.log(setting.ordinaTesto.toString());
    document.getElementById("m_ordinaTesto").checked = setting.ordinaTesto;
    document.getElementById("container").checked = !setting.schermoIntero;
    document.getElementById('spellcheck').checked = setting.spellcheck;
    if(setting.schermoIntero)
    {
        $("#home").toggleClass("container");
        $("#home").toggleClass("container-fluid");
    }
    document.getElementById('text').setAttribute('spellcheck', setting.spellcheck.toString());

    //ordine    
    document.getElementById("cancellaDoppie").checked = setting.cancellaDoppie;
    document.getElementById("capsDopoPunto").checked = setting.capsDopoPunto;
    document.getElementById("cancellaDoppiSpazi").checked = setting.cancellaDoppioSpazio;
    document.getElementById("chiusuraParentesiAutomatica").checked = setting.chiusuraParentesiAutomatica;

    //formattazione
    $("#chooseSize").val(setting.grandezzaTesto);
    $("#lblCarattere").text(setting.grandezzaTesto + " px");
    $("#text").css("font-size", setting.grandezzaTesto + "px");
    $("#lblCarattere").text(setting.grandezzaTesto);

    //grafica text    
    $('#text').css({
        'background-color' : setting.backgroundColor,
        'color' : setting.color
    })


    //generali
    switch(setting.velocitaLettura)
    {
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

    switch(setting.linguaLettura)
    {
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

function salvaSetting()
{
    let json = JSON.stringify(setting);
    console.log(setting);
    fs.writeFileSync(path.join(__dirname, "setting.json"), json);
}

function correggiFile()
{
    if(libreria.getTesto().isFile())
    {
        //se è un file posso riscriverlo
        fs.writeFileSync(libreria.getTesto().getPath(), libreria.getTesto().getText());
    }
}
//====================================================================================================
//Interazioni con main.js


function getFileCorr() : object
{
    let obj = {
        titolo : libreria.getTesto().titolo,
        testo : libreria.getTesto().getText(),
        isFile : libreria.getTesto().isFile(),
        path : libreria.getTesto().getPath()
    }
    
    return obj;
}

function getAllFile() : object[]
{
    let lst = new Array();
    libreria.getTesti().forEach(el =>{
        let obj = {
            titolo : el.titolo,
            testo : el.getText(),
            isFile : el.isFile(),
            path : el.getPath()
        }
        lst.push(obj);
    });

    return lst;
}

function makeTestoAsFile(path : string)
{
    libreria.makeFile(path);
}

function leggiFile(file : string)
{
    var fileCont = fs.readFileSync(file, { encoding : 'utf-8'});
  
  let nome = file.split("\\")[file.split("\\").length - 1];

 
  aggiungiFile(fileCont, nome, true, file);
}

function risolvi(s : string)
{
var split = s.split('\\');
var n = "";
for(var i = 0; i < split.length; i++)
{
    if(i != split.length-1)
    {
    n += split[i] + "\\\\";
    }
    else{
    n += split[i];
    }
}
return n;
}

//====================================================================================================
//TODO : shortcut da tastiera - ctrl+


//====================================================================================================
//faststyle method
let theText = <HTMLElement>document.getElementById('text');
let fastmenuOpen = false;

function showFastmenu()
{
    if(fastmenuOpen)
    {
        //lo chiudo
        
        $('.fastmenu').addClass('fastmenu-no');
        theText.style.paddingRight = '0px';        
    }
    else
    {
        
        $('.fastmenu').removeClass('fastmenu-no');
        theText.style.paddingRight = '120px';  
    }
    fastmenuOpen = !fastmenuOpen;

}

function incrementsFontSise(fontElement : string, toAdd : number = 1)
{
    /// <summary>
    /// increment text fonts df = 1
    /// </summary>

    
    const fontActualSize = <number>$('#' + fontElement).val();
    if(fontActualSize <= 100)
    {
        console.log(fontElement + ', val : ' + fontActualSize);
        let fontSize = fontActualSize*1 + toAdd*1;
        console.log('new font size : ' + fontSize);
        
        theText.style.fontSize = fontSize + 'px';
        $('#'+fontElement).val(fontSize);
        $('#lblCarattere').text(fontSize);
        setting.grandezzaTesto = fontSize;
        salvaSetting();
    }
    }

function decrementsFontSise(fontElement : string, toRemove = 1)
{
    /// <summary>
    /// decrement text fonts df = 1
    /// </summary>

    toRemove *= -1;
    const fontActualSize = <number>$('#' + fontElement).val();
    if(fontActualSize >= 5)
    {
        console.log(fontElement + ', val : ' + fontActualSize);
        let fontSize = fontActualSize*1 + toRemove*1;
        console.log('new font size : ' + fontSize);
        
        theText.style.fontSize = fontSize + 'px';
        $('#'+fontElement).val(fontSize);
        $('#lblCarattere').text(fontSize);
        setting.grandezzaTesto = fontSize;
        salvaSetting();
    }
}

function changeFontColor(colorPicker : string, ...toUpdate : string[])
{
    /// <summary>
    /// change font color
    /// </summary>

    const cp = <HTMLElement>document.getElementById(colorPicker);

    let bgC = cp.value;
    theText.style.color = bgC;

    for(let i = 0; i < toUpdate.length; i++)
    {
        let el = <HTMLElement>document.getElementById(toUpdate[i]);
        el.value = bgC;
    }
}

function changeBgColor(colorPicker : string, ...toUpdate : string[])
{
    /// <summary>
    /// change background Color
    /// </summary>

    const cp = <HTMLElement>document.getElementById(colorPicker);
    

    let bgC = cp.value;
    theText.style.backgroundColor = bgC;

    for(let i = 0; i < toUpdate.length; i++)
    {
        let el = <HTMLElement>document.getElementById(toUpdate[i]);
        el.value = bgC;
    }
}

function lightmode()
{//colorPickerFont : string, colorPickerBackground : string, toUpdateFont : string, toUpdateBg:string
    /// <summary>
    /// set text to lightmode
    /// </summary>
/*
    let cpF = <HTMLElement>document.getElementById(colorPickerFont);
    let cpB = <HTMLElement>document.getElementById(colorPickerBackground);
    const toUpF = <HTMLElement>document.getElementById(toUpdateFont);
    const toUpB = <HTMLElement>document.getElementById(toUpdateBg);
*/
    const font = '#707070';
    const back = '#ffffff';
/*
    cpF.value = font;
    cpB.value = back;
*/
    theText.style.backgroundColor = back;
    theText.style.color = font;
/*
    toUpF.value = font;
    toUpB.value = back;
    */
    setting.backgroundColor = back;
    setting.color = font;
    salvaSetting();
}

function darkmode()
{//colorPickerFont : string, colorPickerBackground : string, toUpdateFont : string, toUpdateBg:string
    /// <summary>
    /// set text to darkmode
    /// font cdcdcd
    /// back 343434
    /// </summary>
/*
    let cpF = <HTMLElement>document.getElementById(colorPickerFont);
    let cpB = <HTMLElement>document.getElementById(colorPickerBackground);
    const toUpF = <HTMLElement>document.getElementById(toUpdateFont);
    const toUpB = <HTMLElement>document.getElementById(toUpdateBg);
*/
    const font = '#dedede';
    const back = '#343434';
/*
    cpF.value = font;
    cpB.value = back;
*/
    theText.style.backgroundColor = back;
    theText.style.color = font;
/*
    toUpF.value = font;
    toUpB.value = back;
*/
    setting.backgroundColor = back;
    setting.color = font;
    salvaSetting();
}

//apri file con i-text
const {ipcRenderer} = require('electron');
const { BrowserWindow } = require('electron').remote
const win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')

var data = ipcRenderer.sendSync('get-file-data')
if (data ===  null) {
    console.log("There is no file")
} else {
    // Do something with the file.
    let file = fs.readFile(data, ['utf-8'], (err : any, cont : any)=>{
        if(err){return console.error('err')}
        aggiungiFile(cont, fs_getFileName(data), true, risolvi(data));
    });

    
}

function fs_getFileName(file : any) : string
{
    let files = file.split('\\');
    let name = files[files.length - 1];
    return name;

}
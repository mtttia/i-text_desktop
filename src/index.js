const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { valHooks } = require('jquery');
const fs = require('fs');
const path = require('path');
const { exception } = require('console');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('get-file-data', function(event) {
  try{
    var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  let t = 1;
  if(estensioni.includes(path.extname(data)))
    t = 2;

  let toSend = {
    type : t,
    url : data
  }

  if(data != null)
  event.returnValue = toSend;
  /*toSend.type, legend
  1 - apro un file normale con il blocco note
  2 - apro un file che supporta la renderizzazione (contenuto nella lista estensioni)
  */
  }catch{}
})

const estensioni = ['.pdf', '.odt', '.odp', '.png', '.jpg', '.svg'];


function createWindow () {
  const win = new BrowserWindow({
    minWidth : 695,
    minHeight : 300,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule : true
    }
  })

  const contents = win.webContents;

  win.loadFile('src/index.html');
  contents.toggleDevTools();

  var menu = Menu.buildFromTemplate([
    {
      label:"File",
      submenu: [
        {
          label: "Nuovo",
          accelerator : "CommandOrControl+N",
          click()
          {
            eseguijs(contents, "nuovoFile('', true)");
          }
        },
        { type: 'separator' },
        {
          label: "Apri file",
          accelerator : "CommandOrControl+O",
          click(){
            apriFile(contents);
          }
        },
        {
          label : "Apri cartella",
          accelerator : "CommandOrControl+D",
          click()
          {
            apriCartella(contents);
          }
        },
        { type: 'separator' },
        {
          label : "Salva",
          accelerator : "CommandOrControl+S",
          click(){
            salvaFile(contents);
          }
        },
        {
          label: "Salva con Nome",
          accelerator : "CommandOrControl+Shift+S",
          click(){
            salvaConNome(contents);
          }
        },
        {
          label: "Salva Tutto",
          accelerator : "CommandOrControl+Alt+S",
          click()
          {
            salvaTutti(contents);
          }
        },
        
      ]
    },
    {
      label: 'Modifica',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label : "Ordinamento",
      submenu : [
        {
          label : "Ordina Tutto",
          accelerator : "CommandOrControl+Shift+O",
          click()
          {
            //lo eseguo due volte perchè a volte alla prima non sistema tutto
            eseguijs(contents, "formattaTutto()");
            eseguijs(contents, "formattaTutto()");
          }
        },
        { type: 'separator' },
        {
          label : "Opzioni",
          click()
          {
            eseguijs(contents, "menu('ordine')");
          }
        }
              ]
    },
    {
      label : "Lettura",
      submenu : [
        {
          label : "Leggi",
          accelerator : "CommandOrControl+Alt+R",
          click(){
            eseguijs(contents, "leggi()");
          }
        },
        { type: 'separator' },
        {
          label : "Opzioni",
          click(){
            eseguijs(contents, "menu('generali')");
          }
        }
      ]
    },
    {
      label: 'Codice',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu : [
        {
          label : 'trova e sostituisci',
          click(){
            eseguijs(contents, "callReplace()");
          }
        }
      ]
    }

  ]);

  Menu.setApplicationMenu(menu);
  //win.removeMenu();

}

app.on('open-file', (event, path) => {
  console.log("Event : " + event + "\npath : " + path);
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function eseguijs(contents, esegui)
{
    contents.executeJavaScript(esegui);
}

function apriFile(cont, win)
{
  var files = dialog.showOpenDialogSync(win, {
    properties : ['openFile']
    
  });

  if(!files) return;

  var file = files[0];

  let extension = path.extname(file);

  console.log(extension);
  if(estensioni.includes(extension)) //estensioni supportate
  {
    //apro il file in sola lettura con viewer js
    //chiedo se vuole farlo
    let risp = dialog.showMessageBoxSync(win, {
      type : 'info',
      buttons : ['no', 'si'],
      title : 'anteprima documento disponibile',
      message : 'il documento ' + file + ', è supportato per essere visualizzato in sola lettura, vuoi aprirlo?',

    });
    file = risolviPath(file);
    switch(risp)
    {
      case 0:
        //non aperto in lettura
        
        cont.executeJavaScript("leggiFile(\"" + file +"\")");
        break;
      case 1:
        //apro il documento con viewer js
        let newWin = new BrowserWindow({
          minWidth : 695,
          minHeight : 300,
          width: 800,
          height: 600,
          webPreferences: {
            nodeIntegration: true,
            webviewTag: true //Enable webviewTag
          }
        });

        //newWin.webContents.toggleDevTools();
        if(extension == '.pdf')
        {
          //chromium apre i pdf in automatico
          newWin.loadFile(file);
        }
        else if(extension == '.png'|| extension == '.jpg'|| extension == '.svg')
        {
          //apro col visualizzatore di immagini
          newWin.loadFile('src/openImage.html');
          const content = newWin.webContents;
          content.on('did-finish-load', ()=>{
            content.executeJavaScript("setSrc('"+ file +"')");
          })
        }
        else
        {
          newWin.loadFile('src/viewer.html');
          const content = newWin.webContents;
          content.on('did-finish-load', ()=>{
            content.executeJavaScript("render('" + file + "')");
          });
        }
        
        break;
    }
  }
  else
  {
    file = risolviPath(file);
    cont.executeJavaScript("leggiFile(\"" + file +"\")");
  }
  

  
}

function salvaFile(cont) 
{
  //devo salvare il file corrente
  //ritorna un oggetto con testo, isFile, path, titolo
  var t = cont.executeJavaScript("getFileCorr()");
  t.then(function(result){
    //console.log(result);
    var testo = result;

    if(testo.isFile)
    {
      //è un file devo solo salvarlo e quindi sovrascriverlo
      fs.writeFileSync(testo.path, testo.testo);
      console.log("sovrascritto");
    }
    else
    {
      //devo salvarlo, quindi devo chiedere un path
      //console.log(testo.titolo);
      var path = dialog.showSaveDialogSync({
        title : testo.titolo + ".txt",
        
      });
      if(path === undefined)
        return;
      
      path = risolviPath(path);
      fs.writeFileSync(path, testo.testo);
      cont.executeJavaScript('makeTestoAsFile("' + path + '")')
    }
  });


}

function salvaConNome(cont) 
{
  //devo salvare il file corrente
  //ritorna un oggetto con testo, isFile, path, titolo
  var t = cont.executeJavaScript("getFileCorr()");
  t.then(function(result){
    //console.log(result);
    var testo = result;

    
    //devo salvarlo, quindi devo chiedere un path
    //console.log(testo.titolo);
    var path = dialog.showSaveDialogSync({
      title : testo.titolo + ".txt",
      
    });
    if(path === undefined)
      return;
    
    path = risolviPath(path);
    fs.writeFileSync(path, testo.testo);
    cont.executeJavaScript('makeTestoAsFile("' + path + '")')
  });

  
}
function risolviPath(s)
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

function salvaTutti(cont)
{
  var t = cont.executeJavaScript("getAllFile()");
  t.then(function(result){
    //console.log(result);
    var testi = result; //testi è un array di object
    console.log(testi);
    testi.forEach(testo => {
      if(testo.isFile)
      {
        //è un file devo solo salvarlo e quindi sovrascriverlo
        fs.writeFileSync(testo.path, testo.testo);
      }
    });

    
  });
}

function apriCartella(cont, win)
{
  let files = dialog.showOpenDialogSync(win, {
    properties : [
      'openDirectory'
    ]
  })

  if(!files) return;
  
  let pathDir = files[0];
  
  fs.readdir(pathDir, 'utf-8', (err, files)=>{
    if(err) return console.log(err);
    let allFile  = getFiles(files);
    //li apro uno a uno
    allFile.forEach(el =>{
      el = pathDir + "\\" + el;
      el = risolviPath(el);
      cont.executeJavaScript("leggiFile(\"" + el +"\")");
    })
  })
  
  function getFiles(files)
  {
    //remove directory
    let toRet = new Array();
    files.forEach(el => {
      if(path.extname(el) != '')
      {
        toRet.push(el);
      }
    });
  
    return toRet;
  
  }
}
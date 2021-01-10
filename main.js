const { app, BrowserWindow, Menu, dialog } = require('electron');
const { valHooks } = require('jquery');
const fs = require('fs');



function createWindow () {
  const win = new BrowserWindow({
    minWidth : 640,
    minHeight : 300,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const contents = win.webContents;

  win.loadFile('index.html');
  contents.toggleDevTools();

  var menu = Menu.buildFromTemplate([
    {
      label:"File",
      submenu: [
        {
          label: "Nuovo",
          
          click()
          {
            eseguijs(contents, "nuovoFile('', true)");
          }
        },
        {
          label: "Apri",
          click(){
            apriFile(contents);
          }
        },
        {
          label : "Salva file",
          click(){
            salvaFile(contents);
          }
        },
        {
          label: "Salva con nome",
          click(){
            salvaConNome(contents);
          }
        }
      ]
    },
    {
      label: "impostazioni",
      submenu : [
        {
          label : "ordine",
          click()
          {
            eseguijs(contents, "menu('ordine')");
          }
        },
        {
          label : "formattazione",
          click()
          {
            eseguijs(contents, "menu('formattazione')");
          }
        },
        {
          label : "generali",
          click()
          {
            eseguijs(contents, "menu('generali')");
          }
        }
      ]
    },
    {
      label : "leggi",
      submenu : [
        {
          label : "leggi",
          click(){
            eseguijs(contents, "leggi()");
          }
        },
        {
          label : "impostazioni",
          click(){
            eseguijs(contents, "menu('generali')");
          }
        }
      ]
    },
    {
      label: 'Edit',
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
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
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

  file = risolviPath(file);
  cont.executeJavaScript("leggiFile(\"" + file +"\")");

  
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
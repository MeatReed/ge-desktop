// Requirements
const {app, BrowserWindow, ipcMain} = require('electron')
const Menu                          = require('electron').Menu
const ejse                          = require('ejs-electron')
const fs                            = require('fs')
const path                          = require('path')
const semver                        = require('semver')
const url                           = require('url')
const axios = require('axios');
let thisversion='1.0.0'
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
 
// const adapter = new FileSync('db.json')
// const db = low(adapter)

// Disable hardware acceleration.
// https://electronjs.org/docs/tutorial/offscreen-rendering
app.disableHardwareAcceleration()

// https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {

    win = new BrowserWindow({
        width: 1200,
        height: 650,
        icon: 'icon.png',
        menu: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    axios.get('http://ged.stereo18.ml/status.json')
  .then(function (response) {
    if (response.data.test!='true'){
        var target = url.format({
            pathname: path.join(__dirname, 'app', 'noco.html'),
            protocol: 'file:',
            slashes: true
        })
        win.loadURL(target)
    }
    
    else{
        axios.get('https://api.github.com/repos/ghost-land/ge-desktop/releases/latest').then(function (response) {
            let latest = response.data.tag_name
            console.log(latest)
            if(latest!=thisversion){
                var target = url.format({
                    pathname: path.join(__dirname, 'app', 'outofdate.html'),
                    protocol: 'file:',
                    slashes: true
                })
            }
            else{var target = 'http://ged.stereo18.ml'}
            win.loadURL(target)
        })
    }
    
  
  })



    /*win.once('ready-to-show', () => {
        win.show()
    })*/

    win.removeMenu()

    win.resizable = true

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
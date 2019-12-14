const appBasicLayout = () => {
  appendElement(document.body, 'div', {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    children: [
      { div: { id: 'menu', display: 'flex', flexDirection: 'column', width: 'auto' } },
      { div: { id: 'main', flexGrow: 1, background: '#fff', color: 'black', overflow: 'scroll'} }
    ]
  })
}

const whenDatabaseReady = () => {
  appBasicLayout() 
  SYSTEM.CALL('menu:show')
}

const whenAppReady = () =>  {
  SYSTEM.CALL('db:open', () => SYSTEM.CALL('db:batch', PREPARE_DB, whenDatabaseReady))
}

document.addEventListener('deviceready', whenAppReady, false)

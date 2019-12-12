const goToPage = () => $('main').innerHTML = ''

document.addEventListener('deviceready', () =>
  openDB(db => {
    sqlSession(db, tx => INITIAL_SQL.forEach(SQL => tx.executeSql(SQL)), () => {
      //app basic layout
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
      //load items in menu
      projectsListPanel(app, PROJECT_ICONS, db)
    })
  }), false)

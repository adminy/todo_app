css('.projects_menu_item', {
    // background: 'tomato',
    color: 'white',
    'font-weight': 'bold',
    'font-size': '220%',
    'text-align': 'center'
})
css('#menuLeftScroll::-webkit-scrollbar ', { display: 'none' })

const onMenuIcon = (e, db) => {
    const listOfIcons = $('menuLeftScroll').children
    for(let j = 0; j < listOfIcons.length; j++)
        listOfIcons[j].style.border = ''
    if(e.srcElement.hasAttribute('data-id')) {
        e.srcElement.parentElement.style.border = '2px solid red'
        loadProjectPage(db, e.srcElement.getAttribute('data-id'))
    }
}

const populateLeftMenu = (db) => { //......... https://material.io/resources/icons/?icon=rowing&style=baseline
    $('menuLeftScroll').innerHTML = ''
    sqlQuery(db, SQLS.Projects, [], res => {
        for(let i = 0; i < res.rows.length; i++) {
            const ProjectIcon = res.rows.item(i).ProjectIcon
            const ProjectID = res.rows.item(i)._id

            appendElement($('menuLeftScroll'), 'div', { 
                borderRadius: '30%',
                width: 'auto',
                background: FRIENDLY_COLOURS[ProjectIcon], 
                color: blackOrWhite(FRIENDLY_COLOURS[ProjectIcon]), 
                ontouchstart: (e) => onMenuIcon(e, db),
                child: {i: { class: 'material-icons', 'data-id': ProjectID, fontSize: '320%', cursor: 'pointer', text:  PROJECT_ICONS[ProjectIcon]}}
            })
        }
    })
}
  
const onNewProject = (db) => {
    const listOfIcons = $('menuLeftScroll').children
    for(let j = 0; j < listOfIcons.length; j++)
        listOfIcons[j].style.border = ''
    createProject(db)
}

const projectsListPanel = (db) => {
    //plus button
    appendElement($('menu'), 'div', {class: 'projects_menu_item',  child: {i: {
        class: 'material-icons',
        text: 'add_circle_outline',
        borderRadius: '50%',
        border: '3px solid limegreen',
        backgroundColor: 'green',
        backgroundImage: 'linear-gradient(green, lightgreen)',
        fontSize: '200%',
        cursor: 'pointer',
        height: 'auto',
        ontouchstart: () => onNewProject(db)
    }}})

    appendElement($('menu'), 'div', {
        id: 'menuLeftScroll',
        overflowY: 'scroll',
        textAlign: 'center',
        flex: 1
    })
    populateLeftMenu(db)  
}
  
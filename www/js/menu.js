const onMenuIcon = event =>
    SYSTEM.CALL('project:show', event.srcElement.getAttribute('data-id'))

const newMenuIcon = (projectID, ProjectIcon) =>
    appendElement($('menuLeftScroll'), 'div', { 
        borderRadius: '30%',
        width: 'auto',
        background: FRIENDLY_COLOURS[ProjectIcon], 
        color: blackOrWhite(FRIENDLY_COLOURS[ProjectIcon]), 
        ontouchstart: onMenuIcon,
        child: {i: {
            class: 'material-icons',
            'data-id': projectID,
            fontSize: '320%',
            cursor: 'pointer',
            text: PROJECT_ICONS[ProjectIcon]
        }}
    })
  
const onPlusButton = () => {
    const listOfIcons = $('menuLeftScroll').children
    for(let j = 0; j < listOfIcons.length; j++)
        listOfIcons[j].style.border = ''
    SYSTEM.CALL('project:new')
}

const plusButton = () =>
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
        ontouchstart: onPlusButton
    }}})

const tagEditButton = () =>
    appendElement($('menu'), 'div', {class: 'projects_menu_item',  child: {i: {
        class: 'material-icons',
        text: 'style',
        borderRadius: '50%',
        border: '3px solid lightblue',
        backgroundColor: 'blue',
        backgroundImage: 'linear-gradient(blue, lightblue)',
        fontSize: '200%',
        cursor: 'pointer',
        height: 'auto',
        ontouchstart: () => SYSTEM.CALL('tags:edit')
    }}})



const projectsList = () =>
    appendElement($('menu'), 'div', {
        id: 'menuLeftScroll',
        overflowY: 'scroll',
        textAlign: 'center',
        flex: 1
    })

SYSTEM.DEF('menu:projects:list', (whenDone) => {
    whenDone = whenDone || (() => {})
    SYSTEM.HTML('#menuLeftScroll', html='')
    SYSTEM.CALL('db:query', SQLS.Projects, [], projects => {
        projects.forEach(project => newMenuIcon(project._id, project.ProjectIcon))
        whenDone()
    })
})

SYSTEM.DEF('menu:show', () => {
    tagEditButton()
    plusButton()
    projectsList()
    SYSTEM.CALL('menu:projects:list')
})

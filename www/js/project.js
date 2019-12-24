const whenProjDeleted = () => {
  SYSTEM.HTML('#main', html='')
  SYSTEM.CALL('menu:projects:list')
}

const deleteProject = projectID => {
  SYSTEM.CALL('db:query', SQLS.TasksForProj, [projectID], tasks =>
    SYSTEM.CALL('db:query:rec', SQLS.DeleteLinkTags2Task, [], tasks.map(task => task.TaskID), () =>
      SYSTEM.CALL('db:query:rec', SQLS.DeleteLinkTask2Proj, [], tasks.map(task => task.TaskID), () =>
        SYSTEM.CALL('db:query:rec', SQLS.DeleteTask, [], tasks.map(task => task.TaskID), () =>
          SYSTEM.CALL('db:query', SQLS.DeleteProject, [projectID], whenProjDeleted)))))
}

const whenProjectCreated = projectID => {
  SYSTEM.CALL('menu:projects:list', () =>
    SYSTEM.CALL('project:show', projectID))
}

const onCreateProject = () => {
  const form = $('create_project_form').children
  const icons = $('project_icons').children
  const isSelected = icon => icon.style.border == '2px solid red'
  const name = form[0].children[1].value.trim()
  const goal = form[1].children[1].value.trim()
  const icon = SYSTEM.FILTER_INDEX(icons, isSelected)[0]
  const timeNow = new Date().getTime()
  if(name == '' || goal == '')
    for(let i = 0; i < 3; i++)
      form[i].children[2].style.color = 'red'
  else
    SYSTEM.CALL('db:insert', SQLS.InsertProject, [name, goal, icon, timeNow], whenProjectCreated)
}

const prepareIcons = (icons, attrName) => {
  loadIcons(icons, attrName, e => { //class:glass => 'linear-gradient(#258,#aef)', 'linear-gradient(#700,#f00)', 'linear-gradient(#740,gold)', 'linear-gradient(#507,#eaf)', 'linear-gradient(#b40,orange)', 'linear-gradient(#073,#0fa)','linear-gradient(#000,#888)'

    for(const icon of icons.children)
      icon.style.border = ''
    if(e.srcElement.hasAttribute(attrName)) //bug ios (if stement fixes it)
      e.srcElement.parentElement.style.border = '2px solid red'

  })
}

const loadIcons = (icons, id, selectIconCallback) => {
  for(let i = 0; i < PROJECT_ICONS.length; i++)
    appendElement(icons, 'div', { 
      borderRadius: '30%',
      margin: '4px', 
      border: i == 0 ? '2px solid red' : '',
      width: 'auto', 
      display: 'inline-block', 
      background: FRIENDLY_COLOURS[i], 
      color: blackOrWhite(FRIENDLY_COLOURS[i]),
      ontouchstart: selectIconCallback,
      child: {i: {
        class: 'material-icons',
        [id]: i,
        fontSize: '320%',
        cursor: 'pointer',
        text:  PROJECT_ICONS[i]
      }}
    })
}

const createProjectForm = () => {
  appendElement($('main'), 'div', {class: 'form-style-7', child: {ul: {id: 'create_project_form', children: [
    {li: {children: [
      {label: {for: 'project_name', text: 'Project Name'}},
      {input: {type: 'text', name: 'project_name'}},
      {span: {text: 'Enter Project Name here'}}
    ]}},
    {li: {children: [
      {label: {for: 'project_goal', text: 'Goal'}},
      {textarea: { name: 'project_goal', rows: 4, cols: 50, height: '120px'}},
      {span: {text: 'Say what the goal of the project is'}}
    ]}},
    {li: {id: 'icons_slots', children: [
      {label: {for: 'project_icons', text: 'Logo / Icon'}},
      {div: {id: 'project_icons', overflowX: 'scroll', height: '30vh', width: '100%'}},
      {span: {text: 'Select a project icon from above'}}
    ]}},
    {li: {children: [
      {button: {
        ontouchstart: onCreateProject,
        text: 'Create Project',
        class: 'glass',
        background: 'linear-gradient(#258,#aef)'
      }}
    ]}}
  ]}}})
}

SYSTEM.DEF('project:new', () => {
  SYSTEM.HTML('#main', html='')
  createProjectForm()
  prepareIcons($('project_icons'), 'data-id')
})


SYSTEM.DEF('project:edit', res => {
  SYSTEM.HTML('#main', html='')
  appendElement($('main'), 'div', { id: 'edit_project_form', textAlign: 'center', children: [
    {input: {value: res.ProjectName, placeholder: 'Project name', width: '80%', fontSize: '17px'}},
    {br:{}},
    {textarea: {value: res.ProjectGoal, text: res.ProjectGoal, placeholder: 'Project Goal', width: '80%', height: '25vh', fontSize: '17px'}},
    {h3: {text: 'Project Finish Date'}},
    {input: {type: 'date', value: res.ProjectEndDate ? $DATE(res.ProjectEndDate).split('/').reverse().join('-') : '', placeholder: 'Project Finish Date', width: '80%', fontSize: '17px'}},
    {br: {}},
    {div: {}}, {br: {}},
    {div: {textAlign: 'center', children: [
      {button: { text: 'Update Project', class: 'glass', background: 'linear-gradient(#740,gold)', ontouchstart: () =>
        SYSTEM.CALL('db:query', SQLS.UpdateProject, [
          $('edit_project_form').children[0].value,
          $('edit_project_form').children[2].value,
          SYSTEM.FILTER_INDEX($('edit_project_form').children[6].children, element => element.style.border == '2px solid red')[0],
          new Date($('edit_project_form').children[4].value).getTime(),
          res._id
        ], () => SYSTEM.CALL('menu:projects:list', () =>
          SYSTEM.CALL('project:show', res._id)))
      }}
    ]}}
  ]})

  const icons = $('edit_project_form').children[6]

  prepareIcons(icons, 'data-edit-id')
  //select default
  for(const icon of icons.children)
    icon.style.border = icon.children[0].getAttribute('data-edit-id') == res.ProjectIcon ? '2px solid red' : ''
})

SYSTEM.DEF('project:show', projectID => {
  SYSTEM.HTML('#main', html='')
  SYSTEM.CALL('db:query', SQLS.Project, [projectID], res => {
    res = res[0]
    const startDate = $DATE(res.ProjectStartDate)
    const endDate = res.ProjectEndDate ? $DATE(res.ProjectEndDate) : ''
    const deleteMsg = `Are you sure you want to delete project ${res.ProjectName}`
    const deleteCb = () => deleteProject(projectID)

    appendElement($('main'), 'div', {id: 'project_page', children: [
      {h3: {textAlign: 'center', text: res.ProjectName}},
      {br: {}},
      {span: {float: 'left', color: 'green', text: startDate}},
      {span: {float: 'right', color: 'red', text: endDate}},
      {br: {}},
      {button: {text: 'delete', color: 'red', border: '1px solid orange', fontSize: '16px', float: 'right', ontouchstart: () => 
        deleteCb() // $TCB(confirm(deleteMsg), deleteCb)
      }},
      {span: {text: '. .', float: 'right'}},
      {button: {text: 'edit', border: '1px solid orange', fontSize: '16px', float: 'right', ontouchstart: () => 
        SYSTEM.CALL('project:edit', res)
      }},
      {div: {fontSize: '17px', color: '#ccc', text: 'Goal:', float: 'left'}},
      {br: {}}, {br: {}},
      {div: { text: res.ProjectGoal, class: 'ow', fontSize: '17px', width: '100%'}},
      {div: {textAlign: 'center', children: [
        {button: { text: 'Create Task', class: 'glass', background: 'linear-gradient(#507,#eaf)', ontouchstart: () =>
          SYSTEM.CALL('task:new', res._id, res.ProjectName, res.ProjectIcon)
        }}
      ]}}
    ]})
    SYSTEM.CALL('tasks:list', $('project_page'), res._id)
  })
  for(const icon of $('menuLeftScroll').children)
    icon.style.border = icon.children[0].getAttribute('data-id') == projectID ? '2px solid red' : ''
})

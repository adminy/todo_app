const deleteProject = (db, projectID) => {
  const recTaskPop = (tasks, callbackFinished) => {
      if(tasks.length == 0) callbackFinished()
      else {
          const TaskID = tasks.pop()
          sqlQuery(db, SQLS.TagsForTask, [TaskID], res =>
            deleteTask(db, TaskID, $indexList(res.rows.length)
            .map(i => res.rows.item(i).TagID), () =>
              recTaskPop(tasks, callbackFinished)))
      }
  }
  sqlQuery(db, SQLS.Tasks, [projectID], res => {
      const tasks = $indexList(res.rows.length).map(i => res.rows.item(i).TaskID)
      recTaskPop(tasks, () =>
          sqlQuery(db, SQLS.DeleteProject, [projectID], () =>
            populateLeftMenu(db)))
  })
}

const onCreateProject = (db) => {
  const lis = $('create_project_form').children
  const listOfIcons = $('project_icons').children
  let selectedIcon = 0
  for(let j = 0; j < listOfIcons.length; j++)
    if(listOfIcons[j].style.border == '2px solid red')  {
        selectedIcon = j
        break
    }
  const projectName = lis[0].children[1].value
  const projectGoal = lis[1].children[1].value
  if(projectName.trim() == '')
    lis[0].children[2].style.color = 'red'
  else if(projectGoal.trim() == '')
    lis[1].children[2].style.color = 'red'
  else
    insertQuery(db, SQLS.InsertProject,
      [projectName.trim(), projectGoal.trim(), selectedIcon, new Date().getTime()], (projectID) => {
        loadProjectPage(db, projectID)
        populateLeftMenu(db)
    })
}

const projectIconSelect = (e) => {
  const listOfIcons = $('project_icons').children
  
  for(let i = 0; i < listOfIcons.length; i++)
      listOfIcons[i].style.border = ''

  if(e.srcElement.hasAttribute('data-id'))
      e.srcElement.parentElement.style.border = '2px solid red'

}

const loadIcons = () => {

  for(let i = 0; i < 12; i++)

    appendElement($('project_icons'), 'div', { 
      borderRadius: '30%', 
      margin: '4px', 
      border: i == 0 ? '2px solid red' : '',
      width: 'auto', 
      display: 'inline-block', 
      background: FRIENDLY_COLOURS[i], 
      color: blackOrWhite(FRIENDLY_COLOURS[i]),
      ontouchstart: projectIconSelect,
      child: {i: { class: 'material-icons', 'data-id': i, fontSize: '320%', cursor: 'pointer', text:  PROJECT_ICONS[i]}}
    })
}

const createProject = (db) => {
  $('main').innerHTML = ''
  //form
  appendElement($('main'), 'div',  {class: 'form-style-7', child: {ul: {id: 'create_project_form', children: [
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
      {div: {id: 'project_icons', overflowX: 'scroll', height: '20vh', width: '100%'}},
      {span: {text: 'Select a project icon from above'}}
    ]}},
    {li: {children: [
      {button: { ontouchstart: () => onCreateProject(db), text: 'Create Project',
                class: 'glass',  background: 'linear-gradient(#258,#aef)'}}
      ]}}
  ]}}})
  loadIcons()
    //class:glass => 'linear-gradient(#258,#aef)', 'linear-gradient(#700,#f00)', 'linear-gradient(#740,gold)', 'linear-gradient(#507,#eaf)', 'linear-gradient(#b40,orange)', 'linear-gradient(#073,#0fa)','linear-gradient(#000,#888)'
}

const loadProjectPage = (db, projectID) => {
  $('main').innerHTML = ''

  sqlQuery(db, SQLS.Project, [projectID], res => {
    res = res.rows.item(0)
    const startDate = $DATE(res.ProjectStartDate)
    const endDate = res.ProjectEndDate ? $DATE(res.ProjectEndDate) : ''

    appendElement($('main'), 'div', {id: 'project_page', children: [
      {h3: {textAlign: 'center', text: res.ProjectName}},
      {br: {}},
      {span: {float: 'left', color: 'green', text: startDate}},
      {span: {float: 'right', color: 'red', text: endDate}},
      {br: {}},
      {button: {text: 'x', color: 'red', float: 'right', ontouchstart: () => 
        $TCB(confirm(`Are you sure you want to delete project ${res.ProjectName}`), () =>
          deleteProject(db, projectID))
      }},
      {div: {fontSize: '17px', color: '#ccc', text: 'Goal:', float: 'left'}},
      {br: {}}, {br: {}},
      {div: { text: res.ProjectGoal, class: 'ow', fontSize: '17px', width: '100%'}},
      {button: { text: 'Create Task', class: 'ow', fontSize: '17px', width: '100%', ontouchstart: () =>
        addTask(db, res._id, res.ProjectName, res.ProjectIcon)
      }}
    ]})
    listTasks($('project_page'), res._id, db)
  })

}

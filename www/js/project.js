const deleteProject = (db, projectID) => {
  const recTaskPop = (tasks, callbackFinished) => {
      if(tasks.length == 0) callbackFinished()
      else {
          const TaskID = tasks.pop()
          sqlQuery(db, SQLS.Tags, [TaskID], res =>
            deleteTask(db, TaskID, $indexList(res.rows.length)
            .map(i => res.rows.item(i).TagID), () =>
              recTaskPop(tasks, callbackFinished)))
      }
  }
  sqlQuery(db, SQLS.Tasks, [projectID], res => {
      const tasks = $indexList(res.rows.length).map(i => res.rows.item(i).TaskID)
      recTaskPop(tasks, () =>
          sqlQuery(db, SQLS.DeleteProjects, [projectID], () =>
            populateLeftMenu(db)))
  })
}

const createProject = (db) => {
  $('main').innerHTML = ''
  //form
  appendElement($('main'), 'div',  {class: 'form-style-7', child: {ul: {id: 'create_project_form'}}})
  appendElement($('create_project_form'), 'li', {children: [
    {label: {for: 'project_name', text: 'Project Name'}},
    {input: {type: 'text', name: 'project_name'}},
    {span: {text: 'Enter Project Name here'}}
  ]})
  appendElement($('create_project_form'), 'li', {children: [
    {label: {for: 'project_goal', text: 'Goal'}},
    {textarea: { name: 'project_goal', rows: 4, cols: 50, height: '120px'}},
    {span: {text: 'Say what the goal of the project is'}}
  ]})
        
  appendElement($('create_project_form'), 'li', {id: 'icons_slots', children: [
      {label: {for: 'project_icons', text: 'Logo / Icon'}},
      {div: {id: 'project_icons', overflowX: 'scroll', height: '20vh', width: '100%'}}
  ]})
        for(let i = 0; i < 12; i++)
              appendElement($('project_icons'), 'div', { 
                borderRadius: '30%', 
                margin: '4px', 
                border: i == 0 ? '2px solid red' : '',
                width: 'auto', 
                display: 'inline-block', 
                background: FRIENDLY_COLOURS[i], 
                color: blackOrWhite(FRIENDLY_COLOURS[i]),  
                ontouchstart: (e) => {
                  const listOfIcons = $('project_icons').children
                  for(let j = 0; j < listOfIcons.length; j++)
                      listOfIcons[j].style.border = ''
                  if(e.srcElement.hasAttribute('data-id'))
                      e.srcElement.parentElement.style.border = '2px solid red'              
                },
                child: {i: { class: 'material-icons', 'data-id': i, fontSize: '320%', cursor: 'pointer', text:  PROJECT_ICONS[i]}}
              })
  appendElement($('icons_slots'), 'span', {text: 'Select a project icon from above'})

  appendElement($('create_project_form'), 'li', {children: [
    {button: {
          class: 'glass',
          background: 'linear-gradient(#258,#aef)',
          text: 'Create Project',
          ontouchstart: (e) => {
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
            const projectIcon = selectedIcon
            if(projectName.trim() == '')
              lis[0].children[2].style.color = 'red'
            else if(projectGoal.trim() == '')
              lis[1].children[2].style.color = 'red'
            else
              sqlQuery(db, 'INSERT INTO ProjectsTable (ProjectName,  ProjectGoal, ProjectIcon, ProjectStartDate) VALUES(?, ?, ?, ?)',
                [projectName.trim(), projectGoal.trim(), projectIcon, new Date().getTime()], () => {
                  //TODO: go to project page
                  //$('create_projects').innerHTML = `<div class='ow' style='color:green;text-align:center;width:250px'>Created project:<br>  <i class='material-icons'>${PROJECT_ICONS[projectIcon]}</i> ${projectName.trim()}<br>with the goal to:<br>${projectGoal.trim()}</div>`
                  populateLeftMenu(app, PROJECT_ICONS, db)
              })
          }
        }}
  ]})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#258,#aef)', text: '?'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#700,#f00)', text: 'b'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#740,gold)', text: 'app'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#507,#eaf', text: 'icon'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#b40,orange)', text: 'button'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#073,#0fa)', text: 'go'})
      //       appendElement($('buttonsBox'), 'button', {class: 'glass', background: 'linear-gradient(#000,#888)', text: '∑'})

}

const loadProjectPage = (db, projectID) => {
  $('main').innerHTML = ''

  sqlQuery(db, SQLS.Projects, [projectID], res => {
    res = res.rows.item(0)
    const startDate = $DATE(res.ProjectStartDate)
    const endDate = res.ProjectEndDate ? $DATE(res.ProjectEndDate) : ''

    appendElement($('main'), 'div', {children: [
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
      {button: {
        class: 'ow',
        fontSize: '17px',
        width: '100%',
        text: 'Create Task',
        ontouchstart: () =>
          addTask(db, res._id, res.ProjectName, res.ProjectIcon)
      }}
    ]})
    listTask(res._id, db)
  })

}

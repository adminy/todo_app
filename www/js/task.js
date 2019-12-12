const deleteTask = (db, TaskID, tagIDs, finishedCallback) => {
  sqlQuery(db, 'DELETE FROM TasksTable WHERE _id=?', [TaskID], (_, __) =>
      sqlQuery(db, 'DELETE FROM ProjectsToTasksTable WHERE TaskID=?', [TaskID], (_, __) =>
          recQuery(db, 'DELETE FROM TasksToTagsTable WHERE TaskID=? AND TagID=?', [TaskID], tagIDs, finishedCallback)))
}

const onTaskAdd = (db, projectID) => {
  const taskName         = $TV('task_name')
  const taskDetails      = $TV('task_details')
  const newTaskSQL       = 'INSERT INTO TasksTable (TaskName, TaskGoal) VALUES(?, ?)'
  const linkTask2ProjSQL = 'INSERT INTO ProjectsToTasksTable (ProjectID, TaskID) VALUES(?, ?)'
  const linkTag2Task     = 'INSERT INTO TasksToTagsTable (TaskID, TagID) VALUES(?, ?)'

  if(!taskName)
    $('task_name_info').style.color = 'red'
  else if(!taskDetails)
    $('task_details_info').style.color = 'red'
  else
    db.transaction(tx =>
      mInsertQuery(tx, newTaskSQL, [taskName, taskDetails], TaskID => 
        mInsertQuery(tx, linkTask2ProjSQL, [projectID, TaskID], () =>
          mRecQuery(tx, linkTag2Task, [TaskID], getSelectValues($('task_tags')), () =>
            $('add_task_page').innerHTML = `<h3 style='color:green'>Task ${taskName} created!</font>`))))
}

const addTask = (app, PROJECT_ICONS, db, projectID, projectName, projectIcon)  => {
    appendElement(app, 'div', {
      id: 'add_task_page',
      background: '#fff',
      color: 'black', 
      flexGrow: 1,
      overflow: 'scroll',
      children: [
        {br:{}}, {br:{}},
        {div: { text: 'Create Task for project: ', fontSize: '19px' }},
        {div: { 
          background: FRIENDLY_COLOURS[projectIcon],
          borderRadius: '3%',
          color: blackOrWhite(FRIENDLY_COLOURS[projectIcon]),
          textAlign: 'center',
          text: projectName,
          fontSize: '19px'
         }},
        {div: {class: 'form-style-7',  child: {ul: {id: 'create_task_form', children: [
          {li: {children: [
            {label: {for: 'task_name', text: 'Task Name', placeholder: 'Task Name'}},
            {input: {type: 'text', id: 'task_name'}},
            {span: {text: 'Enter Task Name here', id: 'task_name_info'}}
          ]}},
          {li:{children: [
            {label: {for: 'task_details', text: 'Task Details'}},
            {textarea: { id: 'task_details', rows: 4, cols: 50, height: '120px', placeholder: 'Task Details ... MarkDown Format'}},
            {span: {text: 'List out task details in MD format', id: 'task_details_info'}}
          ]}},
          {li: {children: [
            {label: {for: 'tag_stuff', text: 'New Tag'}},
            {div: { display: 'flex', name: 'tag_stuff', children: [
                {input: {type: 'text',  placeholder: 'Joe, code, research, ...', flex: 1, id: 'tag_name'}},
                {button: {text: 'Add Tag', name: 'tag_name', ontouchstart: (e) => onAddTag(db)}},
            ]}},
            {span: {text: 'Enter Tag Name here, then hit return to Add Tag', id: 'tag_info'}}
          ]}},
          {li:{children: [
            {label: {for: 'task_tags', text: 'Tags'}},
            {select: {id: 'task_tags', multiple:'multiple', children: [{option: {text: 'none'}}]}},
            {span: {text: 'Select tags for this Task'}},
            {br:{}},
            {button: {class: 'glass', background: 'linear-gradient(#700,#f00)', text: 'Create Task', ontouchstart: (event) => onTaskAdd(db, projectID)}}
          ]}}
        ]}}}}
      ]
  })
  loadTags(db)
}

const listTask = (app, PROJECT_ICONS, projectPage, projectID, db) => {
  sqlQuery(db, 'SELECT * FROM TasksTable JOIN ProjectsToTasksTable ON TasksTable._id=ProjectsToTasksTable.TaskID WHERE ProjectsToTasksTable.ProjectID=?', [projectID], (res, tx) => {
      const tasks = $indexList(res.rows.length).map(i => res.rows.item(i))
      appendElement(projectPage, 'div', {
          fontSize: '24px',
          text: `Project Tasks: ${tasks.length}`
      })
      for(const task of tasks) {
          const taskElement = appendElement(projectPage, 'fieldset', {
              children: [
                  {legend: {text: task.TaskName}},
                  {div: {text: task.TaskGoal}}
              ]
          })
          mSqlQuery(tx, 'SELECT * FROM TagsTable JOIN TasksToTagsTable ON TagsTable._id=TasksToTagsTable.TagID WHERE TasksToTagsTable.TaskID=?', [task.TaskID], res => {
              const tags = $indexList(res.rows.length).map(i => res.rows.item(i))
              
              appendElement(taskElement, 'button', {text: 'x', color: 'red', float: 'right', ontouchstart: () => {
                  if (confirm(`Are you sure you want to delete Task:  ${task.TaskName}`))
                      deleteTask(db, task.TaskID, tags.map(tag => tag.TagID), () => {
                          cleanMainPage()
                          loadProjectPage(app, PROJECT_ICONS, db, projectID)
                      })
              }})

              for(const tag of tags)
                  appendElement(taskElement, 'div', {
                      border: '1px solid red',
                      padding: '3px',
                      borderRadius: '2%',
                      display: 'inline-block',
                      width: 'auto',
                      color: 'white',
                      background: 'black',
                      text: tag.TagName
                  })
          })
      }
  })
}

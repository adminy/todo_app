SYSTEM.DEF('task:delete', (TaskID, projectID) => {
  SYSTEM.CALL('db:query', SQLS.DeleteLinkTags2Task, [TaskID], () =>
    SYSTEM.CALL('db:query', SQLS.DeleteLinkTask2Proj, [TaskID], () =>
      SYSTEM.CALL('db:query', SQLS.DeleteTask, [TaskID], () =>
        SYSTEM.CALL('project:show', projectID))))
})

SYSTEM.DEF('task:add', projectID => {
  const taskName    = $TV('task_name')
  const taskDetails = $TV('task_details')
  const tags = getSelectValues($('task_tags'))

  if(!taskName)
    $('task_name_info').style.color = 'red'
  else if(!taskDetails)
    $('task_details_info').style.color = 'red'
  else
    SYSTEM.CALL('db:session', tx =>
      SYSTEM.CALL('db:insert:mini', tx, SQLS.InsertTask, [taskName, taskDetails], TaskID =>
        SYSTEM.CALL('db:insert:mini', tx, SQLS.LinkTask2Proj, [projectID, TaskID], () =>
          SYSTEM.CALL('db:insert:mini:rec', tx, SQLS.LinkTag2Task, [TaskID], tags, () =>
            SYSTEM.CALL('project:show', projectID)))))
})

SYSTEM.DEF('task:new', (projectID, projectName, projectIcon) => {
  SYSTEM.HTML('#main', html='')
  elementChildren($('main'), [
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
            {button: {text: 'Add Tag', name: 'tag_name', ontouchstart: () =>
              SYSTEM.CALL('tag:add')
            }},
        ]}},
        {span: {text: 'Enter Tag Name here, then hit return to Add Tag', id: 'tag_info'}}
      ]}},
      {li:{children: [
        {label: {for: 'task_tags', text: 'Tags'}},
        {select: {id: 'task_tags', multiple:'multiple', children: [{option: {text: 'none'}}]}},
        {span: {text: 'Select tags for this Task'}},
        {br:{}},
        {button: {class: 'glass', background: 'linear-gradient(#700,#f00)', text: 'Create Task', ontouchstart: () =>
          SYSTEM.CALL('task:add', projectID)
        }}
      ]}}
    ]}}}}
  ])
  SYSTEM.CALL('tags:list')
})

SYSTEM.DEF('task:points', (TaskID, addPoints) => {
  const pointSpan = $('task_points_' + TaskID)
  const points = parseInt(pointSpan.innerText) + (addPoints ? 1 : -1)
  SYSTEM.CALL('db:query', SQLS.UpdateTask, [points, TaskID], () => {
    pointSpan.innerText = points
    const newList = []
    for(const task of $('project_tasks_list').children)
      newList.push([task.children[2].children[1].innerText, task])

    SYSTEM.HTML('#project_tasks_list', html='')
    newList.sort((a, b) => b[0]-a[0] || a[1].children[0].innerText.localeCompare(b[1].children[0].innerText))
      .forEach(([points, element]) => $('project_tasks_list').appendChild(element))
  })
})

SYSTEM.DEF('tasks:list', (projectPage, projectID) => {
  SYSTEM.CALL('db:session', tx =>
    SYSTEM.CALL('db:query:mini', tx, SQLS.Tasks, [projectID], (tasks) => {
      appendElement(projectPage, 'div', {
          fontSize: '24px',
          text: `Project Tasks: ${tasks.length}`
      })
      appendElement(projectPage, 'div', {id: 'project_tasks_list'})
    
      for(const task of tasks) {
        const deleteMsg = `Are you sure you want to delete Task: ${task.TaskName}`
        const deleteCb = () => SYSTEM.CALL('task:delete', task.TaskID, projectID)
        const deleteTask = () => $TCB(confirm(deleteMsg), deleteCb)
        const taskElement = appendElement($('project_tasks_list'), 'fieldset', {
          children: [
            {legend: {text: task.TaskName, fontSize: '16px'}},
            {div: {text: task.TaskGoal, fontSize: '15px'}},
            {div: {children: [
              {button: {text: '-', fontSize: '16px', ontouchstart: () =>
                SYSTEM.CALL('task:points', task.TaskID, false)
              }},
              {span: {id: 'task_points_' + task.TaskID, text: task.TaskPoints, fontSize: '21px', color: 'red'}},
              {button: {text: '+', fontSize: '16px', ontouchstart: () =>
                SYSTEM.CALL('task:points', task.TaskID, true)  
              }},
              {button: {text: 'x', color: 'red', float: 'right', ontouchstart: deleteTask, fontSize: '17px'}}
            ]}},
          ]
        })
        SYSTEM.CALL('tags:list:forTask', tx, taskElement, task)
      }
  }))
})

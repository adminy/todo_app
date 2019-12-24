SYSTEM.DEF('tag:add', () => {
  const tagName = $TV('tag_name')
    if(tagName)
      SYSTEM.CALL('db:insert', SQLS.InsertTag, [tagName], () => {
        $('tag_name').value = ''
        $('tag_info').style.color = 'green'
        SYSTEM.CALL('tags:list')
      })
   else $('tag_info').style.color = 'red'
})

SYSTEM.DEF('tag:delete', (TaskID, TagID) => {
  SYSTEM.CALL('db:query', SQLS.DeleteLinkTag2Task, [TaskID, TagID], () => {
    $rm(`tag_${TaskID}_${TagID}`)
  })
})

SYSTEM.DEF('tags:list', () => {
  SYSTEM.HTML('#task_tags', html='')
  SYSTEM.CALL('db:query', SQLS.Tags, [], tags => 
    tags.forEach(tag => 
      appendElement($('task_tags'), 'option', {
        value: tag._id,
        text: tag.TagName
      })))
})

SYSTEM.DEF('tags:list:forTask', (tx, taskElement, task) => {
  SYSTEM.CALL('db:query:mini', tx, SQLS.TagsForTask, [task.TaskID], tags => {
    for(const tag of tags)
      appendElement(taskElement, 'div', { class: 'tag', id: `tag_${tag.TaskID}_${tag.TagID}`,
        children: [
          {span: { text: tag.TagName}},
          {button: { text: 'x', color: 'red', ontouchstart: () =>
            SYSTEM.CALL('tag:delete', tag.TaskID, tag.TagID)
          }},
        ]
      })
  })
})

SYSTEM.DEF('tags:edit', () => {
  SYSTEM.HTML('#main', html='')

  appendElement($('main'), 'table', {id: 'tagsList', textAlign: 'center', children: [
    {h1: {text: 'Tags List'}}
  ]})
  SYSTEM.CALL('db:query', SQLS.TagsInTasks, [], tags => {
    tags.forEach(tag =>
      appendElement($('tagsList'), 'tr', { children: [
        {td: { text: tag.TagName, fontSize: '18px', width: '60%'}},
        {td: { text: tag.total, fontSize: '18px', color: 'red', width: '10%'}},
        {td: {children: [
          {button: { display: tag.total ? 'none': 'inline-block', text: 'delete', border: '1px solid orange', background: 'black', color: 'white', fontSize: '18px', ontouchstart: () =>
            SYSTEM.CALL('db:query', SQLS.DeleteTag, [tag._id], () =>
              SYSTEM.CALL('tags:edit'))
          }}
        ]}}
      ]})
    )
  })
  elementChildren($('main'), [{br:{}}, {br:{}}, {br:{}}, {br:{}}, {br:{}}])
  appendElement($('main'), 'button', {text: 'Clean up Entire Database', fontSize: '19px', textAlign: 'center', border: '1px solid red', color: 'red', ontouchstart: () => {
    SYSTEM.CALL('db:batch', CLEAN_DB, () => {
      SYSTEM.HTML('#menuLeftScroll', html='')
      SYSTEM.HTML('#main', html='')
    })
  }})
})

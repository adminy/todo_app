const onAddTag = (db) => {
  const tagName = $TV('tag_name')
   if(tagName)
     sqlQuery(db, SQLS.InsertTag, [tagName], () => {
       $('tag_name').value = ''
       $('tag_info').style.color = 'green'
       loadTags(db)
     })
   else $('tag_info').style.color = 'red'
}

const loadTags = db => {
  $('task_tags').innerHTML = ''
  sqlQuery(db, SQLS.Tags, [], res => {
    for(let i = 0; i < res.rows.length; i++)
      appendElement($('task_tags'), 'option', {value: res.rows.item(i)._id, text: res.rows.item(i).TagName})
  })
}

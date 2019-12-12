const onAddTag = (db) => {
  const tagName = $('tag_name').value.trim()  
   if(tagName)
     sqlQuery(db, 'INSERT INTO TagsTable (TagName) VALUES(?)', [tagName], () => {
       $('tag_name').value = ''
       $('tag_info').style.color = 'green'
       loadTags(db)
     })
   else $('tag_info').style.color = 'red'
}

const loadTags = db => {
  $('task_tags').innerHTML = ''
  sqlQuery(db, 'SELECT * FROM TagsTable', [], res => {
      for(let i = 0; i < res.rows.length; i++)
        appendElement($('task_tags'), 'option', {value: res.rows.item(i)._id, text: res.rows.item(i).TagName})
  })
}

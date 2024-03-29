const PREPARE_DB = [
    //---------------------------------- essential tables
    'CREATE TABLE IF NOT EXISTS ProjectsTable (_id INTEGER PRIMARY KEY, ProjectName TEXT,  ProjectGoal, ProjectIcon INTEGER, ProjectStartDate TEXT, ProjectEndDate TEXT)',
    'CREATE TABLE IF NOT EXISTS TasksTable (_id INTEGER PRIMARY KEY, TaskName TEXT,  TaskGoal, TaskPoints INTEGER  DEFAULT 0)',
    'CREATE TABLE IF NOT EXISTS TagsTable (_id INTEGER PRIMARY KEY, TagName TEXT NOT NULL,  UNIQUE(TagName) ON CONFLICT IGNORE)', //,  TagDesc, TagIcon INTEGER
    //---------------------------------- connections
    'CREATE TABLE IF NOT EXISTS ProjectsToTasksTable (ProjectID INTEGER NOT NULL, TaskID INTEGER NOT NULL, PRIMARY KEY ( ProjectID, TaskID))',
    'CREATE TABLE IF NOT EXISTS TasksToTagsTable (TaskID INTEGER NOT NULL, TagID INTEGER NOT NULL, PRIMARY KEY ( TaskID, TagID))'
]

const CLEAN_DB = [
    //---------------------------------- clean up
    'DROP TABLE IF EXISTS ProjectsTable',
    'DROP TABLE IF EXISTS TasksTable',
    'DROP TABLE IF EXISTS TagsTable',
    'DROP TABLE IF EXISTS ProjectsToTasksTable',
    'DROP TABLE IF EXISTS TasksToTagsTable'
].concat(PREPARE_DB)


const SQLS = {
    Projects: 'SELECT * FROM ProjectsTable',
    Project: 'SELECT * FROM ProjectsTable WHERE _id=?',
    InsertProject: 'INSERT INTO ProjectsTable (ProjectName,  ProjectGoal, ProjectIcon, ProjectStartDate) VALUES(?, ?, ?, ?)',
    DeleteProject: 'DELETE FROM ProjectsTable WHERE _id=?',
    UpdateProject: 'UPDATE ProjectsTable SET ProjectName=?,  ProjectGoal=?, ProjectIcon=?, ProjectEndDate=? WHERE _id=?',

    TasksForProj: 'SELECT * FROM TasksTable JOIN ProjectsToTasksTable ON TasksTable._id=ProjectsToTasksTable.TaskID WHERE ProjectsToTasksTable.ProjectID=? ORDER BY TaskPoints DESC, TaskName ASC',
    InsertTask: 'INSERT INTO TasksTable (TaskName, TaskGoal) VALUES(?, ?)',
    DeleteTask: 'DELETE FROM TasksTable WHERE _id=?',
    UpdateTask: 'UPDATE TasksTable SET TaskPoints=? WHERE _id=?',

    LinkTask2Proj: 'INSERT INTO ProjectsToTasksTable (ProjectID, TaskID) VALUES(?, ?)',
    DeleteLinkTask2Proj: 'DELETE FROM ProjectsToTasksTable WHERE TaskID=?',

    Tags: 'SELECT * FROM TagsTable',
    TagsForTask: 'SELECT * FROM TagsTable JOIN TasksToTagsTable ON TagsTable._id=TasksToTagsTable.TagID WHERE TasksToTagsTable.TaskID=?',
    InsertTag: 'INSERT INTO TagsTable (TagName) VALUES(?)',
    TagsInTasks: 'SELECT *, (SELECT COUNT(*) FROM TasksToTagsTable WHERE TasksToTagsTable.TagID=TagsTable._id) as total FROM TagsTable',
    DeleteTag: 'DELETE FROM TagsTable WHERE _id=?',

    LinkTag2Task: 'INSERT INTO TasksToTagsTable (TaskID, TagID) VALUES(?, ?)',
    DeleteLinkTags2Task: 'DELETE FROM TasksToTagsTable WHERE TaskID=?',
    DeleteLinkTag2Task: 'DELETE FROM TasksToTagsTable WHERE TaskID=? AND TagID=?'
}
//https://material.io/resources/icons/?icon=rowing&style=baseline
const PROJECT_ICONS = ['adb', 'home_work', 'work', 'verified_user', 'power_settings_new', 'perm_media', 'pets', 'rowing', 'shopping_basket', 'flight', 'near_me', 'restaurant', 'straighten', 'color_lens', 'desktop_mac', 'monetization_on', 'attach_money', 'sort', 'business', 'subscriptions', 'subtitles', 'group_work', 'explore', 'delete', 'bug_report', 'build', 'gif']

const INITIAL_SQL = [
    //---------------------------------- clean up
    // 'DROP TABLE IF EXISTS ProjectsTable',
    // 'DROP TABLE IF EXISTS TasksTable',
    // 'DROP TABLE IF EXISTS TagsTable',
    // 'DROP TABLE IF EXISTS ProjectsToTasksTable',
    // 'DROP TABLE IF EXISTS TasksToTagsTable',
    //---------------------------------- essential tables
    'CREATE TABLE IF NOT EXISTS ProjectsTable (_id INTEGER PRIMARY KEY, ProjectName TEXT,  ProjectGoal, ProjectIcon INTEGER, ProjectStartDate TEXT, ProjectEndDate TEXT)',
    'CREATE TABLE IF NOT EXISTS TasksTable (_id INTEGER PRIMARY KEY, TaskName TEXT,  TaskGoal)',
    'CREATE TABLE IF NOT EXISTS TagsTable (_id INTEGER PRIMARY KEY, TagName TEXT NOT NULL,  UNIQUE(TagName) ON CONFLICT IGNORE)', //,  TagDesc, TagIcon INTEGER
    //---------------------------------- connections
    'CREATE TABLE IF NOT EXISTS ProjectsToTasksTable (ProjectID INTEGER NOT NULL, TaskID INTEGER NOT NULL, PRIMARY KEY ( ProjectID, TaskID))',
    'CREATE TABLE IF NOT EXISTS TasksToTagsTable (TaskID INTEGER NOT NULL, TagID INTEGER NOT NULL, PRIMARY KEY ( TaskID, TagID))'
]
const SQLS = {
    Projects: 'SELECT * FROM ProjectsTable',
    Project: 'SELECT * FROM ProjectsTable WHERE _id=?',
    InsertProject: 'INSERT INTO ProjectsTable (ProjectName,  ProjectGoal, ProjectIcon, ProjectStartDate) VALUES(?, ?, ?, ?)',
    DeleteProject: 'DELETE FROM ProjectsTable WHERE _id=?',

    Tasks: 'SELECT * FROM TasksTable JOIN ProjectsToTasksTable ON TasksTable._id=ProjectsToTasksTable.TaskID WHERE ProjectsToTasksTable.ProjectID=?',
    InsertTask: 'INSERT INTO TasksTable (TaskName, TaskGoal) VALUES(?, ?)',
    DeleteTask: 'DELETE FROM TasksTable WHERE _id=?',

    LinkTask2Proj: 'INSERT INTO ProjectsToTasksTable (ProjectID, TaskID) VALUES(?, ?)',
    DeleteLinkTask2Proj: 'DELETE FROM ProjectsToTasksTable WHERE TaskID=?',

    Tags: 'SELECT * FROM TagsTable',
    TagsForTask: 'SELECT * FROM TagsTable JOIN TasksToTagsTable ON TagsTable._id=TasksToTagsTable.TagID WHERE TasksToTagsTable.TaskID=?',
    InsertTag: 'INSERT INTO TagsTable (TagName) VALUES(?)',

    LinkTag2Task: 'INSERT INTO TasksToTagsTable (TaskID, TagID) VALUES(?, ?)',
    DeleteLinkTag2Task: 'DELETE FROM TasksToTagsTable WHERE TaskID=? AND TagID=?',

}
const PROJECT_ICONS = ['adb', 'home_work', 'work', 'verified_user', 'power_settings_new', 'perm_media', 'pets', 'rowing', 'shopping_basket', 'adb', 'home_work', 'work']
const PAGES = {

}
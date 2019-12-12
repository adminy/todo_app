const openDB = (openedCallback) =>
    window.sqlitePlugin.openDatabase({ name: 'database.db', location: 'default' }, openedCallback, error => console.log('Open database ERROR: ' + JSON.stringify(error)))
    
const sqlSession = (db, transactionCallback, readyCallback) =>
    db.transaction(transactionCallback, error => console.log('transaction error: ' + JSON.stringify(error)), readyCallback)


const mSqlQuery = (tx, sqlStatement, params, finishedCallback) => {
    tx.executeSql(sqlStatement, params,
        (_, res) => finishedCallback(res, tx),
         error => console.log(JSON.stringify(error))
    )
}

const sqlQuery = (db, sqlStatement, params, finishedCallback) =>
    db.transaction(tx => mSqlQuery(tx, sqlStatement, params, finishedCallback))

const mRecQuery = (tx, sqlStatement, params, list, finishedCallback) => {
    const recItem = (list) => {
        if(list.length == 0) finishedCallback()
        else
            mSqlQuery(tx, sqlStatement, params.concat([list.pop()]), () =>
                recItem(list))
                        
    }
    recItem(list)
}
    

const recQuery = (db, sqlStatement, params, list, finishedCallback) =>
    db.transaction(tx => mRecQuery(tx, sqlStatement, params, list, finishedCallback))    

const mInsertQuery = (tx, sqlStatement, params, finishedCallback) =>
  mSqlQuery(tx, sqlStatement, params, res => {
    if(res.rowsAffected == 1)
        finishedCallback(res.insertId)
    else
        console.log('>>> task is not unique / already exists')
  })
SYSTEM.DEF('db:open', whenReady => {
    const dbInfo = {name: 'database.db', location: 'default' }
    const dbSuccess = db => {
        SYSTEM.DEF('db:query:mini', (tx, sqlStatement, params, whenQueryMade) => {
            const querySuccess = (_, res) => whenQueryMade($indexList(res.rows.length).map(i => res.rows.item(i)))
            const queryFailure = error => console.log(JSON.stringify(error))
            tx.executeSql(sqlStatement, params, querySuccess, queryFailure)
        })
        SYSTEM.DEF('db:query', (sqlStatement, params, whenQueryMade) => db.transaction(tx => SYSTEM.CALL('db:query:mini', tx, sqlStatement, params, whenQueryMade)))
        SYSTEM.DEF('db:query:rec', (sqlStatement, params, list, whenQueriesMade) => {
            const resList = []
            const recQuery = () => {
                if(list.length == 0) whenQueriesMade(resList)
                else SYSTEM.CALL('db:query', sqlStatement, params.concat([list.pop()]), (res) => {
                    resList.push(res)
                    recQuery()
                })
            }
            recQuery()
        })
        SYSTEM.DEF('db:session', (transaction, whenTransactionSuccess) => {
            whenTransactionSuccess = whenTransactionSuccess || (() => {})
            const whenFails = error => console.log('transaction error: ' + JSON.stringify(error))
            db.transaction(transaction, whenFails, whenTransactionSuccess)
        })
        SYSTEM.DEF('db:batch', (SQLS, whenBatchExecuted) => {
            const batchCMD = tx => SQLS.forEach(SQL => tx.executeSql(SQL))
            SYSTEM.CALL('db:session', batchCMD, whenBatchExecuted)
        })
        SYSTEM.DEF('db:insert:mini', (tx, sqlStatement, params, whenInserted) => {
            const querySuccess = (_, res) => {
                if(res.rowsAffected == 1) whenInserted(res.insertId)
                else console.log('>>> task is not unique / already exists')
            }
            const queryFailure = (error, actualError) => console.log(sqlStatement, params, JSON.stringify(error), actualError)
            tx.executeSql(sqlStatement, params, querySuccess, queryFailure)
        })
        SYSTEM.DEF('db:insert:mini:rec', (tx, sqlStatement, params, list, whenInsertedAllQueries) => {
            const recItem = () => {
                if(list.length == 0) whenInsertedAllQueries()
                else SYSTEM.CALL('db:insert:mini', tx, sqlStatement, params.concat([list.pop()]), () => recItem())
            }
            recItem()
        })
        SYSTEM.DEF('db:insert', (sqlStatement, params, whenInserted) => db.transaction(tx => SYSTEM.CALL('db:insert:mini', tx, sqlStatement, params, whenInserted)))
        whenReady()
    }
    const dbFailure = error => console.log('Open database ERROR: ' + JSON.stringify(error))
    window.sqlitePlugin.openDatabase(dbInfo, dbSuccess, dbFailure)
})

# Class: DBPoolConnection
Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`


## Constructor: DBPoolConnection(poolIndex , config)
**Parameters**

**poolIndex**: `number`, An identifier for debug purposes

**config**: `object`, Object includes `database`


### DBPoolConnection.newConnection()

Instantiates a new Connection instance


### DBPoolConnection.newStatement()

Instantiates a new Statement instance for the Connection if one is not set and returns it.
Otherwise will close the previous Statement and return a new Statement.

**Returns**: `Statement`, new statement from the connection

### DBPoolConnection.getStatement()

Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`

**Returns**: `Statement`, returns the handle to the Statement.

### DBPoolConnection.close()

Closes the connection


### DBPoolConnection.detach(retire)

Creates a new statement

**Parameters**

**retire**: `boolean`, If true, retires the connection so it can be removed from the pool

**Returns**: `boolean | object`, True if retiring, or the detached connection

### DBPoolConnection.isAvailable()

Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`

**Returns**: `boolean`, true if the connection is available , false if the connection is unavailable.

### DBPoolConnection.setAvailable(availability)

Constructor to instantiate a new instance of a DBPoolConnection class given the `poolIndex` and `config`

**Parameters**

**availability**: `boolean`, true or false to set the availability flag of the connection.

- - -

# Class: DBPool
Manages a list of DBPoolConnection instances.
Constructor to instantiate a new instance of a DBPool class given the `database` and `config`


## Constructor: DBPool(database , config)

**Parameters**

**database**: `object`, Object includes the `url`(database name) defaults to *LOCAL, `username`, and `password`. `username` and `password` assumed blank if not specified with non-local URL.

**config**: `object` , Object includes the `incrementSize` and `debug`. IncrementSize sets the desired size of the DBPool. If none specified, defaults to 8 connections. Setting debug = true will display message logs.


### DBPool.createConnection(index)

Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
Assumes the database of the pool when establishing the connection.

**Parameters**

**index**: `number`, An identifier to id the connection for debug purposes.


### DBPool.detachAll()

Frees all connections in the pool (Sets "Available" back to true for all)
closes any statements and gets a new statement.

**Returns**: `boolean`, - true if all were detached successfully

### DBPool.retireAll()

Retires (Removes) all connections from being used again

**Returns**: `boolean`, - true if all were retired successfully

### DBPool.detach(connection)

Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.

**Parameters**

**connection**: `DBPoolConnection`, Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.


### DBPool.retire(connection)

Retires a connection from being used and removes it from the pool

**Parameters**

**connection**: `DBPoolConnection`, Retires a connection from being used and removes it from the pool


### DBPool.attach()

Finds and returns the first available Connection.

**Returns**: `DBPoolConnection`, - one connection from the DBPool.

### DBPool.log(message)

Internal function used to log debug information.

**Parameters**

**message**: `string`, the message to log.


### DBPool.runSql(sql)

Shorthand to exec a statement , just provide the sql to run.

**Parameters**

**sql**: `string`, the sql statement to execute.

**Returns**: `array`, - if the SQL returns a result set it is returned as an array of objects.
else if no result set is available null is returned. caller should check if null is returned.

### DBPool.prepareExecute(sql, params)

Shortcut to prepare ,bind, and execute. Just provide the sql and the params as an array.

**Parameters**

**sql**: `string`, the sql to prepare , include parameter markers (?, ?, ...)

**params**: `array`, an optional array of values to bind. order of the values in the array must match the
order of the desired parameter marker in the sql string.

**Returns**: `array`, - if the Prepared SQL returns result set it is returned as an array of objects.
else null will be returned indicating that there is no result set.

### DBPool.formatParams(params)

Internal helper function to format params and set Param Indicator & Bind Type

**Parameters**

**params**: `array`, an array of values to bind. type of values should be (string , number , or null)

**Returns**: `array`, - an array of bounded params properly formatted to use.



* * *











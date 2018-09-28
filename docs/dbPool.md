# Class: DBPool

Manages a list of DBPoolConnection instances.
Constructor to instantiate a new instance of a DBPool class given the `database` and `config`.


## Constructor: DBPool(database , config)

**Parameters**:

- **database**: `object` includes the `url` defaults to "*LOCAL", `username`, and `password`. Username & password is optional when connecting to "*LOCAL".

- **config**: `object` with the properties: `incrementSize` and `debug`. IncrementSize is a integer `Number` that sets the desired size of the DBPool defaults to 8 connections. Debug is a `boolean` setting it to true will display verbose output to the console, defaults to false.

**Example**: [Here](#markdown-header-dbpool)


## DBPool.createConnection(index)

Instantiates a new instance of DBPoolConnection with an `index` and appends it to the pool.
Assumes the database of the pool when establishing the connection.

**Parameters**:

**index**: `Number` an optional identifier to id the connection for debug purposes.


## DBPool.detachAll()

Frees all connections in the pool (Sets "Available" back to true for all)
closes any statements and gets a new statement.

**Returns**: `true` if all were detached successfully or will return `String` error message if an error occurred.

## DBPool.retireAll()

Retires (Removes) all connections from being used again

**Returns**: `true` if all were retired successfully, or will return `String` error message if an error occurred.

## DBPool.detach(connection)

Frees a connection (Returns the connection "Available" back to true) closes any statements and gets a new statement.

**Parameters**:

- **connection**: `DBPoolConnection`, Frees a connection (Returns the connection "Available" back to true)
closes any statements and gets a new statement.


**Returns**: `String` error message if an error occurred.

## DBPool.retire(connection)

Retires a connection from being used and removes it from the pool.

**Parameters**:

- **connection**: `DBPoolConnection`, Retires a connection from being used and removes it from the pool

**Returns**: `String` error message if an error occurred.

## DBPool.attach()

Finds and returns the first available Connection.

**Returns**: `DBPoolConnection` connection from the `DBPool`.



## DBPool.runSql(sql)

An aggregate to run an sql statement, just provide the sql to run. Note that Stored Procedures should use the prepareExecute() aggregate instead.

**Parameters**:

- **sql**: `String`, the sql statement to execute.

**Returns**: 
- `Array` if the sql returns a result set it is returned as an `Array` of `Objects`.

- If no result set is available `null` is returned. Caller should check if `null` is returned.

**Example**: [Here](#markdown-header-runsql)


## DBPool.prepareExecute(sql, params, options)

Aggregate to prepare, bind, and execute. Just provide the sql and the optional params as an array.

An `options` object can now be used for global configuration. This is used to set options on all the parameters within the `params` Array. Currently, the input output indicator `io` is the only available option to set. This will override the default which is `'both'`.

**Example**: `prepareExecute(sql, parrams, {io: 'in'})`

Also parameters can be customized at an individual level by passing an object within the parameter list.

The object format: `{value: "string | Number | boolean | null" , io: "in | out | both" , asClob: "true | false"}`

`value` is the only required property others will fallback to defaults.

If you want to bind a string as a clob you can add `asClob: true` property to the object.

**Example**: `{value: 'your string', asClob: true, io: 'in'}`

**Parameters**::

- **sql**: `string`, the sql to prepare , include parameter markers (?, ?, ...)

- **params**: `array`, an optional array of values to bind. order of the values in the array must match the order of the desired parameter marker in the sql string.
- **options**: `Object` with config options to set for all parameters. The format can be: `{io: 'in' | 'out' | 'both'}` where `io` can be set to either the `String` `'in'`, `'out'`, or `'both'`. Indicating that the parameter is an input, output, or inout parameter.

**Returns**: `Object` in the format: `{resultSet: [], outputParams: []}` if the Prepared SQL returns result set it is returned as an array of objects or if the Prepared SQL returns output parameters it is returned as an array of objects. 

- If neither were available `null` will be returned indicating that there is no result set or output parameters. Caller should check if `null` is returned.

**Example**: [Here](#markdown-header-prepareexecute)

## DBPool.setConnectionAttribute(attribute)

Sets the connection attribute for each a Connection in the pool.

**Parameters**:

- **attribute**: `Object` in the format {attribute: Number (integer), value: Number (integer) | String}
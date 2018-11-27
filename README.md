Fish Query
=========

Super simple query string builder. Currently only supports SELECT and cater to PostgreSQL query format.  
Built using ES6 Class.

## Installation
NPM:  
`npm install fish-query`

Yarn:  
`yarn add fish-query`

## Usage

    const QueryBuilder = require('fish-query');

    const queryClass = new QueryBuilder();

    let queryString = queryClass
                        .addSelect('firstName')
                        .setFirstTable('user')
                        .generateQuery();
    console.log(queryString);
Output should be `SELECT firstName from user;`

## Method

### > **addSelect**
Add the select column on query  
Parameter:
1. String. e.g. : user
2. Object with property: tableName, columnName (will be formatted to PostgreSQL accepted format)

### > **addMultipleSelect**
Add multiple select column on query  
Parameter: Array of Parameters on addSelect

### > **removeSelect**
Remove select column on query
Parameter:
1. String. e.g. : firstName
2. Object with property: tableName, columnName (will be formatted to PostgreSQL accepted format)

### > **setFirstTable**
Table name specified on FROM  
Parameter:
1. String. e.g. : user
2. Object with property: tableName, alias (will be formatted to PostgreSQL accepted format)

### > **joinTable**
Table name specified on FROM  
Parameter Object:
1. joinType: 'FULL JOIN', 'INNER JOIN', etc
2. firstTable: new table that wants to be joined
3. firstKey: the key that wants to be connected to second table
4. secondTable: other table that wants to be compared with first table
5. secondKey: the key that wants to be connected to first table

### > **addWhere**
Add where condition
Parameter Object:
1. column: String or Object. If Object the properties are : tableName, columnName
2. operator: '=', etc
3. value: value to be compared

### > **addOrder**
Add Order By
Parameter:
1. String, e.g. : 'firstName DESC'
2. Object with property:  
orderBy: Object with property: tableName, columnName  
orderType: 'ASC', 'DESC'

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.  
As this is a very initial phase, any contribution would be welcomed to support other query formats, or to have UPDATE, INSERT, DELETE, etc.

## Future Plan  
Add UPDATE, INSERT, DELETE

## Author Note   
'Ah, I want to eat fish query'

## License
MIT License
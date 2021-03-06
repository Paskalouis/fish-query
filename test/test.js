'use strict';

const expect = require('chai').expect;
const QueryBuilder = require('../index');

describe('Query String Builder', function () {
    it('Test 0. Select ALL', function() {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
                            .setFirstTable('user')
                            .generateQuery();
        expect(queryString).to.equal(`SELECT * FROM user;`);
    });

    it('Test 1. Simple Select', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
                            .addSelect('firstName')
                            .setFirstTable('user')
                            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName FROM user;`);
    });

    it('Test 2. Simple Select with Multiple column', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
            .addMultipleSelect([
                'firstName',
                'lastName',
                'age'
            ])
            .setFirstTable('user')
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName, lastName, age FROM user;`);
    });

    it('Test 3. Join with Where and Order By', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
                            .addSelect({
                                tableName: 'user',
                                columnName: 'firstName'
                            })
                            .setFirstTable({
                                tableName: 'user'
                            })
                            .joinTable({
                                joinType: 'FULL JOIN',
                                firstTable: 'country',
                                secondTable: 'user',
                                firstKey: 'country',
                                secondKey: 'id'
                            })
                            .addWhere({
                                column: {
                                    tableName: 'user',
                                    columnName: 'firstName'
                                },
                                operator: '=',
                                value: 'Agung'
                            })
                            .addOrder({
                                orderBy: {
                                    tableName: 'user',
                                    columnName: 'firstName'
                                },
                                orderType: 'ASC'
                            })
                            .generateQuery();
        expect(queryString).to.equal(`SELECT user."firstName" FROM user FULL JOIN country ON country."country" = user."id" WHERE user."firstName" = 'Agung' ORDER BY user."firstName" ASC;`);
    });

    it('Test 4. with table alias', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
                            .addSelect({
                                tableName: 'a',
                                columnName: 'firstName'
                            })
                            .setFirstTable({
                                tableName: 'user',
                                tableAlias: 'a'
                            })
                            .joinTable({
                                joinType: 'FULL JOIN',
                                firstTable: 'country',
                                firstTableAlias: 'b',
                                secondTable: 'user',
                                secondTableAlias: 'a',
                                firstKey: 'id',
                                secondKey: 'country'
                            })
                            .generateQuery();
        expect(queryString).to.equal(`SELECT a."firstName" FROM user a FULL JOIN country b ON b."id" = a."country";`);
    });

    it('Test 5. Double join', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
                            .addSelect({
                                tableName: 'a',
                                columnName: 'firstName'
                            })
                            .addSelect({
                                tableName: 'b',
                                columnName: 'countryName'
                            })
                            .addSelect({
                                tableName: 'c',
                                columnName: 'continentName'
                            })
                            .setFirstTable({
                                tableName: 'user',
                                tableAlias: 'a'
                            })
                            .joinTable({
                                joinType: 'FULL JOIN',
                                firstTable: 'country',
                                firstTableAlias: 'b',
                                secondTable: 'user',
                                secondTableAlias: 'a',
                                firstKey: 'id',
                                secondKey: 'country'
                            })
                            .joinTable({
                                joinType: 'FULL JOIN',
                                firstTable: 'continent',
                                firstTableAlias: 'c',
                                secondTable: 'country',
                                secondTableAlias: 'b',
                                firstKey: 'id',
                                secondKey: 'continent'
                            })
                            .generateQuery();
        expect(queryString).to.equal(`SELECT a."firstName", b."countryName", c."continentName" FROM user a FULL JOIN country b ON b."id" = a."country" FULL JOIN continent c ON c."id" = b."continent";`);
    });

    it('Test 6a. [PostgreSQL] Simple Select with limit and offset', function () {
        let queryClass = new QueryBuilder({ datastore: 'postgresql'});
        let queryString = queryClass
            .addSelect('firstName')
            .addSelect('lastName')
            .addSelect('age')
            .setFirstTable('user')
            .addLimit(10)
            .addOffset(20)
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName, lastName, age FROM user LIMIT 10 OFFSET 20;`);
    });

    it('Test 6b. [SQL Server] Simple Select with limit and offset', function () {
        let queryClass = new QueryBuilder({ datastore: 'sqlserver'});
        let queryString = queryClass
            .addSelect('firstName')
            .addSelect('lastName')
            .addSelect('age')
            .setFirstTable('user')
            .addLimit(10)
            .addOffset(20)
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName, lastName, age FROM user FETCH NEXT 10 ROWS ONLY OFFSET 20 ROWS;`);
    });

    it('Test 7. Simple Select with column alias', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
            .addSelect({
                tableName: 'user',
                columnName: 'firstName',
                columnAlias: 'user_first_name'
            })
            .addSelect('lastName')
            .addSelect('age')
            .setFirstTable('user')
            .generateQuery();
        expect(queryString).to.equal(`SELECT user."firstName" AS "user_first_name", lastName, age FROM user;`);
    });

    it('Test 8. Select with Multiple where', function () {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
            .addSelect('firstName')
            .setFirstTable('user')
            .addWhere({
                column: 'firstName',
                operator: '=',
                value: 'Agung'
            })
            .addWhere({
                column: 'lastName',
                operator: '=',
                value: 'Hercules'
            })
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName FROM user WHERE firstName = 'Agung' AND lastName = 'Hercules';`);
    });

    it(`Test 9. Select with Multiple where (2), operator is 'greater than' and value is an 'integer'`, function() {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
            .addSelect('firstName')
            .setFirstTable('user')
            .addWhere({
                column: 'age',
                operator: '>',
                value: 25
            })
            .addWhere({
                column: 'status',
                operator: '=',
                value: 'Single'
            })
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName FROM user WHERE age > 25 AND status = 'Single';`);
    })

    it(`Test 9. Select with Multiple where (3), caseSensitive = false, lastName contains 'brown' `, function() {
        let queryClass = new QueryBuilder;
        let queryString = queryClass
            .addSelect('firstName')
            .setFirstTable('user')
            .addWhere({
                column: 'age',
                operator: '>',
                value: 25
            })
            .addWhere({
                column: {
                    tableName: 'user',
                    columnName: 'lastName',
                    columnType: 'string'
                },
                operator: 'LIKE',
                value: '%brown%'
            })
            .generateQuery();
        expect(queryString).to.equal(`SELECT firstName FROM user WHERE age > 25 AND LOWER (user."lastName") LIKE LOWER ('%brown%');`);
    })
});
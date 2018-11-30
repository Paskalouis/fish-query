'use strict';

const expect = require('chai').expect;
const QueryBuilder = require('../index');

describe('Query String Builder', function () {
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
            .addSelect('firstName')
            .addSelect('lastName')
            .addSelect('age')
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

    it('Test 6. Simple Select with limit and offset', function () {
        let queryClass = new QueryBuilder;
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
        expect(queryString).to.equal(`SELECT user."firstName" AS user_first_name, lastName, age FROM user;`);
    });
});
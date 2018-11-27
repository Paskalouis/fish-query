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

    it('Test 2. Join with Where and Order By', function () {
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
});
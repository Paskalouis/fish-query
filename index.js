class QueryBuilder {
    constructor() {
        this.selectField = [];
        this.fromField = [];
        this.whereField = [];
        this.orderField = [];
        this.firstTable = '';
        this.limit = null;
        this.offset = null;
    }

    addSelect(value) {
        this.selectField.push(value);
        return this;
    }

    addMultipleSelect(values) {
        values.forEach(value => {
            this.selectField.push(value);
        });
        return this;
    }

    removeSelect(value) {
        this.selectField = _.remove(this.selectField, () => value);
        return this;
    }

    addWhere(value) {
        this.whereField.push(value);
        return this;
    }

    addOrder(value) {
        this.orderField.push(value);
        return this;
    }

    addLimit(value) {
        this.limit = value;
        return this;
    }

    addOffset(value) {
        this.offset = value;
        return this;
    }

    setFirstTable(value) {
        this.firstTable = value;
        return this;
    }

    joinTable(value) {
        this.fromField.push(value);
        return this;
    }

    generateQuery() {
        let queryString = `SELECT `;

        if (this.selectField.length > 0) {
            this.selectField.forEach((select, index) => {
                let selectString = '';

                if (typeof select === 'string') {
                    selectString = select;
                }
                else if (typeof select === 'object') {
                    selectString = `${select.tableName}."${select.columnName}"`
                }

                if (index === this.selectField.length - 1) {
                    queryString += `${selectString} `;
                }
                else {
                    queryString += `${selectString}, `;
                }
            });
        }
        else {
            queryString += `* `;
        }

        let tableString = '';

        if (typeof this.firstTable === 'string') {
            tableString = this.firstTable;
        }
        else if (typeof this.firstTable === 'object') {
            tableString = `${this.firstTable.tableName} ${this.firstTable.tableAlias ? this.firstTable.tableAlias : ''}`;
        }

        queryString += `FROM ${tableString} `;
        this.fromField.forEach(table => {
            queryString += `${table.joinType} ${table.firstTable} ${table.firstTableAlias ? table.firstTableAlias : ''} ON ${table.firstTableAlias ? table.firstTableAlias : table.firstTable}."${table.firstKey}" = ${table.secondTableAlias ? table.secondTableAlias : table.secondTable}."${table.secondKey}" `;
        });

        if (this.whereField.length) {
            queryString += `WHERE `;
            this.whereField.forEach((where, index) => {
                let whereString = '';

                if (typeof where.column === 'string') {
                    whereString = where.column;
                }
                else if (typeof where.column === 'object') {
                    whereString = `${where.column.tableName}."${where.column.columnName}"`
                }

                if (index === this.whereField.length - 1) {
                    queryString += `${whereString} ${where.operator} '${where.value}' `;
                }
                else {
                    queryString += `${whereString} ${where.operator} '${where.value}', `;
                }
            });
        }

        if (this.orderField.length) {
            queryString += `ORDER BY `;
            this.orderField.forEach((order, index) => {
                let orderString = '';

                if (typeof order === 'string') {
                    orderString = order;
                }
                else if (typeof order === 'object') {
                    orderString = `${order.orderBy.tableName}."${order.orderBy.columnName}" ${order.orderType}`
                }

                if (index === this.orderField.length - 1) {
                    queryString += `${orderString} `;
                }
                else {
                    queryString += `${orderString}, `;
                }
            });
        }

        if (this.limit && this.offset) {
            queryString += `LIMIT ${this.limit} `;
            if (this.offset) queryString += `OFFSET ${this.offset} `;
        }

        queryString = queryString.trim();

        queryString += `;`;

        queryString = queryString.replace(/\s\s+/g, ' ');

        return queryString;
    }
}

module.exports = QueryBuilder;
class HelperSql {

    SqlQueryWidthBrands (params, priceTo, priceFrom, offset, count, sort, toSort) {
        let sql = "SELECT products.* FROM products";
        sql += " WHERE products.brand_id IN (SELECT brands.id FROM brands WHERE brands.title IN (" + `${params}` + "))";
        sql +=  " AND products.price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        sql += " ORDER BY" + ` ${sort}  ${toSort}` + ' LIMIT ' + (--offset * count) + ',' + count;
        return sql;
    }
    countWidthBrand(params, priceTo, priceFrom) {
        let sql = "SELECT COUNT(*) as count FROM products";
        sql += " WHERE products.brand_id IN (SELECT brands.id FROM brands WHERE brands.title IN (" + `${params}` + "))";
        sql += " AND products.price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        return sql;
    }
    SqlQueryWidthOutBrands(priceTo, priceFrom, offset, count, sort, toSort) {
        let sql = "SELECT * FROM products WHERE price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        sql += " ORDER BY" + ` ${sort}  ${toSort}` + ' LIMIT ' + (--offset * count) + ',' + count;
        return sql;
    }
    countWidthOutBrand(priceTo, priceFrom) {
        let sql = "SELECT COUNT(*) as count FROM products";
        sql += " WHERE price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        return sql;
    }
    
}

module.exports.Hsql = new HelperSql();
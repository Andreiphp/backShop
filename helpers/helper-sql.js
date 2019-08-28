class HelperSql {

    SqlQueryWidthBrands (params, priceTo, priceFrom, offset, count, sort, toSort) {
        let sql = "SELECT products.* FROM products";
        let flag = toSort === 'true' ? 'asc' : 'desc';
        console.log(flag);
        
        sql += " WHERE products.brand_id IN (SELECT brands.id FROM brands WHERE brands.title IN (" + `${params}` + "))";
        sql +=  " AND products.price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        sql += " ORDER BY" + ` ${sort}  ${flag}` + ' LIMIT ' + (--offset * count) + ',' + count;
        console.log(sql);
        
        return sql;
    }
    countWidthBrand(params, priceTo, priceFrom) {
        let sql = "SELECT COUNT(*) as count FROM products";
        sql += " WHERE products.brand_id IN (SELECT brands.id FROM brands WHERE brands.title IN (" + `${params}` + "))";
        sql += " AND products.price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        return sql;
    }
    SqlQueryWidthOutBrands(priceTo, priceFrom, offset, count, sort, toSort) {
        let flag = toSort === 'true' ? 'asc' : 'desc';
        let sql = "SELECT * FROM products WHERE price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        sql += " ORDER BY" + ` ${sort}  ${flag}` + ' LIMIT ' + (--offset * count) + ',' + count;
        return sql;
    }
    countWidthOutBrand(priceTo, priceFrom) {
        let sql = "SELECT COUNT(*) as count FROM products";
        sql += " WHERE price BETWEEN " + `${priceFrom}` + " AND " + `${priceTo}`;
        return sql;
    }
    
}

module.exports.Hsql = new HelperSql();
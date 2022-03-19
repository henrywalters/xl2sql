import FileInput from './fileInput';
import SqlBuilder from './sqlBuilder';
import TableParser from './tableParser';
import SqlUtils from './sqlUtils';
import JSONParser from './parsers/jsonParser';

const xl2sql = {
    FileInput,
    TableParser,
    SqlBuilder,
    SqlUtils,
}

let content = '[{"x": 12, "y": 13, "z": 15},{ "x": 0, "y": 13, "z": 21}]';
let builder = new SqlBuilder();
(new JSONParser()).parse(content).then((datatable) => {
    console.log(datatable);
    console.log(builder.createTable("positions", datatable.header.map(col => datatable.getColumnInfo(col)), "testing"));
    console.log(builder.createInserts("positions", datatable, "testing"));
})

export default xl2sql;
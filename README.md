# xl2sql
xl2sql is a TypeScript library and CLI tool for parsing csv and excel files and generating SQL queries to generate tables and insert data. This stems from the common problem I have encountered of importing data from a CSV file into a database.

A key feature of this library is type parsing. From a raw file, types are deduced as best as possible through a series of strong regex checks in [HCore](https://github.com/henrywalters/HCore/blob/main/src/type.ts). Xl2sql determines the correct datatype that encapsulates all other datatypes within each column. For example, if an int and a float are found in a column, the least common datatype will be a float. If an int, float and a string were found, it would be a varchar.

## Installation

### CLI Usage

For cli usage, you should install xl2sql globally with

```
npm install xl2sql -g
```

### Library Usage

For library usage, you should install as a dependency with

```
npm install xl2sql --save
```

## Usage

### CLI Usage

Coming soon!

### Library Usage

Here is a minimal example of collecting file input and parsing it into a full sql query

```typescript
import xl2sql from 'xl2sql';

// Initialize a file upload button. This is just for convience!
const fileUploader = xl2sql.FileInput.generate(document.getElementById('xl2sql'));

fileUploader.onUpload(async (file) => {

    // parse the file into a data table. Attempts all available ITableParser implementations.
    const table = await TableParser.parse(file);

    // Instantiate a builder for a specific SQL engine. For now, there is only the standard builder.
    const builder = new xl2sql.SqlBuilder();

    // SqlUtils contains helpful utilities! This function will convert as many strings as possible to table friendly names. Example: TheNewTable -> the_new_table or nutritional_Facts.csv -> nutritional_facts
    const tableName = xl2sql.SqlUtils.toSnakeCase(file.name);

    // The full sql to create a table and insert all rows of data.
    console.log(builder.createFullQuery(tableName, table));

})
```
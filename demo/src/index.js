import xl2sql from 'xl2sql';
import TableParser from '../../dist/tableParser';

const file = xl2sql.FileInput.generate(document.getElementById('content'));

file.onUpload(async (file) => {
    console.log(file);

    document.getElementById('file-info').innerHTML = `
        <p><b>Name: </b> ${file.name}</p>
        <p><b>Size: </b> ${file.size}</p>
        <p><b>Type: </b> ${file.type}</p>
    `;


    console.log(await TableParser.parse(file));
})
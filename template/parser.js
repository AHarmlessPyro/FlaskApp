var file = require('fs');

var items = [];

file.readFile('C:\\Users\\Ninad Sinha\\Google Drive\\study stuff\\CSCI\\CSCI 4131\\CSCI-4131\\flask app\\FlaskApp\\template\\text.json', function (err, data) {
    if (!err) {
        dat = Buffer.from(data, 'base64').toString('binary');
        //console.log(dat);
        items.push(dat.replace(/,\n/ig, /",\n"/));
        write(items);
    }
});

function write(data) {
    file.writeFile('./converted.json', data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
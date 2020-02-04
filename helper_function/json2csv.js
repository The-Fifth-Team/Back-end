const json2csv = require("json2csv");
const fs = require('fs');

/**
 * @function json2CsvSync takes a JSON Object, and convert it to CSV Format
 * @param {object} jsonDoc the json object, to be converted to Csv Format
 * @return {string} the converted csv file as a String
 * @author Abobker Elaghel
 * */
exports.json2CsvSync = jsonDoc => {
    return json2csv.parse(jsonDoc);
};

/**
 * @function json2CsvASync takes a JSON Object, and convert it to CSV Format Asynchronously and returns a promise
 * @param jsonDoc {object} the json object, to be converted to Csv Format
 * @return {Promise<string>} the converted csv file as a String
 * @author Abobker Elaghel
 * */
exports.json2CsvASync = jsonDoc => {
    return json2csv.parseAsync(jsonDoc);
};


/**
 * @async
 * @function writeCsvFile used to convert a object to csv and write the converted stream to a File
 * @param filePath {string} the path And the file name to write the stream into
 * @note the path to the file should be Absolute path
 * @param jsonObject {object} the object to be converted to csv format
 * @author Abobker Elaghel
 * */
exports.writeCsvFile = async(filePath, jsonObject) => {
    try {
        const csvFileString = await json2csv.parseAsync(jsonObject);
        filePath = _checkPath(filePath) || filePath;
        fs.writeFile(filePath, csvFileString, err => { throw err });
        console.info(`Writing to ${filePath} Completed Successfully`);
    } catch (err) {
        console.error("Error in Helper_functions folder, writeCsvFile function");
        throw err;
    }
};

/**
 * @function _checkPath used to add the .csv extinction at the end and remove any other extinction if one exists
 * @param path {string} the path to be checked
 * @return {string} path after adding .csv to it
 * @author Abobker Elaghel
 * @private Not to be used outside the scope of this file
 * */
const _checkPath = path => {
    for (let i = path.length; i >= 0; i--) {
        if (path[i] === '.') {
            path = path.slice(0, i);
        }
        if (path[i] === '/' || path[i] === '\\') {
            path = path += ".csv";
            return path;
        }
    }
};
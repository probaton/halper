import { getRootDirectory } from "../helpers/util";

type ValueType = string | number | boolean | undefined;
type TablifyData = Record<string, ValueType>;

function getLength(value: ValueType): number {
  switch (typeof value) {
    case 'string': return value.length;
    case 'boolean': return value.toString().length;
    case 'number': return `${value}`.length;
    case 'undefined': return 0;
    default: throw new Error(`Invalid value ${value}`);
  }
}

function parseRow(dataObj: TablifyData, columnLengths: Record<string, number> ): string {
  return Object.entries(columnLengths).reduce((rowString, [colName, colLen]) => {
    const value = dataObj[colName] == undefined ? '' : dataObj[colName];
    return `${rowString}${value}${' '.repeat(colLen - getLength(value))}|`;
  }, '|');
}

export async function mdTablify(data: TablifyData[]) {
  const columnLengths = data.reduce<Record<string, number>>((colLen, dataObj) => {
    Object.entries(dataObj).forEach(([key, value]) => {
      if (colLen[key] === undefined) {
        colLen[key] = key.length;
      }

      colLen[key] = Math.max(colLen[key], getLength(value));
    });
    return colLen;
  }, {});

  const columnRowObj = Object.keys(columnLengths).reduce<Record<string, string>>((obj, key) => {
    obj[key] = key;
    return obj;
  }, {});
  const separatorRowObj = Object.keys(columnLengths).reduce<Record<string, string>>((obj, key) => {
    obj[key] = '-'.repeat(columnLengths[key]);
    return obj;
  }, {});

  data.unshift(columnRowObj, separatorRowObj);

  return data.reduce<string>((tableString, dataObj) => `${tableString}\n${parseRow(dataObj, columnLengths)}`, '');
}

function mdTablifySecretFile() {
  // to get started, create /secret/mdTablifyData.json and populate it with an array of objects
  const filePath = '/secret/mdTablifyData.json';
  const data = require(`${getRootDirectory()}${filePath}`);
  if (!Array.isArray(data)) {
    throw new Error(`${filePath} should contain an array of data objects`);
  }

  return mdTablify(data);
}

const halpConfig = {
  command: 'md-tablify',
  action: mdTablifySecretFile,
  helpText: 'Converts a JSON object to a markdown table',
  spinnerText: 'Converting data to markdown table',
};
export default halpConfig;

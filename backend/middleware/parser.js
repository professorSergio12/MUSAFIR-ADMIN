import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();
export const getDataURI = (file) => {
  const extname = path.extname(file.originalname).toString();
  return parser.format(extname, file.buffer);
};

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');

console.log("pdfParseModule.PDFParse type:", typeof pdfParseModule.PDFParse);
if (typeof pdfParseModule.PDFParse === 'function') {
  console.log("pdfParseModule.PDFParse keys/prototype:", Object.getOwnPropertyNames(pdfParseModule.PDFParse.prototype));
}
process.exit(0);

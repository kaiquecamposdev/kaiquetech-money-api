export class InvalidCsvFormatError extends Error {
  constructor() {
      super('Invalid CSV format');
  }
}
const { google } = require('googleapis');
const { SCOPES, DEFAULT_RANGE, VALUE_INPUT_OPTION, SPREADSHEET_ID } = require('./constants');

class GoogleSheetsAPI {
    constructor(credentials) {
        this.credentials = credentials;
        this.initAuth();
    }

    async initAuth() {
        try {
            this.auth = new google.auth.GoogleAuth({
                credentials: this.credentials,
                scopes: SCOPES,
            });
        } catch (error) {
            console.error('Ошибка авторизации Google', error);
            throw error;
        }
    }

    async getSheetsClient() {
        try {
            const authClient = await this.auth.getClient();
            return google.sheets({ version: 'v4', auth: authClient });
        } catch (error) {
            console.error('Ошибка при инициализации клиента Google Sheets:', error);
            throw error;
        }
    }

    async fillTable(data) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Ошибка: входные данные должны быть массивом и не могут быть пустыми.');
            throw new Error('Некорректные входные данные.');
        }

        try {
            const sheets = await this.getSheetsClient();

            const values = data.map(({ id, firstName, lastName, gender, address, city, phone, email }) => [
                id, firstName, lastName, gender, address, city, phone, email,
            ]);

            const request = {
                spreadsheetId: SPREADSHEET_ID,
                range: DEFAULT_RANGE,
                valueInputOption: VALUE_INPUT_OPTION,
                resource: {
                    values,
                },
            };

            const response = await sheets.spreadsheets.values.update(request);
            console.log('Данные успешно записаны:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при записи в Google Таблицу:', error);
            throw error;
        }
    }
}

module.exports = GoogleSheetsAPI;
const GoogleSheetsAPI = require("./api/google_sheets/api");
const DataApi = require("./api/data/api")
const fs = require("fs");

async function main() {
    const login = 'user4041'
    const credentials = JSON.parse(await fs.promises.readFile('./cred.json', 'utf8'));
    const gapi = new GoogleSheetsAPI(credentials)
    const api = new DataApi();
    try {
        await api.loginUser(login).catch(() => api.createUser(login))
        const clientsData = await api.fetchClients();
        if (!clientsData) return;
        gapi.fillTable(clientsData);
    } catch (error) {
        console.log(error.message);
    }
}

main()
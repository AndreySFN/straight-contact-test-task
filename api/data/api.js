const {Endpoints, BASE_URL, CONTENT_TYPE_HEADER} = require('./constants')

class DataApi {

    _authToken = null;

    async _request(endpoint, method, body = null, requireAuth = false) {
        const headers = {
            'Content-Type': CONTENT_TYPE_HEADER
        };

        if (requireAuth && this._authToken) {
            headers['Authorization'] = this._authToken;
        }

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            if (!response.ok) {
                console.log(`Ошибка: ${response.status} - ${response.statusText}`);
                return Promise.reject(null)
            }
            return await response.json();
        } catch (error) {
            console.log('Ошибка при выполнении запроса:', error);
            return Promise.reject(error);
        }
    }

    async createUser(username) {
            const response = await this._request(Endpoints.AUTH_REGISTRATION_ENDPOINT, 'POST', {username});
            this._authToken = response ? response.token : null;
            return response;
    }

    async loginUser(username) {
            const response = await this._request(Endpoints.AUTH_LOGIN_ENDPOINT, 'POST', {username});
            this._authToken = response ? response.token : null;
            return response;
    }

    async fetchClients() {
        return await this._request(Endpoints.CLIENTS_ENDPOINT, 'GET', null, true);
    }
}

module.exports = DataApi
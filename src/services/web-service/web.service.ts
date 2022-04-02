
export class WebService {
    private API_URL: string = 'http://localhost:7000';

    /**
     * Calls the API at the provided endpoint, with the provided body.
     * @param endpoint 
     * @param body 
     * @returns Promise.resolve: JSON object | Promise.reject: Error Response
     */
    private callApi(endpoint: string, body?: object): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.API_URL}/${endpoint}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            // Response callback
            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;

                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.responseText);
                }
            };

            // Sends POST request
            xhr.send(JSON.stringify({
                value: body ?? {}
            }));
        });
    }

    /**
     * Returns the map object for the lobby, or an error object.
     * @param body 
     * @returns Object
     */
    public loadLobby() {
        return this.callApi('loadMap');
    }
}
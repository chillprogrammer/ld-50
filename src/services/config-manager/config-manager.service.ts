const configFile = {
    "key1": "value",
    "key2": 123
}

/**
 * This service is for storing any config files.
 */
export class ConfigManagerService {

    /**
     * 
     * @returns The config file, or the error.
     */
    getConfigFile(): Promise<any> {
        return new Promise((resolve) => {
            fetch('http://example.com/movies.json')
                .then(response => response.json())
                .then((data) => {
                    //console.log(data)
                    resolve(data);
                })
                .catch((error) => {
                    console.error(error.toString());
                    resolve(error.toString());
                });
        });
    }
}
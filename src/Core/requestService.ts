
export interface RequestOption {
	url?: string;
    headers?: any;
    method?: 'GET' | 'POST' | 'PUT';
    type?: 'text' | 'json' | 'arrayBuffer';
	timeout?: number;
	data?: any;
}

export interface ResponseContext {
    res: {
        headers: { [n: string]: string };
		statusCode?: number;
    };
    data: any
}

export function xhrRequest(options: RequestOption): Promise<ResponseContext> {
    const xhr = new XMLHttpRequest();

    return new Promise<ResponseContext>((resolve, reject) => {
        xhr.open(options.method || 'GET', options.url || '', true);
        if (options.type === 'arrayBuffer') {
            xhr.responseType = 'arraybuffer'
        } else if (options.type === 'json') {
            xhr.setRequestHeader('Accept', 'application/json')
            xhr.setRequestHeader('Content-Type', 'application/json')
        }
        setRequestHeaders(xhr, options);
        
        xhr.onerror = () => reject(new Error(xhr.statusText && ('XHR failed: ' + xhr.statusText)));
        xhr.onload = () => {
            let responseData = xhr.response
            if (options.type === 'json') {
                responseData = JSON.parse(responseData)
            }
            resolve({
                res: {
                    statusCode: xhr.status,
                    headers: getResponseHeaders(xhr)
                },
                data: responseData
            })
        }

        xhr.ontimeout = () => reject(new Error(`XHR timeout: ${options.timeout}ms`));

		if (options.timeout) {
			xhr.timeout = options.timeout;
        }
        
        xhr.send(options.data as any);
    })
}

function setRequestHeaders(xhr: XMLHttpRequest, options: RequestOption): void {
    if (options.headers) {
		outer: for (let k in options.headers) {
			switch (k) {
				case 'User-Agent':
				case 'Accept-Encoding':
				case 'Content-Length':
					// unsafe headers
					continue outer;
			}
			xhr.setRequestHeader(k, options.headers[k]);

		}
	}
}

function getResponseHeaders(xhr: XMLHttpRequest): { [name: string]: string } {
	const headers: { [name: string]: string } = Object.create(null);
	for (const line of xhr.getAllResponseHeaders().split(/\r\n|\n|\r/g)) {
		if (line) {
			const idx = line.indexOf(':');
			headers[line.substr(0, idx).trim().toLowerCase()] = line.substr(idx + 1).trim();
		}
	}
	return headers;
}
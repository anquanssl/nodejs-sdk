import fetch from "node-fetch"
import { createHmac, randomUUID } from 'node:crypto';
import Order from "./resource/order.js";
import Product from "./resource/product.js";
import http_build_query from "./util/http_build_query.js";

const ORIGIN_API = "https://api.orion.pki.plus/api/v1"

const sign = (baseString, accessKeySecret) => {
    // console.log("baseString:", baseString);
    const hmac = createHmac('sha256', accessKeySecret);
    const digest = hmac.update(baseString).digest('base64');
    const encodedDigest = Buffer.from(digest).toString('utf-8');
    return encodedDigest
}

export default class Client {
    constructor(accessKeyID, accessKeySecret, apiOrigin = ORIGIN_API) {
        this.accessKeyID = accessKeyID;
        this.accessKeySecret = accessKeySecret;
        this.apiOrigin = apiOrigin;
        this.order = new Order(this);
        this.product = new Product(this);
    }

    get(uri, query = {}, body = {}) {
        return this.call("GET", uri, query, body);
    }

    post(uri, query = {}, body = {}) {
        return this.call("POST", uri, query, body)
    }

    async call(method, uri, query, body) {
        query = Object.entries(query);
        query.push(['accessKeyId', this.accessKeyID]);
        query.push(['nonce', randomUUID().replace(/-/g, '')]);
        query.push(['timestamp', new Date(+new Date() + 8 * 3600 * 1000).toISOString().split('.')[0] + "Z"]);
        query.sort();

        let parameters = query.slice();

        for (const [key, value] of Object.entries(body)) {
            if (value === null || value === undefined || value === "") {
                delete body[key];
                continue;
            }
            if (typeof value === 'object') {
                for (const [subKey, subValue] of Object.entries(value)) {
                    parameters.push([`${key}[${subKey}]`, typeof subValue === 'string' ? subValue.trim() : subValue]);
                }
            } else {
                parameters.push([key, typeof value === 'string' ? value.trim() : value]);
            }
        }
        parameters.sort();
        let _parameters = {};
        parameters.forEach(([key, value]) => {
            _parameters[key] = value;
        });

        let url = this.apiOrigin + uri;
        let signature = sign(new URL(url).pathname + '?' + http_build_query(_parameters).replace(/\%20/g, '+').replace(/\*/g, '%2A'), this.accessKeySecret);
        query.push(["sign", signature]);
        query.sort();
        let _query = {};
        query.forEach(([key, value]) => {
            _query[key] = value;
        });
        url = this.apiOrigin + uri + '?' + http_build_query(_query).replace(/\%20/g, '+').replace(/\*/g, '%2A');

        // console.log(url, body);

        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: method == "GET" ? undefined : JSON.stringify(body)
        }).then(resp => resp.json());
    }
}

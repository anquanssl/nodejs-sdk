import Client from "../client.js";

export default class AbstractResource {
    constructor(client) {
        /** @type {Client} */
        this.client = client;
    }
}
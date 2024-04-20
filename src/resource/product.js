import AbstractResource from "./abstract_resource.js";

export default class Product extends AbstractResource {
    product_list() {
        return this.client.get("/product/list");
    }
}
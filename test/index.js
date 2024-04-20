import Client from "../src/client.js";
import fs from 'fs';
import * as request from '../src/request/index.js';

const accessKeyID = "", accessKeySecret = "";
const client = new Client(accessKeyID, accessKeySecret);

const product = 'sslcom_dv_flex';
let resp, req;

const csr = fs.readFileSync("./test/csr/example.csr", "utf8");

// 产品列表
console.log("产品列表 开始测试");
resp = await client.product.product_list();
if (!resp.success) {
    console.error(resp.message);
    console.log("产品列表 测试未通过");
    process.exit(1);
}
console.log("product_list", resp.data);
console.log("产品列表 测试通过");

// 证书下单
console.log("证书下单 开始测试");
req = new request.CertificateCreateRequest();
req.product_id = product;
req.period = "annually";
req.csr = csr;
req.unique_id = (Math.random() + 1).toString(36).substring(2);
req.contact_email = "email@test.com";
req.domain_dcv = {
    ["" + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "dns",
    ["www." + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "dns",
};
req.notify_url = "https://" + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".app/notify";
resp = await client.order.certificateCreate(req);
if (!resp.success) {
    console.error(resp.message);
    console.log("证书下单 测试未通过");
    process.exit(1);
}
console.log("certificate_create", resp);
console.log("证书下单 测试通过");

const service_id = resp.data.service_id;
// 证书重签接口
console.log("证书重签 开始测试");
req = new request.CertificateReissueRequest();
req.service_id = service_id;
req.unique_id = (Math.random() + 1).toString(36).substring(2);
req.csr = csr;
req.contact_email = 'email@test.com';
req.domain_dcv = {
    ["" + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "http",
    ["www." + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "https",
    ["*." + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".app"]: "dns",
};
resp = await client.order.certificateReissue(req);
if (!resp.success) {
    console.error(resp.message);
    console.log("证书重签 测试未通过");
    process.exit(1);
}
console.log("certificate_reissue", resp);
console.log("证书重签 测试通过");


// 证书查询
console.log("证书查询 开始测试");
req = new request.CertificateDetailRequest();
req.service_id = service_id;
resp = await client.order.certificateDetail(req);
if (!resp.success) {
    console.error(resp.message);
    console.log("证书查询 测试未通过");
    process.exit(1);
}
console.log("certificate_detail", resp);
console.log("证书查询 测试通过");


// 检查DCV接口
console.log("检查DCV 开始测试");
req = new request.CertificateValidDCVRequest();
req.service_id = service_id;
resp = await client.order.certificateValidateDCV(req);
if (!resp.success) {
    console.error(resp.message);
    console.log("检查DCV 测试未通过");
    process.exit(1);
}
console.log("certificate_validate_dcv", resp);
console.log("检查DCV 测试通过");


// 证书退款
console.log("证书退款 开始测试");
req = new request.CertificateRefundRequest();
req.service_id = service_id;
resp = await client.order.certificateRefund(req);
if (!resp.success) {
    console.error(resp.message);
    console.log("证书退款 测试未通过");
    process.exit(1);
}
console.log("certificate_refund", resp);
console.log("证书退款 测试通过");


import Client from "../src/client.js";
import fs from 'fs';
import * as request from '../src/request/index.js';

const accessKeyID = "", accessKeySecret = "";
const product = 'sslcom_dv_flex';
let resp, req;

const client = new Client(accessKeyID, accessKeySecret);

const csr = fs.readFileSync("./test/csr/example.csr", "utf8");

// 产品列表
resp = await client.product.product_list();
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("product_list", resp, resp?.data?.products);

// 证书下单
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
    process.exit(1);
}
console.log("certificate_create", resp);
const service_id = resp.data.service_id;
// 证书重签接口
req = new request.CertificateReissueRequest();
req.service_id = service_id;
req.unique_id = (Math.random() + 1).toString(36).substring(2);
req.csr = csr;
req.contact_email = 'email@test.com';
req.domain_dcv = {
    [""+ (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "http",
    ["www."+ (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".cc"]: "http",
    ["*."+ (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".app"]: "dns",
}
resp = await client.order.certificateReissue(req);
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("certificate_reissue", resp);

// 证书查询
req = new request.CertificateDetailRequest();
req.service_id = service_id;
resp = await client.order.certificateDetail(req);
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("certificate_detail", resp);

// 检查DCV接口
req = new request.CertificateValidDCVRequest();
req.service_id = service_id;
resp = await client.order.certificateValidateDCV(req);
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("certificate_validate_dcv", resp);

// 证书退款
req = new request.CertificateRefundRequest();
req.service_id = service_id;
resp = await client.order.certificateRefund(req);
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("certificate_refund", resp);

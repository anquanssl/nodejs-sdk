import Client from "../src/client.js";
import * as request from '../src/request/index.js';

const accessKeyID = ""
const accessKeySecret = ""

const client = new Client(accessKeyID, accessKeySecret);
let resp;
let req;


const csr = `-----BEGIN CERTIFICATE REQUEST-----
MIICqTCCAZECAQAwPjELMAkGA1UEBhMCQ04xDTALBgNVBAgTBHRlc3QxDTALBgNV
BAcTBHRlc3QxETAPBgNVBAMTCHRlc3QuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAmDrCi50LzyBkwVcbXK8wqoxMsH0UjhszPlB982k9V5CE0wxm
Fh5W0XoFe8Rg4CHFDB39tcVfcleQTkAG+PsfImfdwWO3k0RyR/DjosjXr/GW1yQn
BtjtN5I9TP51wl6o7RAxIMpCUTG1jGGnHwiQy1UJVjrywn4PcXQFjhL7LTBIlUY2
PpmqDgrVSdgb2QK0TZ7N4y+1ED6tV8iO7qLkBVsRmGGDelrnna4VDAPow7xAOdum
I2z+f+2oF8dR6lkE/mqilXH67sxGakOV+eXi17M5PmTgdCM/1Kii2YEZudibc7F8
gDJCYhEIQSwI2p6EWzM1HWo3gH1k53xIUoBblwIDAQABoCYwJAYJKoZIhvcNAQkO
MRcwFTATBgNVHREEDDAKggh0ZXN0LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAjzt9
yB4sYmH3zoeYhJ27OoAOty/SMWB7gzIlC7umhzfTLSRD90kZGxu5q2nSNe+XMg9G
iHYV2uF73Zz9o++8VtTErdPXuMzT2dFhyh7m6J+eMCghGwU1d9i8Pwh8NmAQflVV
1+tNenP2U+4VNKy2DN2xAfxSQu6uq4sXzt18TsJfWxs2OzamDEtaq2a3zjueYi44
ufcV4R/v9VSDZdBTHj9TpVVjbnohx/Z3kk/tg8uyLw0FfVYhefOa2lNTa3VwjmdT
fsdO8HSRWA4RCTpV99pUXyKVi5mal7bFnKr4SiN9TtIN2KnlnO4hROLTdKmj1bkc
V9GH+XF7S85ufKV2fA==
-----END CERTIFICATE REQUEST-----`;

// 产品列表
resp = await client.product.product_list();
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("product_list", resp, resp?.data?.products);

// 证书下单
req = new request.CertificateCreateRequest();
req.product_id = "sectigo_dv_flex";
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

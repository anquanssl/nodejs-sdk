[<p align="center"><img src="https://github.com/anquanssl/.github/raw/main/profile/logo_dark.png" width="600" height="85"/></p>](https://www.anquanssl.com?__utm_from=github-org-profile#gh-dark-mode-only)
[<p align="center"><img src="https://github.com/anquanssl/.github/raw/main/profile/logo_light.png" width="600" height="85"/></p>](https://www.anquanssl.com?__utm_from=github-org-profile#gh-light-mode-only)

## AnquanSSL

AnquanSSL, aka "Security SSL", also known as "安全 SSL" in Mandarin, founded in 2018, and our mission is providing affordable, secure, and enhanced TLS utilization experiences in the Greater China market.

这是 [安全SSL](https://www.anquanssl.com) 开放API的 NodeJS SDK.

[获取](https://www.anquanssl.com/dashboard/api-credentials) `AccessKey` 秘钥对.

此SDK包仅面向开发者提供支持，若您是分销商，您可能需要:
- [AnquanSSL Module for WHMCS]()
- [AnquanSSL Module for idcSmart]()

如果您要其它编程语言的开发者，您可能需要
- [AnquanSSL PHP SDK](https://github.com/anquanssl/sdk)
- [AnquanSSL Python SDK](https://github.com/anquanssl/python-sdk)
- [AnquanSSL NodeJS SDK](https://github.com/anquanssl/nodejs-sdk)
- [AnquanSSL Golang SDK](https://github.com/anquanssl/golang-sdk)
- [AnquanSSL Java SDK](https://github.com/anquanssl/java-sdk)


## 安装

install via NPM

```bash
npm i anquanssl
```

or Yarn

```bash
yarn add anquanssl
```

## 使用

```javascript
import Client, {request} from 'anquanssl';

const accessKeyID = "";
const accessKeySecret = "";
const product = 'sslcom_dv_flex';

const client = new Client(accessKeyID, accessKeySecret);

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
req.unique_id = (Math.random() + 1).toString(36).substring(2); // 建议使用本地业务订单号拼接重签名操作次数
req.contact_email = "email@test.com";
req.domain_dcv = {
    "domain1.com": "dns",
    "*.domain2.com": "dns",
};
req.notify_url = "https://" + (Math.random() + 1).toString(36).substring(2).toLowerCase() + ".app/notify";
resp = await client.order.certificateCreate(req);
if (!resp.success) {
    console.error(resp.message);
    process.exit(1);
}
console.log("certificate_create", resp);
const service_id = resp.data.service_id; // 下单成功证书流水号


// 证书重签接口
req = new request.CertificateReissueRequest();
req.service_id = service_id;
req.unique_id = (Math.random() + 1).toString(36).substring(2); // 建议使用本地业务订单号拼接重签名操作次数
req.csr = csr;
req.contact_email = 'email@test.com';
req.domain_dcv = {
    "domain3.com": "http",
    "domain4.com": "http",
    "*.domain5.com": "dns",
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
```

## 贡献

特别鸣谢以下工程师对本项目的贡献:

[@jellnicy](https://github.com/jellnicy)

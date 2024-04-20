// 证书重签请求
export default class CertificateUpdateDcvRequest {
    constructor() {
        this.service_id = ""; // 必传,下单时返回的id
        this.domain_dcv = {}; // 必传
    }
}
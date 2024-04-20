import AbstractResource from "./abstract_resource.js";


export default class Order extends AbstractResource {
  
  certificateCreate(certificate_create_request) {
    return this.client.post('/certificate/create', {}, certificate_create_request);
  }

  certificateDetail(certificate_detail_request) {
    return this.client.get("/certificate/detail", certificate_detail_request, {});
  }

  certificateReissue(certificate_reissue_request) {
    return this.client.post("/certificate/reissue", {}, certificate_reissue_request);
  }

  certificateValidateDCV(certificate_valid_dcv_request) {
    return this.client.post("/certificate/validate-dcv", {}, certificate_valid_dcv_request);
  }

  certificateRefund(certificate_refund_request) {
    return this.client.post("/certificate/refund", {}, certificate_refund_request);
  }
}
// 证书重签请求
export default class CertificateReissueRequest {
    constructor() {
        this.service_id = ""; // 必传,下单时返回的id
        this.domain_dcv = {}; // 必传
        this.csr = ""; // 必传,客户上传的CSR
        this.renew = 0; // OV/EV必传,是否为续费订单
        this.organization = ""; // OV/EV必传,公司名称
        this.organization_unit = ""; // OV/EV必传,公司部门
        this.registered_address_line1 = ""; // OV/EV必传,公司注册地址
        this.serial_no = ""; // OV/EV必传,公司注册号，三证合一
        this.country = ""; // OV/EV必传,2位国别码，大写
        this.state = ""; // OV/EV必传,省份
        this.city = ""; // OV/EV必传,城市
        this.postal_code = ""; // OV/EV必传,邮编
        this.organization_phone = ""; // OV/EV必传,组织注册登记电话
        this.date_of_incorporation = ""; // OV/EV必传,成立日期
        this.contact_name = ""; // OV/EV必传,联系人
        this.contact_title = ""; // OV/EV必传,联系人职位
        this.contact_phone = ""; // OV/EV必传,联系人电话
        this.contact_email = ""; // 必传,联系人邮箱
        this.notify_url = ""; // 必传,证书颁发后的通知地址
    }
}
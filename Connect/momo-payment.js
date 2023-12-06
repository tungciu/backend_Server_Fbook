const axios = require('axios');

const momoPayment = {
    initiatePayment: async (orderInfo) => {
        const endpoint = 'https://payment.momo.vn/gw_payment/transactionProcessor';
        const partnerCode = 'your_partner_code';
        const accessKey = 'your_access_key';
        const secretKey = 'your_secret_key';

        const requestBody = {
            accessKey,
            partnerCode,
            requestType: 'captureMoMoWallet',
            notifyUrl: 'your_notify_url',
            returnUrl: 'your_return_url',
            orderId: orderInfo.orderId,
            orderInfo: orderInfo.orderDescription,
            amount: orderInfo.amount,
            orderType: 'MERCHANT',
            extraData: 'your_extra_data',
        };

        const signature = `${requestBody.accessKey}${requestBody.partnerCode}${requestBody.requestType}${requestBody.notifyUrl}${requestBody.returnUrl}${requestBody.orderId}${requestBody.amount}${requestBody.orderType}${requestBody.extraData}${secretKey}`;

        requestBody.signature = require('crypto').createHash('sha256').update(signature).digest('hex');

        try {
            const response = await axios.post(endpoint, requestBody);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = momoPayment;

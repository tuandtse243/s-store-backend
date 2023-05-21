import crypto from 'crypto';
import https from 'https';

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderId = 'MOMO1684648428675';
const requestId = 'MOMO1684648428675';
const lang = 'en';
const signature = crypto.createHmac('sha256', secretKey)
    .update(`accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`)
    .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode,
        requestId,
        orderId,
        lang,
        signature,
      });
  
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
    };
    //   return new Promise((resolve, reject) => {
    //     const req = https.request(options, (res) => {
    //       res.setEncoding('utf8');
    //       res.on('data', (body) => {
    //         console.log(body);
    //         const data = JSON.parse(body);
    //         const verifyPaymentResult = {
    //           status: getPaymentStatus(data.resultCode),
    //         };
    //         resolve(verifyPaymentResult);
    //       });
    //     });
    //     req.on('error', (e) => {
    //       console.error(e);
    //       reject(e);
    //     });
    //     req.write(requestBody);
    //     req.end();
    // });
    const req = https.request(options, res => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body: ');
            console.log(body);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    })

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....")
    req.write(requestBody);
    req.end();

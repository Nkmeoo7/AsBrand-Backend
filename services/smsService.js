const axios = require('axios');

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY;

/**
 * Send OTP via 2Factor
 * @param {string} phone - 10-digit Indian phone number
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<boolean>} - true if sent successfully
 */
async function sendOtpSms(phone, otp) {
    if (!TWO_FACTOR_API_KEY) {
        console.warn('⚠️  TWO_FACTOR_API_KEY not set. OTP logged to console only.');
        console.log(`\n📱 OTP for ${phone}: ${otp}\n`);
        return true;
    }

    try {
        const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}`;
        const response = await axios.get(url);

        console.log('2Factor response:', JSON.stringify(response.data));

        if (response.data && response.data.Status === 'Success') {
            console.log(`✅ OTP sent to ${phone} via 2Factor`);
            return true;
        } else {
            console.error('❌ 2Factor error:', response.data?.Details || response.data);
            // Don't throw — still let the flow continue so OTP is saved in DB
            return false;
        }
    } catch (error) {
        console.error('❌ 2Factor request failed:', error.response?.data || error.message);
        // Don't throw — let the flow continue, OTP is still saved in DB for dev testing
        console.log(`\n📱 [FALLBACK] OTP for ${phone}: ${otp}\n`);
        return false;
    }
}

module.exports = { sendOtpSms };

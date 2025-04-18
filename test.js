require('dotenv').config();
const Mastodon = require('mastodon-api');

const M = new Mastodon({
    access_token: process.env.ACCESS_TOKEN,
    api_url: process.env.API_URL
});

M.get('accounts/verify_credentials', (err, data) => {
    if (err) {
        console.error("API 请求失败:", err);
    } else {
        console.log("账号信息：", data);
    }
});

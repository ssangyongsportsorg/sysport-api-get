const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
let currentToken = null;

// 簡單的密碼檢查中間件
const checkPassword = (req, res, next) => {
    const password = req.query.password;
    const correctPassword = 'euhdhdjrirurgrgrudidi'; // 替換成你想要的密碼
    
    if (password === correctPassword) {
        next();
    } else {
        res.status(401).send('需要正確的密碼才能查看 token');
    }
};

// 路由 /a - 獲取新的 access token（不需要密碼）
app.get('/a', async (req, res) => {
    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.zoho.com/oauth/v2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
                grant_type: 'refresh_token',
                client_id: '1000.4TBHLV7ZDN6AIB4B6WQ31UG05CIBIY',
                client_secret: '35f258c075db40bf2f628362030f250d5b8d436868', // 替換為你的 Client Secret
                refresh_token: '1000.396b94b1259d009dcd7abb245cd1be43.1496b1b954d1ac2c71482e532dcd36c1'
            })
        });

        currentToken = tokenResponse.data.access_token;
        res.send('Token 已成功更新');
    } catch (error) {
        console.error('獲取 token 時發生錯誤:', error);
        res.status(500).send('獲取 token 時發生錯誤');
    }
});

// 路由 /b - 顯示 token（需要密碼）
app.get('/b', checkPassword, (req, res) => {
    if (currentToken) {
        res.send(currentToken);
    } else {
        res.status(404).send('目前沒有可用的 token，請先訪問 /a');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服務器運行在端口 ${PORT}`);
});

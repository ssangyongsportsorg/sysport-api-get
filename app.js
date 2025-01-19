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

// 路由 /a - 獲取 token（不需要密碼）
app.get('/a', async (req, res) => {
    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://auth.ssangyongsports.eu.org/oidc/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
                grant_type: 'client_credentials',
                client_id: 'ymk1q0glzppg02jjizsz3',
                client_secret: '04ygZSnwYW8TG01YXf1sm3MpDpdMdAx6',
                resource: 'https://ssport/api',
                scope: 'all'
            })
        });
        
        currentToken = tokenResponse.data.access_token;
        res.send('Token 已成功更新');
    } catch (error) {
        console.error('Error fetching token:', error);
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

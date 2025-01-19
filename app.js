const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
let currentToken = null;

// 路由 /a - 獲取 token
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
                resource: 'https://default.logto.app/api,
                scope: 'all'
            })
        });
        
        // 只儲存 access_token
        currentToken = tokenResponse.data.access_token;
        res.send('Token has been retrieved successfully');
    } catch (error) {
        console.error('Error fetching token:', error);
        res.status(500).send('Error fetching token');
    }
});

// 路由 /b - 只顯示 access_token
app.get('/b', (req, res) => {
    if (currentToken) {
        res.send(currentToken);
    } else {
        res.status(404).send('No token available. Please visit /a first');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

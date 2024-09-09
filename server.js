const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000; // Port for your backend server
app.use(cors());

const client_id = 'Ov23li6YsaVWRbOAEkpA';
const client_secret = '9087a0f7e211cfa8c896ab3e7e80efd829a031e8';

// Redirect route for GitHub OAuth callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get the user profile from GitHub using the access token
    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      accessToken,
      user: userResponse.data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub user' });
  }
});

app.listen(port, () => {
  console.log(`OAuth server running on http://localhost:${port}`);
});

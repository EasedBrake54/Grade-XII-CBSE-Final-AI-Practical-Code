const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load the constellations data
const constellationsData = fs.readFileSync('./data/constellations.json', 'utf8');
const constellations = JSON.parse(constellationsData);

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Function to filter constellations based on latitude, longitude, and current month
const filterConstellations = (latitude, longitude) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return constellations.filter(constellation => {
        return constellation.month_visible.includes(currentMonth);
    });
};

// Route to handle constellation filtering
app.get('/constellations', (req, res) => {
    const latitude = req.query.latitude || 22.0063; // Default to Palampur latitude
    const longitude = req.query.longitude || 77.006; // Default to Palampur longitude

    const filteredConstellations = filterConstellations(latitude, longitude);
    res.json(filteredConstellations);
});

// Route to serve a page for detailed information about a specific constellation
app.get('/constellation/:name', (req, res) => {
    const name = req.params.name;
    const constellation = constellations.find(c => c.name.toLowerCase() === name.toLowerCase());

    if (constellation) {
        res.send(`
            <html>
            <head>
                <title>${constellation.name}</title>
                <style>
                    body {
                        background-color: #191970; /* Midnight blue */
                        color: #FFFFFF;
                        font-family: 'Comic Sans MS', cursive, sans-serif;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                    }
                    .details {
                        margin-top: 20px;
                        padding: 10px;
                        border: 2px solid #FFFFFF;
                        border-radius: 10px;
                    }
                </style>
            </head>
            <body>
                <h1>${constellation.name}</h1>
                <div class="details">
                    <p><strong>Description:</strong> ${constellation.description}</p>
                    <p><strong>Months Visible:</strong> ${constellation.month_visible}</p>
                    <p><strong>Region:</strong> ${constellation.region}</p>
                    <p><strong>Continent:</strong> ${constellation.continent}</p>
                    <p><strong>Countries:</strong> ${constellation.countries.join(', ')}</p>
                </div>
                <p><a href="/" style="color: #87CEFA;">Back to Home</a></p>
            </body>
            </html>
        `);
    } else {
        res.status(404).send('Constellation not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


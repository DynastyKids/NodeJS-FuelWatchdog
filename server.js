const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "mongofuel";
let db, coll_hot;

async function connectDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        coll_hot = db.collection("current");
        console.log(`✅ MongoDB Connected: ${dbName}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

// 视野范围内油站查询 API
app.get('/api/stations', async (req, res) => {
    try {
        const { west, south, east, north } = req.query;
        let query = {};

        if (west && south && east && north) {
            query = {
                location: {
                    $geoWithin: {
                        $box: [
                            [parseFloat(west), parseFloat(south)],
                            [parseFloat(east), parseFloat(north)]
                        ]
                    }
                }
            };
        }

        // 返回完整的燃油历史，供前端计算 14 天内高低价和绘制趋势线
        const stations = await coll_hot.find(query)
            .limit(200)
            .toArray();

        res.json(stations);
    } catch (err) {
        res.status(500).json({ error: "Data load failed" });
    }
});

connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});

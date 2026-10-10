const express = require('express');
const path = require('path');

const app = express();

// قراءة الواجهة من مجلد public مباشرة
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Nightfall running on port ${PORT}`);
});

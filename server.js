const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// قائمة الأكواد الصحيحة المسموح لها بالتفعيل (يمكنك تعديلها أو إضافتها)
const VALID_KEYS = [
    "NIGHTFALL-VIP-2026",
    "VIP-ADMIN-KEY",
    "FREE-PASS-123"
];

// نقطة لفحص حالة السيرفر
app.get('/', (req, res) => {
    res.json({ status: "Server is running perfectly!", version: "3.1.5-Nightfall" });
});

// نقطة التحقق من التفعيل
app.post('/api/check-auth', (req, res) => {
    const { key } = req.body;
    if (key && VALID_KEYS.includes(key.trim())) {
        return res.json({ authorized: true, plan: "premium", unlimited: true });
    }
    return res.json({ authorized: false, message: "الكود غير صحيح أو منتهي." });
});

// نقطة تفعيل الكود الجديد
app.post('/api/activate', (req, res) => {
    const { key } = req.body;
    if (key && VALID_KEYS.includes(key.trim())) {
        return res.json({ 
            success: true, 
            message: "تم التفعيل بنجاح عبر السيرفر! المحاولات أصبحت غير محدودة." 
        });
    }
    return res.json({ success: false, message: "الكود غير صحيح." });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
app.use(express.json());

// عرض واجهة المستخدم الفخمة المطابقة لواجهتك تماماً
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NIGHTFALL | Ultimate Suite</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background-color: #050508;
            color: #f0f0f5;
            min-height: 100vh;
            display: flex;
            overflow: hidden;
        }
        .app-container {
            display: flex;
            width: 100vw;
            height: 100vh;
            padding: 20px;
            gap: 20px;
        }
        .sidebar {
            width: 260px;
            background: #0a0a12;
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            padding: 20px;
        }
        .logo-area {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #fff;
            margin-bottom: 30px;
            text-align: center;
        }
        .logo-area span {
            color: #ff007f;
        }
        .nav-links {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex-grow: 1;
        }
        .nav-links li {
            padding: 12px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            color: #8c8c9e;
            transition: 0.3s;
        }
        .nav-links li:hover, .nav-links li.active {
            background: rgba(157, 78, 221, 0.2);
            color: #fff;
            border: 1px solid #9d4edd;
        }
        .server-badge {
            background: rgba(255, 0, 127, 0.1);
            border: 1px solid #ff007f;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            color: #ff007f;
        }
        .main-content {
            flex-grow: 1;
            background: #0a0a12;
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            padding: 30px;
            overflow-y: auto;
        }
        .tab-content {
            display: none;
            flex-direction: column;
            gap: 15px;
            height: 100%;
        }
        .tab-content.active {
            display: flex;
        }
        h2 {
            font-size: 20px;
            margin-bottom: 5px;
            color: #9d4edd;
        }
        .drop-zone {
            border: 2px dashed #9d4edd;
            border-radius: 12px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(157, 78, 221, 0.05);
            cursor: pointer;
            text-align: center;
            transition: 0.3s;
        }
        .drop-zone:hover {
            background: rgba(157, 78, 221, 0.12);
            border-color: #ff007f;
        }
        .stats-box {
            background: #020204;
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 10px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 14px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .stat-item span {
            color: #ff007f;
            font-weight: bold;
        }
        .patch-glow-banner {
            width: 100%;
            text-align: center;
            padding: 10px;
            background: rgba(157, 78, 221, 0.15);
            border: 1px solid #9d4edd;
            border-radius: 6px;
            color: #b5179e;
            font-weight: 900;
            font-size: 15px;
            letter-spacing: 2px;
            text-shadow: 0 0 10px #b5179e, 0 0 20px #7209b7;
        }
        .actions-box {
            display: flex;
            gap: 10px;
            margin-top: 5px;
        }
        .cyber-btn {
            flex: 1;
            background: linear-gradient(135deg, #9d4edd, #ff007f);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 13px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            transition: 0.2s;
        }
        .cyber-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .cyber-btn-secondary {
            background: #050508;
            border: 1px solid #9d4edd;
            color: #00ffcc;
        }
        .console-box {
            background: #020204;
            border: 1px solid rgba(157, 78, 221, 0.3);
            border-radius: 8px;
            padding: 12px;
            font-family: monospace;
            font-size: 12px;
            color: #00ffcc;
            flex-grow: 1;
            overflow-y: auto;
        }
        .setting-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(157, 78, 221, 0.3);
            padding: 15px;
            border-radius: 8px;
        }
    </style>
</head>
<body>

    <div class="app-container">
        <!-- القائمة الجانبية -->
        <div class="sidebar">
            <div class="logo-area">NIGHT<span>FALL</span></div>
            
            <ul class="nav-links">
                <li class="active" onclick="switchTab('home', event)">الرئيسية (HUD & Patch)</li>
                <li onclick="switchTab('console', event)">وحدة التحكم</li>
                <li onclick="switchTab('settings', event)">حماية وتخطى تيك توك</li>
                <li onclick="switchTab('account', event)">الحساب والمصادقة</li>
            </ul>

            <div class="server-badge">SERVER: RENDER ACTIVE</div>
        </div>

        <!-- المحتوى الرئيسي -->
        <div class="main-content">
            <!-- الرئيسية -->
            <div id="home" class="tab-content active">
                <h2>نظام معالجة وتثبيت جودة تيك توك</h2>
                <p style="color: #8c8c9e;">اختر مقطع الفيديو لتجهيزه وضغطه بالبصمة المثالية عبر سيرفر المعالجة.</p>
                
                <input type="file" id="realFilePicker" style="display: none;" accept="video/*" onchange="processVideoFile(event)">

                <div class="drop-zone" onclick="document.getElementById('realFilePicker').click()">
                    <div id="dropZoneText">
                        <p style="color: #00ffcc; font-size: 15px; font-weight: bold;">📁 انقر هنا لاختيار المقطع ومعالجته عبر السيرفر</p>
                        <p style="color: #8c8c9e; font-size: 12px; margin-top: 4px;">يدعم دقة 2K / 4K ومعدل 60/120 FPS</p>
                    </div>
                </div>

                <div class="stats-box" id="videoStatsBox" style="display: none;">
                    <div class="stats-grid">
                        <div class="stat-item">اسم الملف: <span id="vName">---</span></div>
                        <div class="stat-item">الحالة: <span id="vStatus">جاهز للإرسال</span></div>
                        <div class="stat-item">الحجم: <span id="vSize">0 MB</span></div>
                        <div class="stat-item">المحرك: <span id="vEngine">Render FFmpeg</span></div>
                    </div>
                    
                    <div class="patch-glow-banner" id="patchBanner">
                        ⚡ ANTI-COMPRESSION PROFILE READY ⚡
                    </div>

                    <div class="actions-box" id="actionButtons">
                        <button class="cyber-btn" id="downloadBtn" onclick="uploadAndProcessServer()">🚀 بدء الرندر والمعالجة الفورية</button>
                        <a href="https://www.tiktok.com/tiktokstudio/upload" target="_blank" class="cyber-btn cyber-btn-secondary">فتح استوديو تيك توك</a>
                    </div>
                </div>
            </div>

            <!-- وحدة التحكم -->
            <div id="console" class="tab-content">
                <h2>سجل النظام</h2>
                <div class="console-box" id="consoleLogs">
                    [SYSTEM] NIGHTFALL Fast Suite online.<br>
                    [ENGINE] Render Server connected wrapper loaded.<br>
                    [READY] Awaiting video selection...
                </div>
            </div>

            <!-- الإعدادات -->
            <div id="settings" class="tab-content">
                <h2>إعدادات التخطي</h2>
                <div class="setting-card">
                    <h3 style="color: #9d4edd; margin-bottom: 5px;">بروتوكول ترويسة الحاوية الذكية</h3>
                    <p style="color: #8c8c9e; font-size: 13px;">تعديل الهيكل الثنائي لضمان قبول السيرفر للملف بدقة عالية.</p>
                </div>
            </div>

            <!-- الحساب -->
            <div id="account" class="tab-content">
                <h2>معلومات الترخيص</h2>
                <div class="setting-card">
                    <h3 style="color: #9d4edd; margin-bottom: 5px;">VIP ELITE</h3>
                    <p style="color: #8c8c9e; font-size: 13px;">مرخص ومفعل بالكامل على سيرفرك السحابي.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedFile = null;

        function switchTab(tabId, event) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

            document.getElementById(tabId).classList.add('active');
            if(event && event.currentTarget) {
                event.currentTarget.classList.add('active');
            }
        }

        function processVideoFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            selectedFile = file;

            document.getElementById('dropZoneText').innerHTML = \`
                <p style="color: #00ffcc; font-size: 14px; font-weight: bold;">✅ تم اختيار الملف: \${file.name}</p>
            `;

            document.getElementById('videoStatsBox').style.display = 'flex';
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            document.getElementById('vName').innerText = file.name;
            document.getElementById('vSize').innerText = \`\${fileSizeMB} MB\`;

            logToConsole(\`[SUCCESS] File loaded locally: \${file.name}\`);
        }

        async function uploadAndProcessServer() {
            if (!selectedFile) return;

            logToConsole(`[UPLOAD] Sending file to Render server for FFmpeg processing...`);
            document.getElementById('vStatus').innerText = 'جاري المعالجة... ⏳';

            const formData = new FormData();
            formData.append('video', selectedFile);

            try {
                const response = await fetch('/api/process-video', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('فشل معالجة السيرفر');

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = \`NIGHTFALL_RENDERED_\${selectedFile.name}\`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                document.getElementById('vStatus').innerText = 'تم الانتهاء بنجاح! ✅';
                logToConsole(`[SUCCESS] Render completed successfully. File downloaded.`);
            } catch (error) {
                document.getElementById('vStatus').innerText = 'خطأ في المعالجة ❌';
                logToConsole(`[ERROR] Processing failed on server.`);
            }
        }

        function logToConsole(message) {
            const consoleBox = document.getElementById('consoleLogs');
            if(consoleBox) {
                const timestamp = new Date().toLocaleTimeString();
                consoleBox.innerHTML += \`<br>[\${timestamp}] \${message}\`;
                consoleBox.scrollTop = consoleBox.scrollHeight;
            }
        }
    </script>
</body>
</html>`);
});

// مسار معالجة الفيديو عبر FFmpeg في السيرفر
app.post('/api/process-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'لم يتم رفع أي فيديو' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(uploadDir, `output_${Date.now()}.mp4`);

    const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset slow -crf 18 -r 60 -pix_fmt yuv420p -c:a aac "${outputPath}"`;

    console.log('[SYSTEM] Processing video on Render server...');

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

        if (error) {
            console.error(`[ERROR] ${error.message}`);
            return res.status(500).json({ error: 'فشل في معالجة الفيديو' });
        }

        console.log('[SUCCESS] Video processed successfully!');
        
        res.download(outputPath, 'NIGHTFALL_PROTECTED_VIDEO.mp4', (err) => {
            if (err) console.error(err);

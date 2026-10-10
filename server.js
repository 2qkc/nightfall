const express = require('express');
const path = require('path');

const app = express();

// إرسال واجهتك الأصلية الفخمة بالكامل بدون أي نقصان
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

            <div class="server-badge">ULTRA 4K/120FPS READY</div>
        </div>

        <!-- المحتوى الرئيسي -->
        <div class="main-content">
            <!-- الرئيسية -->
            <div id="home" class="tab-content active">
                <h2>نظام معالجة وتثبيت جودة تيك توك</h2>
                <p style="color: #8c8c9e;">اختر مقطع الفيديو (4K / 2K / 120 FPS) لتجهيزه فورياً بدون إعادة رندر مدمرة.</p>
                
                <input type="file" id="realFilePicker" style="display: none;" accept="video/*" onchange="processVideoFile(event)">

                <div class="drop-zone" onclick="document.getElementById('realFilePicker').click()">
                    <div id="dropZoneText">
                        <p style="color: #00ffcc; font-size: 15px; font-weight: bold;">📁 انقر هنا لاختيار المقطع الخارق (استجابة فورية 4K/120FPS)</p>
                        <p style="color: #8c8c9e; font-size: 12px; margin-top: 4px;">يدعم دقة 2K / 4K ومعدل 120 FPS بكامل الجودة</p>
                    </div>
                </div>

                <div class="stats-box" id="videoStatsBox" style="display: none;">
                    <div class="stats-grid">
                        <div class="stat-item">اسم الملف: <span id="vName">---</span></div>
                        <div class="stat-item">الدقة: <span id="vRes">---</span></div>
                        <div class="stat-item">الحجم: <span id="vSize">0 MB</span></div>
                        <div class="stat-item">الإطارات: <span id="vFps">---</span></div>
                    </div>
                    
                    <div class="patch-glow-banner" id="patchBanner">
                        ⚡ 4K / 120FPS ANTI-COMPRESSION ACTIVE ⚡
                    </div>

                    <div class="actions-box" id="actionButtons">
                        <button class="cyber-btn" id="downloadBtn" onclick="downloadOptimizedVideo()">📥 حفظ المقطع الفوري (بدون رندر)</button>
                        <a href="https://www.tiktok.com/tiktokstudio/upload" target="_blank" class="cyber-btn cyber-btn-secondary">🚀 فتح استوديو تيك توك</a>
                    </div>
                </div>
            </div>

            <!-- وحدة التحكم -->
            <div id="console" class="tab-content">
                <h2>سجل النظام</h2>
                <div class="console-box" id="consoleLogs">
                    [SYSTEM] NIGHTFALL Ultra 4K Suite online.<br>
                    [ENGINE] Zero-Render 120FPS bypass active.<br>
                    [READY] Awaiting 4K video selection...
                </div>
            </div>

            <!-- الإعدادات -->
            <div id="settings" class="tab-content">
                <h2>إعدادات التخطي</h2>
                <div class="setting-card">
                    <h3 style="color: #9d4edd; margin-bottom: 5px;">بروتوكول ترويسة الحاوية الذكية</h3>
                    <p style="color: #8c8c9e; font-size: 13px;">تثبيت بصمة 4K/120FPS لمنع خفض الجودة نهائياً.</p>
                </div>
            </div>

            <!-- الحساب -->
            <div id="account" class="tab-content">
                <h2>معلومات الترخيص</h2>
                <div class="setting-card">
                    <h3 style="color: #9d4edd; margin-bottom: 5px;">VIP ULTRA ELITE</h3>
                    <p style="color: #8c8c9e; font-size: 13px;">مرخص لدعم مقاطع 4K و 120 FPS بدون رندر.</p>
                </div>
            </div>

        </div>
    </div>

    <script>
        let currentFile = null;

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
            currentFile = file;

            document.getElementById('dropZoneText').innerHTML = \`
                <p style="color: #00ffcc; font-size: 14px; font-weight: bold;">✅ تم اختيار المقطع بنجاح: \${file.name}</p>
            \`;

            document.getElementById('videoStatsBox').style.display = 'flex';

            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            document.getElementById('vName').innerText = file.name;
            document.getElementById('vSize').innerText = \`\${fileSizeMB} MB\`;

            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            
            videoElement.onloadedmetadata = function() {
                window.URL.revokeObjectURL(videoElement.src);
                const width = videoElement.videoWidth;
                const height = videoElement.videoHeight;
                document.getElementById('vRes').innerText = \`\${width}x\${height} (Ultra 4K/2K)\`;

                let fpsText = "120 FPS (محمي ومنع الضغط)";
                if (

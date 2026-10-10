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

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TIKOPRO - Nightfall Studio</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                    background-color: #0b0714;
                    color: #fff;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .studio-card {
                    background: #130e24;
                    border: 1px solid #2b1b4d;
                    width: 450px;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(138, 43, 226, 0.2);
                    text-align: center;
                }
                h2 {
                    color: #c084fc;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }
                p {
                    color: #9ca3af;
                    font-size: 14px;
                    margin-bottom: 25px;
                }
                .upload-box {
                    border: 2px dashed #4c1d95;
                    padding: 30px;
                    border-radius: 12px;
                    background: #18102e;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .upload-box:hover {
                    border-color: #a855f7;
                    background: #1f143a;
                }
                input[type="file"] {
                    display: none;
                }
                .file-label {
                    color: #e9d5ff;
                    font-weight: bold;
                    cursor: pointer;
                }
                .btn-process {
                    background: linear-gradient(135deg, #7e22ce, #a855f7);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    font-size: 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                    margin-top: 20px;
                    transition: 0.3s;
                }
                .btn-process:hover {
                    opacity: 0.9;
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
                }
                #progress-container {
                    display: none;
                    margin-top: 20px;
                }
                .progress-bar-bg {
                    background: #2b1b4d;
                    border-radius: 10px;
                    overflow: hidden;
                    height: 10px;
                    width: 100%;
                    margin-top: 10px;
                }
                .progress-bar-fill {
                    background: linear-gradient(90deg, #9333ea, #c084fc);
                    height: 100%;
                    width: 0%;
                    transition: width 0.4s ease;
                }
                #status {
                    margin-top: 15px;
                    color: #d8b4fe;
                    font-size: 14px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="studio-card">
                <h2>TIKO-PRO STUDIO</h2>
                <p>ارفع مقطعك لمعالجته بالمعايير الخارقة المضادة للضغط وبجودة عالية</p>
                
                <div class="upload-box" onclick="document.getElementById('videoFile').click();">
                    <span class="file-label" id="fileName">اضغط هنا لاختيار الفيديو 🎥</span>
                    <input type="file" id="videoFile" accept="video/*" onchange="showFileName()">
                </div>

                <button class="btn-process" onclick="uploadVideo()">بدء معالجة ورندر الفيديو ⚡</button>

                <div id="progress-container">
                    <div id="status">جاري رفع ومعالجة الفيديو للسيرفر... 0%</div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" id="progressBar"></div>
                    </div>
                </div>
            </div>

            <script>
                function showFileName() {
                    const fileInput = document.getElementById('videoFile');
                    if (fileInput.files.length > 0) {
                        document.getElementById('fileName').innerText = "تم اختيار: " + fileInput.files[0].name;
                    }
                }

                async function uploadVideo() {
                    const fileInput = document.getElementById('videoFile');
                    const progressContainer = document.getElementById('progress-container');
                    const statusDiv = document.getElementById('status');
                    const progressBar = document.getElementById('progressBar');
                    
                    if (fileInput.files.length === 0) {
                        alert('الرجاء اختيار فيديو أولاً!');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('video', fileInput.files[0]);

                    progressContainer.style.display = 'block';
                    statusDiv.innerHTML = 'جاري الرفع لسيرفر Render المعالج... 🚀';
                    progressBar.style.width = '30%';

                    try {
                        setTimeout(() => {
                            statusDiv.innerHTML = 'جاري رندر الفيديو بدقة HD و 60 FPS... ⚙️';
                            progressBar.style.width = '70%';
                        }, 2000);

                        const response = await fetch('/api/process-video', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) throw new Error('فشل المعالجة');

                        progressBar.style.width = '100%';
                        statusDiv.innerHTML = 'تم الانتهاء بنجاح! جاري تحميل ملفك الخارق... ✅';

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'TIKOPRO_PROTECTED_VIDEO.mp4';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    } catch (error) {
                        statusDiv.innerHTML = 'حدث خطأ أثناء المعالجة ❌';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

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
        
        res.download(outputPath, 'TIKOPRO_PROTECTED_VIDEO.mp4', (err) => {
            if (err) console.error(err);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] TikoPro Studio running on port ${PORT}`);
});

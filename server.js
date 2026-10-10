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
            <title>Nightfall - TikoPro Studio</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
                    width: 500px;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(138, 43, 226, 0.25);
                    text-align: center;
                }
                .upload-section {
                    display: block;
                }
                .upload-box {
                    border: 2px dashed #4c1d95;
                    background: #18102e;
                    padding: 40px 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .upload-box:hover {
                    border-color: #a855f7;
                    background: #1f143a;
                }
                .btn-select {
                    background: linear-gradient(135deg, #7e22ce, #a855f7);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 15px;
                }
                input[type="file"] {
                    display: none;
                }
                /* تصميم الدائرة والعداد المشابه لـ TikoPro */
                #progress-section {
                    display: none;
                }
                .circular-progress {
                    position: relative;
                    width: 150px;
                    height: 150px;
                    margin: 20px auto;
                    border-radius: 50%;
                    background: conic-gradient(#c084fc 0deg, #2b1b4d 0deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .circular-inner {
                    width: 120px;
                    height: 120px;
                    background: #130e24;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .percentage {
                    font-size: 24px;
                    font-weight: bold;
                    color: #fff;
                }
                .brand-name {
                    font-size: 11px;
                    color: #a855f7;
                    letter-spacing: 1px;
                    margin-top: 2px;
                }
                #status-desc {
                    color: #d8b4fe;
                    font-size: 14px;
                    margin-top: 15px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="studio-card">
                <div class="upload-section" id="uploadSec">
                    <h2 style="color: #c084fc; margin-top: 0;">NIGHTFALL STUDIO</h2>
                    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 25px;">ارفع مقطعك ليقوم السيرفر برندره وضغطه بجودة خارقة</p>
                    <div class="upload-box" onclick="document.getElementById('videoFile').click();">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <h3 id="fileNameDisplay" style="margin: 10px 0 5px; color: #fff;">حدد الفيديو لرفع ومعالجة السيرفر</h3>
                        <button class="btn-select">اختيار فيديو</button>
                        <input type="file" id="videoFile" accept="video/*" onchange="startProcessing()">
                    </div>
                </div>

                <div id="progress-section">
                    <h3 style="color: #c084fc; margin-top: 0;">NIGHTFALL RENDER</h3>
                    <div class="circular-progress" id="circleProgress">
                        <div class="circular-inner">
                            <div class="percentage" id="percentText">0%</div>
                            <div class="brand-name">TIKOPRO</div>
                        </div>
                    </div>
                    <div id="status-desc">جاري الاتصال بسيرفر المعالجة...</div>
                </div>
            </div>

            <script>
                function startProcessing() {
                    const fileInput = document.getElementById('videoFile');
                    if (fileInput.files.length === 0) return;

                    document.getElementById('uploadSec').style.display = 'none';
                    document.getElementById('progress-section').style.display = 'block';

                    let progress = 0;
                    const percentText = document.getElementById('percentText');
                    const circleProgress = document.getElementById('circleProgress');
                    const statusDesc = document.getElementById('status-desc');

                    // محاكاة تصاعد العداد الدائري الاحترافي أثناء رندر السيرفر
                    const interval = setInterval(() => {
                        if (progress < 85) {
                            progress += Math.floor(Math.random() * 5) + 2;
                            percentText.innerText = progress + '%';
                            circleProgress.style.background = \`conic-gradient(#c084fc \${progress * 3.6}deg, #2b1b4d 0deg)\`;
                            
                            if (progress > 30 && progress < 60) {
                                statusDesc.innerText = 'جاري ضغط الفيديو بدقة HD و 60 FPS... ⚙️';
                            } else if (progress >= 60) {
                                statusDesc.innerText = 'جاري إعداد الملف المضاد للضغط من تيك توك... 🚀';
                            }
                        }
                    }, 300);

                    const formData = new FormData();
                    formData.append('video', fileInput.files[0]);

                    fetch('/api/process-video', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('فشل المعالجة');
                        return response.blob();
                    })
                    .then(blob => {
                        clearInterval(interval);
                        progress = 100;
                        percentText.innerText = '100%';
                        circleProgress.style.background = 'conic-gradient(#c084fc 360deg, #2b1b4d 0deg)';
                        statusDesc.innerText = 'تم الانتهاء بنجاح! جاري تحميل ملفك الخارق... ✅';

                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'NIGHTFALL_RENDERED_HD.mp4';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch(error => {
                        clearInterval(interval);
                        statusDesc.innerText = 'حدث خطأ أثناء المعالجة ❌';
                    });
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
        
        res.download(outputPath, 'NIGHTFALL_RENDERED_HD.mp4', (err) => {
            if (err) console.error(err);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] TikoPro Studio Clone running on port ${PORT}`);
});

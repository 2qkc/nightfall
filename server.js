const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// الواجهة المدمجة مباشرة مع السيرفر
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nightfall - معالج فيديوهات تيك توك</title>
            <style>
                body { font-family: Tahoma, sans-serif; background: #0f172a; color: #fff; text-align: center; padding: 50px; }
                .container { max-width: 500px; margin: auto; background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
                input[type="file"] { margin: 20px 0; padding: 10px; background: #334155; color: #fff; border: none; border-radius: 6px; width: 100%; cursor: pointer; }
                button { background: #3b82f6; color: white; border: none; padding: 12px 20px; font-size: 16px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; }
                button:hover { background: #2563eb; }
                #status { margin-top: 15px; color: #38bdf8; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>NIGHTFALL UPLOAD</h2>
                <p>ارفع الفيديو، ودعه يعالج بالمعايير المضادة للضغط من تيك توك</p>
                <input type="file" id="videoFile" accept="video/*">
                <br>
                <button onclick="uploadVideo()">معالجة وتحميل الفيديو</button>
                <div id="status"></div>
            </div>

            <script>
                async function uploadVideo() {
                    const fileInput = document.getElementById('videoFile');
                    const statusDiv = document.getElementById('status');
                    
                    if (fileInput.files.length === 0) {
                        alert('الرجاء اختيار فيديو أولاً!');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('video', fileInput.files[0]);

                    statusDiv.innerHTML = 'جاري معالجة الفيديو بالخلفية... انتظر قليلاً ⏳';

                    try {
                        const response = await fetch('/api/process-video', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) throw new Error('فشل المعالجة');

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'NIGHTFALL_PROTECTED.mp4';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();

                        statusDiv.innerHTML = 'تم الانتهاء وتحميل الفيديو بنجاح! ✅';
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
    const outputPath = path.join('uploads', `output_${Date.now()}.mp4`);

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
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] Nightfall running on port ${PORT}`);
});

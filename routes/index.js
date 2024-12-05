var express = require('express');
const fs = require('fs');
const path = require('path');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function readFile(){
  try {
    const data = await fs.promises.readFile("/Users/zhengdixin/mp4/keys.json", 'utf8');
    // console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error('无法读取文件:', error);
    throw error;
  }
}

// 提供扫描视频文件的接口
router.get('/videos', async (req, res) => {
  try {
    // const videos = await readFile(); // 异步读取 keys.json 文件
    // res.json({ code: 200, data: videos, message: 'success' }); // 返回视频文件列表
    res.json({ code: 200, data: [{"BV": "LOSER"},{"BV":"GOOD BOY"}], message: 'success' }); 
  } catch (err) {
    res.status(500).json({ code: 500, data: null, message: 'Internal Server Error' });
  }
});

// 提供视频流的接口
router.get('/videos/:bv', (req, res) => {
  // 获取项目根目录
  const rootDir = process.cwd();
  const videoPath = path.join(rootDir,'public/videos/', req.params.bv+'.mp4');
  console.log(videoPath);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;

    const chunksize = (end-start)+1;
    const file = fs.createReadStream(videoPath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// 提供扫描视频文件的接口
router.get('/audios', async (req, res) => {
  try {
    res.json({ code: 200, data: [{"BV": "伍佰 - 突然的自我 (Live)"},{"BV":"信乐团 - 离歌"},{"BV":"周华健 - 刀剑如梦"}], message: 'success' }); 
  } catch (err) {
    res.status(500).json({ code: 500, data: null, message: 'Internal Server Error' });
  }
});

router.get('/audios/:filename', (req, res) => {
  const rootDir = process.cwd();
  const audioPath = path.join(rootDir,'public/audios/', req.params.filename + '.mp3');
  
  try {
    const stat = fs.statSync(audioPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1;

      const chunksize = (end-start)+1;
      const file = fs.createReadStream(audioPath, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(audioPath).pipe(res);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('文件不存在:', error);
      res.status(404).json({ code: 404, data: null, message: 'File Not Found' });
    } else {
      console.error('处理音频流时发生错误:', error);
      res.status(500).json({ code: 500, data: null, message: 'Internal Server Error' });
    }
  }
});

module.exports = router;

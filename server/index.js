/** 
 * RESP协议视频无插件播放
 *  */
var express = require("express");
var expressWebSocket = require("express-ws");
var ffmpeg = require("fluent-ffmpeg");
var webSocketStream = require("websocket-stream/stream");
const fs = require('fs');
const path = require('path');
const ip = require('ip');
/** 
 * 这里的目录指向先前安装好的ffmpeg
 * 请提前下载好放到指定目录
 * https://zhuanlan.zhihu.com/p/638784951
 *  */
let ffmpegPath = path.join(__dirname,"ffmpeg/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
let port = 8888;
let ipAddress = ip.address();
/** 加载服务 */
function localServer() {
    let app = express();
    expressWebSocket(app, null, {
        perMessageDeflate: true,
    });
    app.ws("/rtsp/:id/", rtspRequestHandle);
    app.use('/public-f',express.static(path.join(__dirname,'public')));
    app.get('/', (req, res) => {
        res.send('视频服务！！');
    });
    app.listen(port, () => {
        console.log(`服务启动 http://127.0.0.1:${port}`);
        console.log(`服务启动 http://${ipAddress}:${port}`);
    });
}
/** 转换视频流 */
function rtspRequestHandle(ws, req) {
    console.log("开始转换视频流");
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000,
    }, {
        browserBufferTimeout: 1000000,
    });
    let url = decodeURIComponent(req.query.url);
    console.log("rtsp url:", url);
    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400") // 这里可以添加一些 RTSP 优化的参数
            .on("start", function () {
                console.log('开始', "Stream started.");
            })
            .on("codecData", function () {
                console.log('在线处理')// 摄像机在线处理
            })
            .on("error", function (err) {
                console.log('错误', err.message);
            })
            .on("end", function () {
                console.log('结束');// 摄像机断线的处理
            })
            .outputFormat("flv").videoCodec("copy").noAudio().pipe(stream);
    } catch (error) {
        console.log('未知错误',error);
    }
}
localServer();
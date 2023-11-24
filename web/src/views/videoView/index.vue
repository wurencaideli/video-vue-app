<script>
/** 
 * 视频播放
 *  */
import { 
    defineComponent,ref,getCurrentInstance,reactive,toRef, 
    computed,onMounted,onActivated,watch,
} from "vue";
import Hls from 'hls.js';
import flvjs from 'flv.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import videojsFlash from 'videojs-flash';
import videoJsSwf from 'videojs-swf/dist/video-js.swf?url';

export default defineComponent({
    name:'VideoView',
    components: {
    },
    setup(){
        const VideoRef_1 = ref(null);  //组件实例
        const VideoRef_2 = ref(null);  //组件实例
        const VideoRef_3 = ref(null);  //组件实例
        const VideoRef_4 = ref(null);  //组件实例
        const dataContainer = reactive({
            loading:false,
            // videoSrc:'',
            // videoSrc: "http://devimages.apple.com/iphone/samples/bipbop/gear1/prog_index.m3u8",
            // videoSrc: "/video-src-prox/iphone/samples/bipbop/gear1/prog_index.m3u8",
            videoSrc_1: "/video-src-prox/iphone/samples/bipbop/gear1/prog_index.m3u8",
            // videoSrc: "/video-src-prox/iphone/samples/bipbop/bipbopall.m3u8",
            // videoSrc: "rtmp://ns8.indexforce.com/home/mystream",
            // videoSrc: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
            // videoSrc: "https://sample-videos.com/video123/flv/720/big_buck_bunny_720p_1mb.flv",
            // videoSrc: "/video-src-prox-2/video123/flv/720/big_buck_bunny_720p_1mb.flv",
            // videoSrc: "rtmp://ns8.indexforce.com/home/mystream",
            videoSrc_2: "rtsp://rtspstream:7e30608c5af5a0cf8638b05cb70db075@zephyr.rtsp.stream/movie",
            videoSrc_3: "https://flvopen.ys7.com:9188/openlive/311f4aa5591c4e34a1dfbee346734bf9.flv",
            // videoSrc_4: "rtmp://ns8.indexforce.com/home/mystream",
            videoSrc_4: "rtmp://58.200.131.2:1935/livetv/hunantv",
        }); 
        /** 
         * 初始化视频播放
         * 播放m3u8格式视频，hls
         *  */
        function initData_1(){
            let videoSrc = dataContainer.videoSrc_1;
            if(!VideoRef_1.value) return;
            const videoPlayer = VideoRef_1.value;
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoSrc); // 替换为你的M3U8文件路径
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    videoPlayer.play(); // 开始播放视频
                });
            } else {
                // 不支持M3U8播放的浏览器，可以使用其他视频格式或提供备选方案
                alert('支持M3U8播放的浏览器，可以使用其他视频格式或提供备选方案');
            }
        }
        /** 
         * 播放rtsp 视频
         * 可前往 https://rtsp.stream/admin/dashboard 免费获取在线rtsp地址
         * 需要启动后台转换
         */
        function initData_2(){
            let videoSrc = dataContainer.videoSrc_2;
            if(!VideoRef_2.value) return;
            if(!flvjs.isSupported()) return;
            let videoPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                url: `ws://localhost:8888/rtsp/12/?url=${encodeURIComponent(videoSrc)}`,
            });
            try {
                videoPlayer.attachMediaElement(VideoRef_2.value);
                videoPlayer.load();
                videoPlayer.play().then(() => {
                    console.log(new Date().getTime());
                }).catch(error=>{
                    console.log('错误：',error);
                });
            } catch (error) {
                console.log('未知错误：',error);
            }
        }
        /** 播放flv视频 */
        function initData_3(){
            let videoSrc = dataContainer.videoSrc_3;
            if(!VideoRef_3.value) return;
            if(!flvjs.isSupported()) return;
            let videoPlayer = flvjs.createPlayer({
                type: 'flv',
                // isLive: true,
                url: videoSrc,
            })
            videoPlayer.attachMediaElement(VideoRef_3.value);
            videoPlayer.load();
            videoPlayer.play().then(() => {
                console.log(new Date().getTime());
            }).catch(error=>{
                console.log('错误：',error);
            });
        }
        /** 
         * 播放rtmp视频
         * rtmp需要依赖浏览器的Flash播放器支持，谷歌2023年后已经放弃
         * 不考虑，因为需要浏览器下载flash插件
         */
        function initData_4(){
            let videoSrc = dataContainer.videoSrc_4;
            if(!VideoRef_4.value) return;
            const videoJsOptions = {
                autoplay: true, // 自动播放
                language: 'zh-CN',
                preload: 'auto', // 自动加载
                errorDisplay: true, // 错误展示
                techOrder: ['flash'],
                notSupportedMessage: "你的浏览器不支持Flash播放",
                flash: {
                    swf: videoJsSwf,
                },
                sources: [
                    {
                        src: videoSrc,
                        type: 'rtmp/flv', // 类型可加可不加，目前未看到影响
                    },
                ],
            };
            const videoPlayer = videojs(VideoRef_4.value, videoJsOptions);
            videoPlayer.play();
        }
        /** 开始播放 */
        function handleShow(){
            initData_2();
        }
        return {
            dataContainer,
            VideoRef_1,
            handleShow,
            VideoRef_2,
            VideoRef_3,
            VideoRef_4,
            initData_2,
            initData_1,
            initData_3,
            initData_4,
        };
    },
});
</script>

<template>
    <div class="video-view">
        <div class="container">
            <input 
                v-model="dataContainer.videoSrc_1"
                type="text"/>
            <button
                @click="initData_1">
                开始播放M3U8视频
            </button>
            <video
                ref="VideoRef_1" 
                class="video-el">
            </video>
        </div>
        <div class="gap"></div>
        <div class="container">
            <input 
                v-model="dataContainer.videoSrc_2"
                type="text"/>
            <button
                @click="initData_2">
                开始播放rtsp视频
            </button>
            <video
                ref="VideoRef_2" 
                class="video-el">
            </video>
        </div>
        <div class="gap"></div>
        <div class="container">
            <input 
                v-model="dataContainer.videoSrc_3"
                type="text"/>
            <button
                @click="initData_3">
                开始播放flv视频
            </button>
            <video
                ref="VideoRef_3" 
                class="video-el">
            </video>
        </div>
        <div class="gap"></div>
        <div class="container">
            <input 
                v-model="dataContainer.videoSrc_4"
                type="text"/>
            <button
                @click="initData_4">
                开始播放rtmp视频
            </button>
            <video 
                ref="VideoRef_4" 
                class="video-el video-js vjs-default-skin vjs-big-play-centered"
                controls="false"
                muted>
                <source 
                    :src="dataContainer.videoSrc_4" type="rtmp/mp4">
            </video>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.video-view{
    width: 100%;
    height: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 0;
    >*{
        margin-bottom: 15px;
        &:last-child{
            margin: 0;
        }
    }
    >.container{
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        width: 600px;
        >*{
            margin-bottom: 15px;
            width: 100%;
            &:last-child{
                margin: 0;
            }
        }
        >input{
            padding: 15px;
            box-sizing: border-box;
            border: none;
            background-color: rgb(238, 238, 238);
            border-radius: 5px;
        }
        >button{
            padding: 10px 15px;
            box-sizing: border-box;
            border: none;
            background-color: rgb(238, 238, 238);
            border-radius: 5px;
            cursor: pointer;
        }
        >.video-el{
            width: 100%;
            height: 350px;
            border:1px solid rgb(221, 221, 221);
        }
    }
    >.gap{
        width: 100%;
        height: 1px;
        background-color: rgb(226, 226, 226);
    }
}
</style>

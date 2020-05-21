document.addEventListener('DOMContentLoaded',function(){
    function $(id){ return document.getElementById(id); }

    function Dv(){
        this.space = 6;
        this.width = Math.ceil(window.innerWidth/this.space);
        this.height = Math.ceil(window.innerHeight/this.space);
        this.data = {};
        this.cav = {};
        this.ctx = {};
        this.playing = false;
        this.init();
        this.scaleX = window.innerWidth/this.width;
        this.textCanvas = $('textCanvas');
        this.textCanvas.width = window.innerWidth;
        this.textCanvas.height = window.innerHeight;
        this.textCtx = this.textCanvas.getContext('2d');
    }

    Dv.prototype.init = function() {
        this.initVideo();
        this.initCanvas();
        this.cav.width = this.width;
        this.cav.height = this.height;
        this.initEvent();
    };

    Dv.prototype.initVideo = function(src) {
        if(!this.video){
            this.video = document.createElement('video');
        }
        if(src){
            this.video.src = src;
        }
    };

    Dv.prototype.initCanvas = function(video) {
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d');
    };

    Dv.prototype.loadData = function() {
        return this.ctx.getImageData(0,0,this.width,this.height);
    };

    Dv.prototype.reDraw = function(data) {
        for(var i=0,len=data.data.length;i<len;i+=4){
            var r = data.data[i],
                g = data.data[i+1],
                b = data.data[i+2];
            data.data[i] = data.data[i+1] = data.data[i+2] = 255-(r+g+b)/3 | 0;
        }
        this.data = data
        this.ctx.putImageData(data,0,0,0,0,this.width,this.height);

    };

    Dv.prototype.drawText = function() {
        this.textCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
        var data = this.data.data;
        var points =[' '].concat('`.",:;!^|*ITDXUHB%&#@NM'.split(''));
        for(var i=0,len=data.length;i<len;i+=4){
            this.textCtx.fillStyle = '#333';
            var xl = (i/4|0)%this.width;
            var yl = Math.ceil(i/4/this.width);
            var x = xl * this.space;
            var y = yl * this.space;
            var newData = data[i] | 0;
            var plen = Math.ceil(255/points.length);
            var point = points[newData/plen  | 0]
            this.textCtx.font="12px courier";
            this.textCtx.fillText(point,x,y);
        }
    };

    Dv.prototype.interval = function() {
        var that = this;
        requestAnimationFrame(function(){
            if(!that.video.paused){
                that.ctx.drawImage(that.video,0,0,that.width,that.height);
                var data = that.loadData();
                that.reDraw(data);
                that.drawText();
            }
            that.interval();				
        });
    };


    Dv.prototype.initEvent = function() {
        var that = this;
        $('file').onchange = function(){
            var filename = this.value;
            var index = filename.lastIndexOf(".");
            var ext = filename.substr(index+1);
            if(ext == "mp4"){
                that.initFile();
                $('info').style.display = 'none';
                $('ctrl').style.display = 'none';
            }else{
                alert("Chỉ hỗ trợ định dạng mp4");
            }
        }
        $('videoScreen').onclick = function(){
            if($('ctrl').style.display == 'none'){
                $('ctrl').style.display = 'block';
            }else{
                $('ctrl').style.display = 'none';
            }
        }
    };
    Dv.prototype.initFile = function() {
        var file = $('file').files[0];
        if(!file){
            alert("Vui lòng chọn tệp mp4");
            return false;
        }
        var reader = new FileReader();
        var buffer = [];
        var that = this;
        reader.onload = function(){
            var blob = new Blob([reader.result], { type: 'video/mp4'});
            that.playFile(reader.result,blob);
        }
        reader.readAsArrayBuffer(file);
    };
    Dv.prototype.playFile = function(arrayBuffer,blob) {
        var mediaSource = new MediaSource();
        src = URL.createObjectURL(blob);
        this.initVideo(src);
        this.interval();
        this.video.play();
    };

    var d = new Dv();

},false)
 
//Line: 64 - Try to do it once
(function(w,d,s) {
    var vis = d.querySelector('div#canvas_wrapper>div#visualiser'),
        cnvs = d.querySelectorAll('div#canvas_wrapper>div#visualiser>canvas'),
        seek = d.querySelector('div#seek'),
        seekedDur = d.querySelector('div#seek div#seekedDuration'),
        seekDur = d.querySelector('div#seek div#currentDuration'),
        xmlReq = new XMLHttpRequest(),

        Sdur = $.DOM(seekDur).CSS,
        Sseek = $.DOM(seek).CSS,
        SSseek = $.DOM(seekedDur).CSS,

        cntxt = [];
        function Visualiser(_src, code) {
            var audioCtxt = new (w.AudioContext || w.webkitAudioContext)(),
                gain = audioCtxt.createGain(),
                analyser = audioCtxt.createAnalyser(), 
                Timer = {
                    currentTime: 0,
                    playingTime: 0,
                    storedTime : 0,
                    reset: function() {
                        this.currentTime = this.playingTime = this.storedTime = 0;
                    }
                },
                isPlaying = hasLoaded = 0,
                volVal = 1,
                src , buffer, channelAnalyser = [audioCtxt.createAnalyser(), audioCtxt.createAnalyser()];

            switch(code) {
                case 'URL':
                xmlReq.open('GET', _src);
                xmlReq.responseType = 'arraybuffer';
                xmlReq.send();

                break;
                case 'sndcld':
                var id = '432f273d72df1e608640ba4c3c81112c',
                    findReq = new XMLHttpRequest(),
                    streamReq = new XMLHttpRequest();
                findReq.open('GET', 'http://api.soundcloud.com/resolve?url=' + _src + '&client_id=' + id);
                findReq.send();

                $.listener(findReq, 'load', function($e) {
                    parsedLoc = JSON.parse(findReq.response);
                    console.log(parsedLoc);
                    streamReq.open('GET', parsedLoc.stream_url + 's?client_id=' + id);
                    streamReq.send();
                });
                
                $.listener(streamReq, 'load', function($e) {
                    parsedURL = JSON.parse(streamReq.response);
                    Visualiser(parsedURL.http_mp3_128_url, 'URL');
                });
                break;
            };
            //functions
            function setTick() {

                setInterval(function() {
                    e = audioCtxt.currentTime;
                    if(hasLoaded) {
                        if (isPlaying) {
                            seekTo(Timer.playingTime + (e - Timer.storedTime));
                            Sdur.set('width', (Timer.currentTime * 100 / src.buffer.duration) + '%');
                        } else {
                            Timer.playingTime = Timer.currentTime;
                            Timer.storedTime = e;
                        }
                    }
                }, 16);
                //Request Animation frame here
                function Animation() {
                    var
                        Fcount = analyser.frequencyBinCount,
                        freqArray = new Uint8Array(Fcount),
                        LfreqArray = new Uint8Array(Fcount),
                        RfreqArray = new Uint8Array(Fcount);
                    function start($time) {
                        channelAnalyser[0].getByteFrequencyData(LfreqArray);
                        channelAnalyser[1].getByteFrequencyData(RfreqArray);

                        if(isPlaying) analyser.getByteFrequencyData(freqArray);
                        //If not playing then decrement the last frequency data allowing smooth animation
                        else {
                            for(var x = 0; x < Fcount; x++) {
                                val = freqArray[x] - 0.1;
                                if(val >= 0) {
                                    freqArray[x] = val;
                                }
                            }
                        }
                        //Clear anything on context
                        cntxt[2].clearRect(0, 0, innerWidth, innerHeight);
                        if((Math.round( $time / 1000 ) % 10) == 0)
                            cntxt[1].clearRect(0, 0, innerWidth, innerHeight);
                        
                        cntxt[0].clearRect(0, 0, innerWidth, innerHeight); 
                        //Visualiser content begins

                        var rwidth = (innerWidth / 2) ,
                            rheight = innerHeight / 2,
                            radius = 0.5 * Math.min(rheight, rwidth),
                            WIDTH = Math.PI * (radius) / Fcount;
                        
                        var scolor = [~~freqArray[~~(Fcount/ 8)] || 20, ~~freqArray[~~(2 * Fcount / 8)] || 20, ~~freqArray[~~(3 * Fcount / 8)] || 20]
                        //Draw for every Frequency data
                        //Context 0
                        cntxt[0].beginPath();
                        cntxt[0].moveTo(0, innerHeight * 0.5);
                        //Context 1
                        cntxt[1].beginPath();
                        //Context 2
                        cntxt[2].beginPath();
                        //General
                        cntxt[0].fillStyle = cntxt[0].strokeStyle = cntxt[1].strokeStyle = cntxt[2].strokeStyle = cntxt[1].fillStyle = 'rgb('+ scolor[0] + ',' + scolor[1] +',' + scolor[2]+ ')';

                        for(var x = 0, len = ~~(Fcount / 2); x < len; x++) {
                            freq = freqArray[x] * volVal;
                            //For Context 0
                            
                            //Sine wave test
                            X = (x / len) * innerWidth;
                            cntxt[0].lineTo(X, innerHeight * 0.5 - (freqArray[x] *volVal * 0.5 * Math.sin((X))));
                            //For Context 1
                            if(x >= ~~(Fcount / 4) && x <= ~~(Fcount / 2)) {
                                if(freq == 0) freq = Math.random() * radius * 0.5;
                                //Theta angle for Context 1
                                theta1 = (x / len) * 4 * Math.PI;
                                _r = (127 + radius * (freq / 127)) * 0.5;
                                cntxt[1].lineTo(rwidth + _r * Math.cos(theta1), rheight + _r * Math.sin(theta1));    
                            }
                        }
                        //Context 0
                        cntxt[0].stroke();
                        cntxt[0].fill();
                        cntxt[0].closePath();
                        //Context 1
                        cntxt[1].stroke();
                        cntxt[1].fill();
                        cntxt[1].closePath();
                        //Context 2
                        cntxt[2].stroke();
                        cntxt[2].closePath();                      
                        requestAnimationFrame(start);
                    }
                    start();
                }
                
                Animation();
            };
            function Ended() {
                //Timer.currentTime is always larger than exact duration
                if (Math.abs(Timer.currentTime - src.buffer.duration) < 1) {
                    Timer.reset();
                    togglePlay();
			    }
            };
            function resizeCanvas() {
                for(var x = 0, len = cnvs.length; x < len; x++) {
                    $cnvs = cnvs[x];
                    $.DOM($cnvs).Attr.set({
                        width:innerWidth,
                        height:innerHeight
                    });
                };
            };
            function disconnectSrc() {
                isPlaying = 0;
                src.stop();
                src.disconnect();
            };
            function connectSrc() {
                var ct,
                    AnalyserMergeNode = [audioCtxt.createChannelMerger(2), audioCtxt.createChannelMerger(2)];
                isPlaying = 1;
                src = audioCtxt.createBufferSource();
                splitterChannel = audioCtxt.createChannelSplitter(2);
                AnalyserSplitChannel = audioCtxt.createChannelSplitter(2);
                mergerNode = audioCtxt.createChannelMerger(2);
                gain.value = volVal;
                //Listener on each of new connections
                //Try to do this once
                $.listener(src, 'ended', Ended);
                src.buffer = buffer;
                ct = Timer.currentTime < src.buffer.duration ? Timer.currentTime : Timer.reset() || 0;
                //Connect or reconnect buffer source
                //From src => audiocontext destination
                src.connect(AnalyserSplitChannel);
                src.connect(gain);

                AnalyserSplitChannel.connect(AnalyserMergeNode[0], 1, 0);              
                AnalyserSplitChannel.connect(AnalyserMergeNode[1], 0, 1);
                
                AnalyserMergeNode[1].connect(channelAnalyser[1]);
                AnalyserMergeNode[0].connect(channelAnalyser[0]);
                
                gain.connect(analyser);
                analyser.connect(audioCtxt.destination);
                //channelAnalyser[0].connect(audioCtxt.destination);
                //channelAnalyser[1].connect(audioCtxt.destination);
                src.start(audioCtxt.currentTime, ct);
            };
            function togglePlay() {
                if(hasLoaded) {
                    if(isPlaying)
                        disconnectSrc();
                    else
                        connectSrc();                        
                }
            };
            function seekTo(time) {
                Timer.currentTime = time;
            }
            //listeners
            $.listener(vis, 'click', togglePlay);


            $.listener(seek, 'click', function(e) {
                var ratio = e.clientX / innerWidth, val = ratio * src.buffer.duration ;
                if (src && hasLoaded) {
                    if(isPlaying) {

                        SSseek.set('display','none');
                        togglePlay();

                        setTimeout(function() {
                            seekTo(val);
                            setTimeout(togglePlay, 100);
                        }, 50);
                    }
                    else {
                        SSseek.set({
                            display:'block',
                            width:ratio * 100 + '%'
                        });
                        seekTo(val);
                        
                    }
                    
                }
            })
            //Volume has some problem with it
            $.listener(w, ['keydown', 'load','resize'], [function($e) {
                var newVal;
                switch(String.fromCharCode($e.keyCode)) {
                    case 'P':
                    togglePlay();
                    break;
                    case 'W':
                    newVal = Math.round((volVal + 0.1) * 10) / 10;
                    if(newVal <= 1)
                        volVal  = newVal;
                    gain.gain.value = volVal;
                    break;
                    case 'S':
                    newVal = Math.round((volVal - 0.1) * 10) / 10;
                    if(newVal >= 0)
                        volVal  = newVal;
                    gain.gain.value = volVal;
                    break;
                }
            }, function() {
                resizeCanvas();
                for(var x = 0, len = cnvs.length; x < len; x++) 
                    cntxt.push(cnvs[x].getContext('2d'));
            }, resizeCanvas]);

            $.listener(xmlReq, ['progress', 'load'], [function($e) {
                Sseek.set('width', $e.loaded * 100 / $e.total + '%')
            },
            function(e) {
                audioCtxt.decodeAudioData(xmlReq.response, function($buffer) {
                    if(buffer = $buffer) {
                        hasLoaded = 1;
                        setTick();
                    }
                })
            }]);
        }
        //http://ccmixter.org/content/AlexBeroza/AlexBeroza_-_Emerge.mp3
        Visualiser('./sample/AudioAPI','URL')
})(window,document,screen);

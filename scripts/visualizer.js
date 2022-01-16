function fillCanvas(ctx, width, height) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, width, height);
}

function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createAudioContext() {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function createAudioAnalyser(context) {
    let analyser = context.createAnalyser();
    return analyser;
}

function createAudioSource(context, audioSource) {
    let src = context.createMediaElementSource(audioSource);
    return src;
}

function setFastFourierTransformSize(analyser, fftSize) {
    analyser.fftSize = fftSize;
}

window.onload = function() {
    const file = document.getElementById("file-input");
    const canvas = document.getElementById("canvas");
    const filename = document.getElementById("filename");
    const audio = document.getElementById("audio");

    file.onchange = function() {
        // set up canvas for displaying visualization
        initializeCanvas();
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const FFT = document.getElementById("fft-input").options[document.getElementById("fft-input").selectedIndex].value;
        const GRAPH = document.getElementById("graph-input").options[document.getElementById("graph-input").selectedIndex].value;

        let ctx = canvas.getContext("2d");
        let files = this.files; 
        audio.src = URL.createObjectURL(files[0]); 
    
        let name = files[0].name
        filename.innerText = `${name}` 
    
        let context = createAudioContext();
        let src = createAudioSource(context, audio);
        let analyser = createAudioAnalyser(context); // create an analyser for the audio context
    
        // connect AnalyserNode to audio source
        src.connect(analyser);
        analyser.connect(context.destination); 
    
        // set fftSize based on selection
        setFastFourierTransformSize(analyser, FFT);
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength); 
        let x;
    
        function draw() {
            fillCanvas(ctx, WIDTH, HEIGHT); // sets color for canvas

            let drawVisual = requestAnimationFrame(draw);
            x = 0;

            analyser.getByteTimeDomainData(dataArray);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            let sliceWidth = WIDTH * 1.0 / bufferLength;

            for(let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT/2;
        
                if(i === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();
        }

        // function draw() {
        //    let barWidth = (WIDTH / bufferLength) * 13;
        //    let barHeight;
        //     fillCanvas(ctx, WIDTH, HEIGHT); // sets color for canvas

        //     let drawVisual = requestAnimationFrame(draw);
        //     x = 0;
        //     analyser.getByteFrequencyData(dataArray); 

        //     let r, g, b;
        //     let bars = 118; 
        
        //     for (let i = 0; i < bars; i++) {
        //         barHeight = (dataArray[i] * 2.5);
        
        //         // color ranges for bars
        //         if(dataArray[i] > 200) { 
        //             r = 255
        //             g = 255
        //             b = 0
        //         } else if(dataArray[i] > 160) { 
        //             r = 255
        //             g = 254
        //             b = 159
        //         } else if(dataArray[i] > 120) {
        //             r = 253
        //             g = 156
        //             b = 253
        //         } else if(dataArray[i] > 80) { 
        //             r = 204
        //             g = 205
        //             b = 253
        //         } else if(dataArray[i] > 40) { 
        //             r = 157
        //             g = 255
        //             b = 254
        //         } else { 
        //             r = 255
        //             g = 255
        //             b = 255
        //         }
        
        //         ctx.fillStyle = `rgb(${r},${g},${b})`;
        //         ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);
    
        //         x += barWidth + 10 
        //     }
        // }
        audio.play();
        if(!audio.paused) {
            draw();
        }
      };
};
    
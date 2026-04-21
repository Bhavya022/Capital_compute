const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const status = document.getElementById('status');
const liveVideo = document.getElementById('liveVideo');
const recordedVideo = document.getElementById('recordedVideo');

let recorder;
let recordedChunks = [];
let captureStream;

function updateStatus(message, type = 'info') {
  status.textContent = message;
  status.style.color = type === 'error' ? '#f85149' : type === 'success' ? '#2ea043' : 'var(--muted)';
}

function setButtons({ recording, finished }) {
  startButton.disabled = recording;
  stopButton.disabled = !recording;
  downloadButton.disabled = !finished;
}

async function startRecording() {
  try {
    updateStatus('Requesting screen and microphone access…');

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    let audioStream = null;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (sessionError) {
      console.warn('Microphone access denied or unavailable.', sessionError);
    }

    if (audioStream) {
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      captureStream = combinedStream;
    } else {
      captureStream = screenStream;
    }

    liveVideo.srcObject = captureStream;
    liveVideo.play().catch(() => {});

    recordedChunks = [];
    recorder = new MediaRecorder(captureStream, { mimeType: 'video/webm; codecs=vp9' });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      recordedVideo.src = url;
      downloadButton.href = url;
      downloadButton.download = `mythical-recorder-${Date.now()}.webm`;
      setButtons({ recording: false, finished: true });
      updateStatus('Recording complete. Preview or download the result.', 'success');
    };

    recorder.start();
    setButtons({ recording: true, finished: false });
    updateStatus('Recording in progress. Use Stop when finished.');
  } catch (error) {
    console.error(error);
    updateStatus('Failed to start recording. Check permissions and browser support.', 'error');
  }
}

function stopRecording() {
  if (!recorder || recorder.state !== 'recording') {
    return;
  }

  recorder.stop();
  captureStream.getTracks().forEach((track) => track.stop());
  liveVideo.srcObject = null;
}

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

downloadButton.addEventListener('click', (event) => {
  if (downloadButton.disabled) {
    event.preventDefault();
  }
});

if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
  startButton.disabled = true;
  updateStatus('Screen capture not supported in this browser. Use Chrome, Edge, or Firefox.', 'error');
}

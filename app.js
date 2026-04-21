const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const copyLinkButton = document.getElementById('copyLinkButton');
const helpButton = document.getElementById('helpButton');
const settingsButton = document.getElementById('settingsButton');
const status = document.getElementById('status');
const liveVideo = document.getElementById('liveVideo');
const recordedVideo = document.getElementById('recordedVideo');
const timerDisplay = document.getElementById('timerDisplay');
const recordingIndicator = document.getElementById('recordingIndicator');
const qualitySelect = document.getElementById('qualitySelect');
const recordingHistory = document.getElementById('recordingHistory');
const emptyHistory = document.getElementById('emptyHistory');
const recordingInfo = document.getElementById('recordingInfo');
const fileSize = document.getElementById('fileSize');
const videoDuration = document.getElementById('videoDuration');
const helpModal = document.getElementById('helpModal');
const settingsModal = document.getElementById('settingsModal');
const closeHelpModal = document.getElementById('closeHelpModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const themeToggle = document.getElementById('themeToggle');
const defaultQuality = document.getElementById('defaultQuality');

let recorder;
let recordedChunks = [];
let captureStream;
let recordingStartTime = 0;
let timerInterval = null;
let currentRecordingBlob = null;
let currentRecordingDuration = 0;
let currentDownloadUrl = null;

const QUALITY_SETTINGS = {
  high: { mimeType: 'video/webm; codecs=vp9', bitrate: 5000000 },
  medium: { mimeType: 'video/webm; codecs=vp8', bitrate: 2500000 },
  low: { mimeType: 'video/webm', bitrate: 1000000 },
};

// Modal functions
function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

helpButton.addEventListener('click', () => openModal(helpModal));
settingsButton.addEventListener('click', () => openModal(settingsModal));
closeHelpModal.addEventListener('click', () => closeModal(helpModal));
closeSettingsModal.addEventListener('click', () => closeModal(settingsModal));

helpModal.addEventListener('click', (e) => {
  if (e.target === helpModal) closeModal(helpModal);
});

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeModal(settingsModal);
});

// Theme toggle
function initializeTheme() {
  const isDark = localStorage.getItem('mythicalTheme') !== 'light';
  themeToggle.checked = isDark;
  applyTheme(isDark);
}

function applyTheme(isDark) {
  if (isDark) {
    document.body.style.colorScheme = 'dark';
  } else {
    document.body.style.colorScheme = 'light';
  }
  localStorage.setItem('mythicalTheme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('change', () => {
  applyTheme(themeToggle.checked);
});

function updateStatus(message, type = 'info') {
  status.textContent = message;
  status.style.color = type === 'error' ? '#f85149' : type === 'success' ? '#2ea043' : 'var(--muted)';
}

function setButtons({ recording, finished }) {
  startButton.disabled = recording;
  stopButton.disabled = !recording;
  downloadButton.disabled = !finished;
  copyLinkButton.disabled = !finished;
  qualitySelect.disabled = recording;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function startTimer() {
  recordingStartTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    timerDisplay.textContent = formatTime(elapsed);
    currentRecordingDuration = elapsed;
  }, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function showRecordingIndicator(show) {
  if (show) {
    recordingIndicator.classList.remove('hidden');
  } else {
    recordingIndicator.classList.add('hidden');
  }
}

function downloadRecordingFile() {
  if (!currentDownloadUrl) return;
  const a = document.createElement('a');
  a.href = currentDownloadUrl;
  a.download = `mythical-recorder-${Date.now()}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  updateStatus('Recording downloaded!', 'success');
}

function copyToClipboard() {
  if (!currentDownloadUrl) return;
  navigator.clipboard.writeText(currentDownloadUrl).then(() => {
    updateStatus('Download link copied to clipboard!', 'success');
  });
}

downloadButton.addEventListener('click', downloadRecordingFile);
copyLinkButton.addEventListener('click', copyToClipboard);

function saveToHistory(blob, duration) {
  const timestamp = new Date().toLocaleString();
  const fileName = `mythical-recorder-${Date.now()}.webm`;
  const url = URL.createObjectURL(blob);
  const size = (blob.size / 1024 / 1024).toFixed(2);

  const history = JSON.parse(localStorage.getItem('mythicalHistory') || '[]');
  history.unshift({
    id: Date.now(),
    fileName,
    url,
    timestamp,
    duration,
    size,
  });

  localStorage.setItem('mythicalHistory', JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('mythicalHistory') || '[]');

  if (history.length === 0) {
    recordingHistory.innerHTML = '<p id="emptyHistory">No recordings yet. Start recording to see them here.</p>';
    return;
  }

  emptyHistory.style.display = 'none';
  recordingHistory.innerHTML = history
    .map(
      (item) => `
    <div class="recording-item">
      <div class="recording-item-info">
        <div class="recording-item-title">${item.fileName}</div>
        <div class="recording-item-meta">${formatTime(item.duration)} • ${item.size} MB • ${item.timestamp}</div>
      </div>
      <div class="recording-item-actions">
        <button class="play-btn" onclick="window.playRecording('${item.id}')">Play</button>
        <button class="download-btn" onclick="window.downloadRecording('${item.id}')">Download</button>
        <button class="delete-btn" onclick="window.deleteRecording('${item.id}')">Delete</button>
      </div>
    </div>
  `
    )
    .join('');
}

window.playRecording = (id) => {
  const history = JSON.parse(localStorage.getItem('mythicalHistory') || '[]');
  const item = history.find((r) => r.id == id);
  if (item) {
    recordedVideo.src = item.url;
    recordedVideo.play();
  }
};

window.downloadRecording = (id) => {
  const history = JSON.parse(localStorage.getItem('mythicalHistory') || '[]');
  const item = history.find((r) => r.id == id);
  if (item) {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.fileName;
    a.click();
  }
};

window.deleteRecording = (id) => {
  let history = JSON.parse(localStorage.getItem('mythicalHistory') || '[]');
  history = history.filter((r) => r.id !== id);
  localStorage.setItem('mythicalHistory', JSON.stringify(history));
  renderHistory();
};

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
    const quality = qualitySelect.value || 'medium';
    const qualityConfig = QUALITY_SETTINGS[quality];

    recorder = new MediaRecorder(captureStream, {
      mimeType: qualityConfig.mimeType,
      videoBitsPerSecond: qualityConfig.bitrate,
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      currentRecordingBlob = blob;
      currentDownloadUrl = URL.createObjectURL(blob);
      recordedVideo.src = currentDownloadUrl;

      fileSize.textContent = `Size: ${formatFileSize(blob.size)}`;
      videoDuration.textContent = `Duration: ${formatTime(currentRecordingDuration)}`;
      recordingInfo.style.display = 'block';

      saveToHistory(blob, currentRecordingDuration);

      setButtons({ recording: false, finished: true });
      updateStatus('Recording complete. Download or view in history.', 'success');
      stopTimer();
      timerDisplay.textContent = '00:00';
      showRecordingIndicator(false);
    };

    recorder.start();
    setButtons({ recording: true, finished: false });
    updateStatus('Recording in progress. Press Space or click Stop when finished.');
    recordingInfo.style.display = 'none';
    startTimer();
    showRecordingIndicator(true);
  } catch (error) {
    console.error(error);
    updateStatus('Failed to start recording. Check permissions and browser support.', 'error');
    showRecordingIndicator(false);
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

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    if (!startButton.disabled) {
      startRecording();
    } else if (!stopButton.disabled) {
      stopRecording();
    }
  }

  if (event.code === 'KeyQ') {
    event.preventDefault();
    if (!qualitySelect.disabled) {
      const options = Array.from(qualitySelect.options).map((o) => o.value);
      const currentIndex = options.indexOf(qualitySelect.value);
      qualitySelect.value = options[(currentIndex + 1) % options.length];
      updateStatus(`Quality changed to: ${qualitySelect.value}`, 'success');
    }
  }
});

if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
  startButton.disabled = true;
  updateStatus('Screen capture not supported in this browser. Use Chrome, Edge, or Firefox.', 'error');
} else {
  renderHistory();
  initializeTheme();
}

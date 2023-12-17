import { useCallback, useMemo, useState } from "react"
import useConfig from "@/hooks/useConfig"
import styles from './style.module.css'

export const metadata = {
  title: 'Basic Usage',
  route: 'basic',
}

// 👋 Hi! Here is a basic usage of whisper-live:
// ----

// 0️⃣ Install and import the package
import WhisperLive from "whisper-live"

export default function Basic() {
  const { apiKey } = useConfig().config
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const {start, stop} = useMemo(() => {
    // 1️⃣ Instantiate the WhisperLive class
    const whisper = new WhisperLive({ openAiKey: apiKey })
  
    // 2️⃣ Catch the transcriptions
    whisper.onTranscript = (text) => {
      setTranscription(text)
    }

    // 3️⃣ Use startRecording and stopRecording to control over transcription
    return {
      start: whisper.startRecording,
      stop: whisper.stopRecording,
    }
  }, [apiKey]);

  const toggle = useCallback(() => {
    !recording ? start() : stop();
    setRecording(!recording);
  }, [start, stop, recording]);

  return (
    <div>
      <h1 className={styles.transcription}>{transcription || '[Transcription will go here]'}</h1>
      <div className={styles.actions}>
        <button onClick={toggle}>{!recording ? 'Start' : 'Stop'}</button>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react';

const PlayAudio = ({ audioStream }: { audioStream: ReadableStream }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const streamToBlob = async (stream: ReadableStream): Promise<Blob> => {
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          chunks.push(value);
        }
        done = readerDone;
      }

      return new Blob(chunks, { type: 'audio/mp3' });
    };

    const handleStream = async () => {
      if (audioStream) {
        const blob = await streamToBlob(audioStream);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    };

    handleStream();

    // Cleanup
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioStream]);

  return (
    <div>
      {audioUrl ? (
        <audio controls>
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default PlayAudio;

'use client';

import React, { useEffect, useState } from 'react';
import AnimatedButton from '@/components/AnimatedButton';
import EllipsisLoader from '@/components/EllipsisLoader';
import Select from '@/components/Select';
import TextInput from '@/components/TextInput';
import { ASR_MODEL_STORAGE_KEY, FLASK_API_URL } from '@/constants';
import { modelOptions } from './constants';
import { AsrModel } from '@/types';

const Youtube = () => {
  const [selectedModel, setSelectedModel] = useState<AsrModel>(
    'facebook/wav2vec2-base-960h'
  );
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // model 값 불러오기
  useEffect(() => {
    const savedModel = localStorage.getItem(ASR_MODEL_STORAGE_KEY);
    if (typeof savedModel === 'string') {
      setSelectedModel(savedModel as AsrModel);
    }
  }, []);

  const fetchTextFromYoutube = async () => {
    setIsLoading(true);
    setIsError(false);
    setText('');
    setStartTime(Date.now());

    try {
      const response = await fetch(`${FLASK_API_URL}/youtube-to-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: youtubeUrl,
          model: selectedModel,
          returnTimestamps:
            selectedModel === 'facebook/wav2vec2-base-960h' ? 'char' : true,
        }),
      });

      const data = await response.json();

      setText(data?.original_text);
      setSummary(data?.summary);
      setDuration((Date.now() - (startTime || 0)) / 1000);
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (selectedModel: string) => {
    localStorage.setItem(ASR_MODEL_STORAGE_KEY, selectedModel);
    setSelectedModel(selectedModel as AsrModel);
  };

  return (
    <div className="flex flex-col">
      <header className="flex justify-center gap-2 p-2 flex-wrap border-b">
        <Select
          value={selectedModel}
          options={modelOptions}
          onChange={handleModelChange}
          fullWidth
          maxWidth={300}
        />
        <TextInput
          placeholder="https://www.youtube.com/watch?v=example"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          fullWidth
          maxWidth={500}
          autoFocus
        />
        <AnimatedButton size="small" onClick={fetchTextFromYoutube}>
          Transcribe
        </AnimatedButton>
      </header>
      {isLoading ? (
        <div className="mx-auto">
          <EllipsisLoader />
        </div>
      ) : isError ? (
        <p className="p-2 text-red-500">에러가 발생했습니다.</p>
      ) : text ? (
        <div className="flex flex-col gap-2 p-2">
          <div className="flex justify-between gap-2">
            <h2 className="font-bold">요약</h2>
            {duration !== null && <p>걸린 시간: {duration.toFixed(2)}초</p>}
          </div>
          <p>{summary}</p>
          <h2 className="font-bold">내용</h2>
          <p>{text}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Youtube;

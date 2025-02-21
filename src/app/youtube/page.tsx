'use client';

import AnimatedButton from '@/components/AnimatedButton';
import EllipsisLoader from '@/components/EllipsisLoader';
import Select from '@/components/Select';
import TextInput from '@/components/TextInput';
import { ASR_MODEL_STORAGE_KEY, FLASK_API_URL } from '@/constants';
import React, { useEffect, useState } from 'react';
import { modelOptions } from './constants';
import { AsrModel } from '@/types';

const Youtube = () => {
  const [selectedModel, setSelectedModel] = useState<AsrModel>(
    'openai/whisper-tiny'
  );
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [text, setText] = useState('');

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

    try {
      const response = await fetch(`${FLASK_API_URL}/youtube-to-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl, model: selectedModel }),
      });

      const data = await response.json();
      setText(data?.text);
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
        <p className="p-2">{text}</p>
      ) : null}
    </div>
  );
};

export default Youtube;

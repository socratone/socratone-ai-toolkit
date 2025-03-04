'use client';

import AnimatedButton from '@/components/AnimatedButton';
import Header from '@/components/Header';
import { FLASK_API_URL } from '@/constants';
import { useRef, useState } from 'react';

const ImagePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${FLASK_API_URL}/ocr`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setText(data.text);
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Failed to upload file', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Header isHome />
      <div className="p-2">
        <div className="flex gap-2 justify-center items-center">
          {isLoading ? <p>Loading...</p> : file ? <p>{file.name}</p> : null}
          <AnimatedButton onClick={handleButtonClick} size="small">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            한국어가 포함된 이미지 파일을 선택해주세요
          </AnimatedButton>
        </div>
        <p className="whitespace-pre-line">{text}</p>
      </div>
    </>
  );
};

export default ImagePage;

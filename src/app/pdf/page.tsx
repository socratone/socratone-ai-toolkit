'use client';

import { useRef, useState } from 'react';
import AnimatedButton from '../../components/AnimatedButton/AnimatedButton';

const Pdf = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // TODO: api 수정 필요
      const response = await fetch('/api/text-from-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Failed to upload file', error);
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
      <div className="flex gap-2 justify-end items-center p-2">
        {file ? <p>{file.name}</p> : null}
        <AnimatedButton onClick={handleButtonClick} size="small">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          파일을 선택해주세요
        </AnimatedButton>
      </div>
    </>
  );
};

export default Pdf;

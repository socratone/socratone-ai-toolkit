import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

// POST 메서드로 PDF 파일을 받아 텍스트를 추출하는 API
export async function POST(req: NextRequest) {
  try {
    // 요청에서 PDF 파일을 추출
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: '파일을 업로드 해주세요.' },
        { status: 400 }
      );
    }

    // Blob을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF에서 텍스트 추출
    const data = await pdfParse(buffer);
    const text = data.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error('PDF 처리 중 오류 발생:', error);
    return NextResponse.json(
      { error: 'PDF 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

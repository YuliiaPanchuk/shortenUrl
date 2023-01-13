import React, { useEffect, useRef } from 'react';
import QR from 'qrcode';

interface QrCodeProps {
  text: string;
}

export function QrCode({ text }: QrCodeProps) {
  const canvas = useRef(null);

  useEffect(() => {
    if (canvas.current) {
      // CHECK IT
      QR.toCanvas(canvas.current, text || 'It works ', (error) => {
        if (error) console.error(error);
        console.log('success!');
      });
    }
  }, [canvas, text]);

  return <canvas ref={canvas} />;
}

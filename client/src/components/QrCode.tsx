import React, { useEffect, useRef } from 'react';
import QR from 'qrcode';

interface QrCodeProps {
  text: string;
}

export function QrCode({ text }: QrCodeProps) {
  const canvas = useRef(null);

  useEffect(() => {
    if (canvas.current) {
      QR.toCanvas(canvas.current, text || 'It works ', {
        width: 80,
        color: {
          dark: '#00758d',
          light: '#ffffff54',
        },
      });
    }
  }, [canvas, text]);

  return <canvas ref={canvas} />;
}

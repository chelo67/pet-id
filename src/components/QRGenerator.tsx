import React from 'react';
import { X, Download, Share, QrCode } from 'lucide-react';

interface QRGeneratorProps {
  qrCode: string;
  petId: string | null;
  onClose: () => void;
}

export default function QRGenerator({ qrCode, petId, onClose }: QRGeneratorProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `pet-qr-${petId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const petUrl = `${window.location.protocol}//${window.location.host}/pet/${petId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi mascota en PetID',
          text: 'Aquí está la información de mi mascota',
          url: petUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy to clipboard when native share fails
        navigator.clipboard.writeText(petUrl);
        alert('Enlace copiado al portapapeles');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(petUrl);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-6 h-6 text-amber-500 mr-2" />
            Código QR Generado
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="text-center">
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>

          <p className="text-gray-600 mb-6">
            ¡Perfecto! Tu mascota ya tiene su código QR único. 
            Cualquier persona que escanee este código podrá ver la información de tu mascota.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Share className="w-5 h-5 mr-2" />
              Compartir
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Enlace directo: {window.location.origin}/pet/{petId}
          </p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Pet } from '../lib/types';
import { Camera, User, Phone, Mail, Heart, Info } from 'lucide-react';

interface PetFormProps {
  petData: Pet;
  onChange: (data: Partial<Pet>) => void;
  onImageChange: (file: File) => void;
}

export default function PetForm({ petData, onChange, onImageChange }: PetFormProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Heart className="w-6 h-6 text-amber-500 mr-2" />
        Información de la Mascota
      </h2>

      <div className="space-y-6">
        {/* Foto de la mascota */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de la mascota
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {petData.image_url ? (
                <img 
                  src={petData.image_url} 
                  alt="Pet" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                null
              )}
              <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${petData.image_url ? 'hidden' : ''}`}>
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Subir foto
              </label>
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={petData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Nombre de la mascota"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raza
            </label>
            <input
              type="text"
              value={petData.breed}
              onChange={(e) => onChange({ breed: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ej: Labrador"
            />
          </div>
        </div>

        {/* Personalidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personalidad
          </label>
          <input
            type="text"
            value={petData.personality}
            onChange={(e) => onChange({ personality: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ej: Muy amigable, juguetón"
          />
        </div>

        {/* Acerca de */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1" />
            Acerca de mi mascota
          </label>
          <textarea
            value={petData.about}
            onChange={(e) => onChange({ about: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            placeholder="Cuéntanos más sobre tu mascota..."
          />
        </div>

        {/* Información del dueño */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 text-amber-500 mr-2" />
            Información del Dueño
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={petData.owner_name}
                onChange={(e) => onChange({ owner_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={petData.owner_phone}
                  onChange={(e) => onChange({ owner_phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={petData.owner_email}
                  onChange={(e) => onChange({ owner_email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
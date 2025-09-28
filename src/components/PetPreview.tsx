import React from 'react';
import { Pet } from '../lib/types';
import { User, Phone, Mail, Plus } from 'lucide-react';

interface PetPreviewProps {
  petData: Pet;
}

export default function PetPreview({ petData }: PetPreviewProps) {
  return (
    <div className="sticky top-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
      
      {/* Phone mockup */}
      <div className="mx-auto w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 rounded-[2.5rem] relative overflow-hidden">
          {/* Bone pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
          
          {/* Content */}
          <div className="relative z-20 p-6 pt-10 h-full">
            {/* Pet Image */}
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
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
                <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${petData.image_url ? 'hidden' : ''}`}>
                    <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Pet Name */}
            <h1 className="text-2xl font-bold text-amber-900 text-center mb-1">
              {petData.name || 'Pet Name'}
            </h1>
            
            {/* Breed */}
            <p className="text-amber-800 text-center font-medium mb-1">
              {petData.breed || 'Breed'}
            </p>
            
            {/* Personality */}
            <p className="text-amber-700 text-center text-sm mb-6">
              {petData.personality || 'Very friendly'}
            </p>
            
            {/* About Me Section */}
            <div className="bg-white/90 rounded-2xl p-4 mb-4 shadow-sm">
              <h3 className="text-amber-900 font-semibold text-lg mb-2">About Me</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {petData.about || 'I am so cute...'}
              </p>
            </div>
            
            {/* Owner Info */}
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-amber-900 font-semibold">Owner Info</span>
              </div>
              
              <div className="space-y-2">
                {petData.owner_name && (
                  <div className="flex items-center text-amber-800 text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {petData.owner_name}
                  </div>
                )}
                {petData.owner_phone && (
                  <div className="flex items-center text-amber-800 text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {petData.owner_phone}
                  </div>
                )}
                {petData.owner_email && (
                  <div className="flex items-center text-amber-800 text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {petData.owner_email}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-3">
              <button className="bg-amber-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Add to Contact
              </button>
              <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <Plus className="w-5 h-5 text-amber-900" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
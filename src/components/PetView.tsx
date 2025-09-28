import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pet } from '../lib/types';
import { supabase } from '../lib/supabase';
import { User, Phone, Mail, Plus, Heart } from 'lucide-react';

export default function PetView() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPet(data);
      } catch (error) {
        console.error('Error fetching pet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleCall = () => {
    if (pet?.owner_phone) {
      window.location.href = `tel:${pet.owner_phone}`;
    }
  };

  const handleEmail = () => {
    if (pet?.owner_email) {
      window.location.href = `mailto:${pet.owner_email}`;
    }
  };

  const handleAddContact = () => {
    if (!pet) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${pet.owner_name} (Dueño de ${pet.name})
TEL:${pet.owner_phone}
EMAIL:${pet.owner_email}
NOTE:Dueño de ${pet.name} - ${pet.breed}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pet.name}-owner.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 flex items-center justify-center">
        <div className="text-white text-xl">Mascota no encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 relative overflow-hidden">
      {/* Bone pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z' fill='%23000000'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto p-6 min-h-screen">
        {/* Pet Image */}
        <div className="flex justify-center mb-6 mt-8">
          <div className="w-40 h-40 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
            {pet.image_url ? (
              <img 
                src={pet.image_url} 
                alt={pet.name} 
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
            <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${pet.image_url ? 'hidden' : ''}`}>
                <User className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Pet Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            {pet.name}
          </h1>
          <p className="text-amber-800 text-lg font-medium mb-2">
            {pet.breed}
          </p>
          <p className="text-amber-700 text-base">
            {pet.personality}
          </p>
        </div>

        {/* About Section */}
        {pet.about && (
          <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-lg">
            <h2 className="text-amber-900 font-bold text-xl mb-3 flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {pet.about}
            </p>
          </div>
        )}

        {/* Owner Info */}
        <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-amber-900 rounded-xl flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-amber-900 font-bold text-xl">Owner Info</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-amber-800">
              <User className="w-5 h-5 mr-3" />
              <span className="font-medium">{pet.owner_name}</span>
            </div>
            
            {pet.owner_phone && (
              <button
                onClick={handleCall}
                className="flex items-center text-amber-800 hover:text-amber-900 transition-colors w-full text-left"
              >
                <Phone className="w-5 h-5 mr-3" />
                <span className="font-medium">{pet.owner_phone}</span>
              </button>
            )}
            
            {pet.owner_email && (
              <button
                onClick={handleEmail}
                className="flex items-center text-amber-800 hover:text-amber-900 transition-colors w-full text-left"
              >
                <Mail className="w-5 h-5 mr-3" />
                <span className="font-medium">{pet.owner_email}</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleAddContact}
            className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-colors"
          >
            Add to Contact
          </button>
          <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors">
            <Plus className="w-6 h-6 text-amber-900" />
          </button>
        </div>

        {/* Found Pet Message */}
        <div className="bg-green-100 border border-green-300 rounded-2xl p-4 mt-6">
          <p className="text-green-800 text-center font-medium">
            💜 ¡Has encontrado a {pet.name}! Contacta al dueño para reunirlos.
          </p>
        </div>
      </div>
    </div>
  );
}
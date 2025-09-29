import React, { useState, useEffect } from 'react';
import { Pet } from '../lib/types';
import { supabase } from '../lib/supabase';
import PetForm from './PetForm';
import PetPreview from './PetPreview';
import QRGenerator from './QRGenerator';
import { LogOut, Save, QrCode } from 'lucide-react';
import * as QR from 'qrcode';

export default function Dashboard() {
  const [petData, setPetData] = useState<Pet>({
    name: '',
    breed: '',
    personality: '',
    about: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    image_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [savedPetId, setSavedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id) // Filtra por usuario
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pets:', error);
      } else {
        setPets(data || []);
      }
    };
    fetchPets();
  }, [savedPetId]); // Se actualiza cuando guardas una nueva mascota

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Create a local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      setPetData(prev => ({ ...prev, image_url: localUrl }));

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `pet-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('pets').getPublicUrl(filePath);
      
      // Clean up the local URL and use the uploaded URL
      URL.revokeObjectURL(localUrl);
      setPetData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      // Keep the local preview if upload fails
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const petRecord = {
        ...petData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('pets')
        .insert(petRecord)
        .select()
        .single();

      if (error) throw error;

      // Generate QR code
      const petUrl = `${window.location.protocol}//${window.location.host}/pet/${data.id}`;
      const qrDataUrl = await QR.toDataURL(petUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 256,
      });

      // Update pet record with QR code
      await supabase
        .from('pets')
        .update({ qr_code: qrDataUrl })
        .eq('id', data.id);

      setSavedPetId(data.id);
      setQrCodeUrl(qrDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Error al guardar la mascota');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = petData.name && petData.breed && petData.owner_name && petData.owner_phone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">PetID Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="space-y-6">
            <PetForm
              petData={petData}
              onChange={(data) => setPetData(prev => ({ ...prev, ...data }))}
              onImageChange={handleImageUpload}
            />
            
            {/* Save Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={handleSave}
                disabled={!isFormValid || loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Guardando...' : 'Guardar y Generar QR'}
              </button>
              {!isFormValid && (
                <p className="text-sm text-gray-600 mt-2">
                  Completa los campos obligatorios: nombre, raza, nombre del dueño y teléfono
                </p>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div>
            <PetPreview petData={petData} />
            {/* Lista de mascotas guardadas */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Mis mascotas guardadas</h2>
              {pets.length === 0 ? (
                <p className="text-gray-600">No tienes mascotas guardadas.</p>
              ) : (
                pets.map(pet => (
                  <PetPreview key={pet.id} petData={pet} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <QRGenerator
          qrCode={qrCodeUrl}
          petId={savedPetId}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
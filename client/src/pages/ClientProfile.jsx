import React, { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, Camera, FileText, Pencil, Save, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import mexicanStates from '../data/mexicanStates';

/**
 * Componente ClientProfile (Perfil de Cliente).
 * 
 * Este componente representa el panel de administración personal para usuarios con rol de "cliente".
 * Permite visualizar información del usuario autenticado, como datos personales, direcciones
 * y métodos de pago (simulados en la base de datos o manejados por el estado local).
 * 
 * Funcionalidades clave para fines pedagógicos:
 * 1. Consumo del estado global de autenticación (`useAuth`) para mostrar información en tiempo real del usuario.
 * 2. Manejo de estado local (`activeSection`) para renderizado dinámico de pestañas sin cambiar de ruta.
 * 3. Integración de la función `logout` para cierre seguro de sesión y redirección.
 */
import { apiFetch } from '../services/api';

function ClientProfile() {
  const { user, logout, refreshSession } = useAuth(); // Consume datos y acción de cierre de sesión
  const [activeSection, setActiveSection] = useState('personal'); // Pestaña de perfil activa: personal, address, payment
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Estados para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    municipio: user?.municipio || '',
    barrio: user?.barrio || ''
  });

  // Estados para edición de dirección
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [addressForm, setAddressForm] = useState({
    label: 'Casa',
    estado: '',
    municipio: '',
    barrio: ''
  });

  // Estado para lista de direcciones guardadas
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await apiFetch('/api/auth/addresses');
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'address') {
      fetchAddresses();
    }
  }, [activeSection]);

  const handleStartEditing = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || '',
      municipio: user?.municipio || '',
      barrio: user?.barrio || ''
    });
    setEditError('');
    setEditSuccess('');
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setEditError('');
    setEditSuccess('');
    try {
      await apiFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      await refreshSession();
      setEditSuccess('Datos actualizados correctamente');
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Error al actualizar los datos');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      await apiFetch('/api/auth/avatar', {
        method: 'PUT',
        body: formData
      });
      
      await refreshSession(); // Refresca el usuario en el contexto
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen: " + (err.message || err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await apiFetch('/api/auth/avatar', {
        method: 'DELETE'
      });
      await refreshSession();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la imagen: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Menú Lateral */}
        <div className="w-full md:w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-100 self-start">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-gray-300">
              {user?.profile_picture ? (
                <img src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="font-serif font-bold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">Perfil {user?.role}</p>
          </div>
          <div className="space-y-2">
            <button onClick={() => setActiveSection('personal')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'personal' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Datos Personales</button>
            <button onClick={() => setActiveSection('address')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'address' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Direcciones</button>
            <button onClick={() => setActiveSection('payment')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'payment' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Métodos de Pago</button>
            <button onClick={() => setActiveSection('billing')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'billing' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Facturación</button>
            <button onClick={logout} className="w-full text-left px-4 py-2 mt-8 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Cerrar Sesión</button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {activeSection === 'personal' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2"><User className="w-6 h-6 text-barro" /> Datos Personales</h2>
                {!isEditing && (
                  <button 
                    onClick={handleStartEditing}
                    className="flex items-center gap-2 bg-barro text-white px-4 py-2 rounded-lg font-medium hover:bg-cochinilla transition-colors text-sm shadow-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Modificar Datos
                  </button>
                )}
              </div>
              <p className="text-gray-500 mb-6">Aquí puedes actualizar tu foto de perfil y tu información básica.</p>
              
              {/* Mensajes de feedback */}
              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                  {editSuccess}
                </div>
              )}

              {/* Formulario mock - Subida de Avatar Real */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300 overflow-hidden relative group">
                  {user?.profile_picture ? (
                    <img src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-barro border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 cursor-pointer text-center">
                    {uploadingAvatar ? "Subiendo..." : "Cambiar Foto"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                  </label>
                  {user?.profile_picture && (
                    <button 
                      onClick={handleDeleteAvatar} 
                      className="text-red-500 text-xs font-semibold hover:text-red-700 transition-colors"
                      disabled={uploadingAvatar}
                    >
                      Eliminar Foto
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                /* === MODO EDICIÓN === */
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Edad</label>
                      <input 
                        type="number" 
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        placeholder="Ej: 25"
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Rol de Cuenta</label>
                      <input type="text" readOnly value={user?.role} className="px-4 py-2.5 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg w-full outline-none capitalize cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Municipio</label>
                      <input 
                        type="text" 
                        value={editForm.municipio}
                        onChange={(e) => setEditForm({...editForm, municipio: e.target.value})}
                        placeholder="Ej: Oaxaca de Juárez"
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Barrio</label>
                      <input 
                        type="text" 
                        value={editForm.barrio}
                        onChange={(e) => setEditForm({...editForm, barrio: e.target.value})}
                        placeholder="Ej: Centro"
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-barro text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cochinilla transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button 
                      onClick={handleCancelEditing}
                      disabled={saving}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                /* === MODO LECTURA === */
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Nombre Completo</label>
                    <input type="text" readOnly defaultValue={user?.name} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Correo Electrónico</label>
                    <input type="email" readOnly defaultValue={user?.email} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Edad</label>
                    <input type="text" readOnly defaultValue={user?.age ? `${user.age} años` : "No especificada"} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Rol de Cuenta</label>
                    <input type="text" readOnly defaultValue={user?.role} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none capitalize" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Municipio</label>
                    <input type="text" readOnly defaultValue={user?.municipio || "No especificado"} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Barrio</label>
                    <input type="text" readOnly defaultValue={user?.barrio || "No especificado"} className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg w-full outline-none" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'address' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-barro" /> Mis Direcciones</h2>
              
              {/* Dirección de registro (del perfil de usuario) */}
              {(user?.estado || user?.municipio || user?.barrio) && (
                <div className="border border-gray-200 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">Registro</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {[user?.barrio, user?.municipio, user?.estado].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Direcciones guardadas */}
              {loadingAddresses ? (
                <div className="text-sm text-gray-400 mb-4">Cargando direcciones...</div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="border border-gray-200 p-4 rounded-lg mb-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-barro/10 text-barro text-xs font-semibold px-2 py-0.5 rounded">{addr.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {[addr.barrio, addr.municipio, addr.estado].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await apiFetch(`/api/auth/addresses/${addr.id}`, { method: 'DELETE' });
                          setAddresses(prev => prev.filter(a => a.id !== addr.id));
                        } catch (err) {
                          alert('Error al eliminar: ' + (err.message || err));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4 flex-shrink-0"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}

              {/* Botón / Formulario para nueva dirección */}
              {!isEditingAddress ? (
                <button 
                  onClick={() => {
                    setAddressForm({ label: 'Casa', estado: '', municipio: '', barrio: '' });
                    setAddressError('');
                    setAddressSuccess('');
                    setIsEditingAddress(true);
                  }}
                  className="flex items-center gap-2 text-barro font-medium hover:underline mt-2"
                >
                  + Añadir nueva dirección
                </button>
              ) : (
                <div className="border border-barro/20 bg-barro/5 p-5 rounded-xl mt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Nueva Dirección</h3>
                  
                  {addressError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                      {addressError}
                    </div>
                  )}
                  {addressSuccess && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                      {addressSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Etiqueta</label>
                      <select
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      >
                        <option value="Casa">Casa</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Estado</label>
                      <select
                        value={addressForm.estado}
                        onChange={(e) => setAddressForm({...addressForm, estado: e.target.value})}
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      >
                        <option value="">Selecciona un estado</option>
                        {mexicanStates.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Municipio</label>
                      <input 
                        type="text"
                        value={addressForm.municipio}
                        onChange={(e) => setAddressForm({...addressForm, municipio: e.target.value})}
                        placeholder="Ej: Oaxaca de Juárez"
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Barrio / Colonia</label>
                      <input 
                        type="text"
                        value={addressForm.barrio}
                        onChange={(e) => setAddressForm({...addressForm, barrio: e.target.value})}
                        placeholder="Ej: Centro"
                        className="px-4 py-2.5 border border-barro/30 bg-white text-gray-900 rounded-lg w-full outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={async () => {
                        setSavingAddress(true);
                        setAddressError('');
                        setAddressSuccess('');
                        try {
                          await apiFetch('/api/auth/addresses', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(addressForm)
                          });
                          await fetchAddresses();
                          setAddressSuccess('Dirección agregada correctamente');
                          setIsEditingAddress(false);
                        } catch (err) {
                          setAddressError(err.message || 'Error al guardar la dirección');
                        } finally {
                          setSavingAddress(false);
                        }
                      }}
                      disabled={savingAddress}
                      className="flex items-center gap-2 bg-barro text-white px-5 py-2 rounded-lg font-medium hover:bg-cochinilla transition-colors shadow-sm disabled:opacity-50 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      {savingAddress ? 'Guardando...' : 'Guardar Dirección'}
                    </button>
                    <button 
                      onClick={() => { setIsEditingAddress(false); setAddressError(''); }}
                      disabled={savingAddress}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'payment' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><CreditCard className="w-6 h-6 text-barro" /> Métodos de Pago</h2>
              <div className="border border-gray-200 p-4 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Visa terminada en 4242</p>
                  <p className="text-sm text-gray-600">Expira en 12/28</p>
                </div>
                <button className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
              </div>
              <button className="text-barro font-medium hover:underline">+ Añadir nueva tarjeta</button>
            </div>
          )}

          {activeSection === 'billing' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-barro" /> Facturación (Simulada)</h2>
              <p className="text-gray-500 mb-6">Genera un comprobante PDF de tu última compra (Simulación con jsPDF).</p>
              
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-bold text-gray-900">Pedido #ORD-2026-001</h3>
                    <p className="text-sm text-gray-500">Completado el 13 de Junio, 2026</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Entregado</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Huipil de Gala de Teotitlán (x1)</span>
                    <span className="font-medium text-gray-900">$2,400.00 MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío Especial Asegurado</span>
                    <span className="font-medium text-gray-900">$250.00 MXN</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total Pagado</span>
                    <span className="text-barro">$2,650.00 MXN</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.setFontSize(20);
                    doc.text("Xhaba - Comprobante de Compra", 20, 20);
                    doc.setFontSize(12);
                    doc.text(`Cliente: ${user?.name || 'Cliente'}`, 20, 30);
                    doc.text("Pedido: #ORD-2026-001", 20, 40);
                    doc.text("Fecha: 13 de Junio, 2026", 20, 50);
                    
                    doc.setLineWidth(0.5);
                    doc.line(20, 55, 190, 55);
                    
                    doc.text("Detalle:", 20, 65);
                    doc.text("1x Huipil de Gala de Teotitlán ...................... $2,400.00 MXN", 20, 75);
                    doc.text("1x Envío Especial Asegurado ......................... $250.00 MXN", 20, 85);
                    
                    doc.setFontSize(14);
                    doc.text("Total Pagado: $2,650.00 MXN", 20, 100);
                    
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text("Este es un documento simulado para fines académicos.", 20, 120);
                    
                    doc.save("xhaba_factura_ORD-2026-001.pdf");
                  }}
                  className="bg-barro text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cochinilla transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="w-5 h-5" />
                  Descargar Factura PDF
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ClientProfile;

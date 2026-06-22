import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Image as ImageIcon, Camera, Play, Link as LinkIcon, Upload, Trash2, CheckCircle } from 'lucide-react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

const CLOUDINARY_CLOUD_NAME = 'dtcpixf4a';
const CLOUDINARY_UPLOAD_PRESET = 'my_video_preset'; // A brand new preset to fix Cloudinary corruption

// Client-side image compression utility
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG for excellent compression
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminDashboard({ categories, saveToStorage, onLockPortal }) {
  const [title, setTitle] = useState('');
  const [targetCat, setTargetCat] = useState('work'); // 'parlour', 'work', 'video'
  const [sourceType, setSourceType] = useState('url'); // 'url', 'file'
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Derived state for sidebar
  const activeCategoryIndex = categories.findIndex(c => c.id === targetCat);
  const activeItems = categories[activeCategoryIndex]?.items || [];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const isFirebaseConnected = db && db.app && db.app.options && db.app.options.apiKey && db.app.options.apiKey !== 'YOUR_API_KEY';

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const itemToDelete = activeItems[index];

      if (isFirebaseConnected && itemToDelete.id) {
        try {
          // Delete from Firestore
          const docRef = doc(db, 'gallery', itemToDelete.id);
          await deleteDoc(docRef);

          // Delete from Firebase Storage if it was uploaded (legacy support)
          if (itemToDelete.storagePath) {
            const fileRef = ref(storage, itemToDelete.storagePath);
            await deleteObject(fileRef);
          }
        } catch (error) {
          console.error("Firebase Deletion Error:", error);
          alert("Error deleting item from database: " + error.message);
        }
      } else {
        const newCats = [...categories];
        newCats[activeCategoryIndex].items.splice(index, 1);
        saveToStorage(newCats);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) { alert("Please enter an Item Title"); return; }
    
    // Auto-detect video if they upload to the Video tab
    const isVideoTab = targetCat === 'video';
    
    if (isFirebaseConnected) {
      setIsUploading(true);
      try {
        if (sourceType === 'url') {
          if (!url.trim()) { alert("Please enter a valid URL"); setIsUploading(false); return; }
          const docData = {
            title: title,
            category: categories[activeCategoryIndex].name,
            image: url,
            isVideo: isVideoTab,
            storagePath: null,
            likes: '0',
            comments: '0',
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, 'gallery'), docData);
        } else {
          if (!file) { alert("Please select a file to upload"); setIsUploading(false); return; }
          
          const isVideoFile = file.type.startsWith('video/');
          let mediaUrl = '';

          // Upload directly to Cloudinary
          const formData = new FormData();
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          formData.append('file', file);

          // Some Cloudinary accounts require specific resource types for unsigned uploads instead of 'auto'
          const resourceType = isVideoFile ? 'video' : 'image';
          const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Cloudinary Error:", errorData);
            alert(`Cloudinary Upload Failed: ${errorData.error?.message || 'Unknown error'}`);
            setIsUploading(false);
            return;
          }

          const data = await response.json();
          mediaUrl = data.secure_url;
          
          // Add metadata document to Firestore with the Cloudinary URL
          const docData = {
            title: title,
            category: categories[activeCategoryIndex].name,
            image: mediaUrl,
            isVideo: isVideoFile || isVideoTab,
            storagePath: null,
            likes: '0',
            comments: '0',
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, 'gallery'), docData);
        }
        
        // Reset form & show success
        setTitle('');
        setUrl('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } catch (error) {
        console.error("Firebase upload error:", error);
        alert("Failed to upload item to Firebase. Check console for error logs.");
      } finally {
        setIsUploading(false);
      }
    } else {
      // Local Sandbox Fallback
      if (sourceType === 'url') {
        if (!url.trim()) { alert("Please enter a valid URL"); return; }
        addItem(url, isVideoTab);
      } else {
        if (!file) { alert("Please select a file to upload"); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
          const isVideoFile = file.type.startsWith('video/');
          addItem(reader.result, isVideoFile || isVideoTab);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addItem = (imageSrc, isVideo) => {
    const newCats = [...categories];
    const newItems = [...newCats[activeCategoryIndex].items];
    
    newItems.unshift({
      title: title,
      category: newCats[activeCategoryIndex].name,
      likes: '0',
      comments: '0',
      image: imageSrc,
      isVideo: isVideo
    });
    
    newCats[activeCategoryIndex].items = newItems;
    saveToStorage(newCats);
    
    // Reset form and show success
    setTitle('');
    setUrl('');
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 bg-[#030303] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.05)]">
      
      {/* Header */}
      <div className="bg-[#050505] border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-neonOrange/30 bg-neonOrange/5 flex items-center justify-center">
            <Lock className="w-5 h-5 text-neonOrange" />
          </div>
          <div>
            <h3 className="font-cyber font-bold tracking-widest text-white text-sm uppercase">Admin Portal Unlocked</h3>
            <p className="font-cyber text-[9px] text-neonOrange tracking-[0.2em] uppercase mt-0.5">Gallery Visual Archive Editor Mode</p>
          </div>
        </div>
        
        <button 
          onClick={onLockPortal}
          className="flex items-center gap-2 px-5 py-2.5 bg-black border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-lg font-cyber text-[10px] uppercase tracking-widest"
        >
          <Lock className="w-3.5 h-3.5" />
          Lock Portal
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 p-8 border-r border-white/10">
          
          {/* Title Input */}
          <div className="mb-8">
            <label className="block font-cyber text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Item Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Signature Gold Balayage"
              className="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-neonOrange/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Target Section */}
            <div>
              <label className="block font-cyber text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Target Section</label>
              <div className="flex bg-[#080808] border border-white/10 rounded-xl p-1.5">
                {[
                  { id: 'parlour', icon: ImageIcon, label: 'Parlour' },
                  { id: 'work', icon: Camera, label: 'Work' },
                  { id: 'video', icon: Play, label: 'Video' }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTargetCat(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-cyber text-[10px] uppercase tracking-widest transition-all ${
                        targetCat === tab.id 
                          ? 'bg-neonOrange/10 border border-neonOrange/30 text-neonOrange' 
                          : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Source Selection */}
            <div>
              <label className="block font-cyber text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Source Selection</label>
              <div className="flex bg-[#080808] border border-white/10 rounded-xl p-1.5">
                <button
                  onClick={() => setSourceType('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-cyber text-[10px] uppercase tracking-widest transition-all ${
                    sourceType === 'url' 
                      ? 'bg-neonOrange/10 border border-neonOrange/30 text-neonOrange' 
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Web Link
                </button>
                <button
                  onClick={() => setSourceType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-cyber text-[10px] uppercase tracking-widest transition-all ${
                    sourceType === 'file' 
                      ? 'bg-neonOrange/10 border border-neonOrange/30 text-neonOrange' 
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                </button>
              </div>
            </div>
          </div>

          {/* Source Input */}
          <div className="mb-8">
            <label className="block font-cyber text-[10px] text-neutral-500 uppercase tracking-widest mb-3">
              {sourceType === 'url' ? 'Web Link Address' : 'Local File Upload'}
            </label>
            
            {sourceType === 'url' ? (
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or direct MP4 video link"
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-neonOrange/50 focus:outline-none transition-colors"
              />
            ) : (
              <div className="w-full bg-[#080808] border border-dashed border-white/20 rounded-xl px-5 py-6 text-center hover:border-neonOrange/50 transition-colors relative">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-neutral-500 mx-auto mb-3" />
                {file ? (
                  <p className="font-sans text-sm text-neonOrange">{file.name}</p>
                ) : (
                  <>
                    <p className="font-sans text-sm text-white mb-1">Click or drag file to upload</p>
                    <p className="font-sans text-xs text-neutral-500">Supports JPG, PNG, MP4</p>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="font-sans text-[11px] text-neutral-600 mb-6">
            {isFirebaseConnected 
              ? "* Uploaded media is saved directly to your secure Firebase Cloud Storage bucket and synced in real-time."
              : "* Uploaded media is saved in your browser storage. For large video clips, please enter a direct URL link instead of uploading."}
          </p>

          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`w-full sm:w-auto px-10 py-4 bg-neonOrange text-black font-cyber font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 ${
              isUploading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-[1.02]'
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Uploading to Cloud...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Added to Gallery!</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload to Gallery</span>
              </>
            )}
          </button>

        </div>

        {/* Right Sidebar List Area (4 cols) */}
        <div className="lg:col-span-4 bg-[#050505] flex flex-col h-full max-h-[600px]">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h4 className="font-cyber font-bold text-[10px] text-white uppercase tracking-widest">
              Section Items ({activeItems.length})
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {activeItems.length === 0 ? (
              <p className="text-neutral-600 font-sans text-xs text-center py-10">No items in this section.</p>
            ) : (
              <AnimatePresence>
                {activeItems.map((item, index) => (
                  <motion.div 
                    key={index + item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 bg-[#080808] border border-white/5 rounded-xl p-3 hover:border-white/20 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-black shrink-0 overflow-hidden relative border border-white/10">
                      {item.isVideo && item.image?.startsWith('data:video') ? (
                        <video src={item.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${item.image || ''}')` }} />
                      )}
                      {item.isVideo && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                           <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                         </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-cyber font-bold text-[10px] text-white uppercase tracking-wider truncate mb-1">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-cyber uppercase tracking-wider border border-neonOrange/30 text-neonOrange bg-neonOrange/10">
                          {item.isVideo ? 'VIDEO' : 'PHOTO'}
                        </span>
                        <span className="text-[9px] font-sans text-neutral-500 truncate">{item.category}</span>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <button 
                      onClick={() => handleDelete(index)}
                      className="w-8 h-8 rounded-full border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shrink-0 opacity-50 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}

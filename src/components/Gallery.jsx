import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Image as ImageIcon, Camera, Play, Lock } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const initialGalleryCategories = [
  {
    id: 'parlour',
    name: 'Parlour Photo',
    icon: ImageIcon,
    items: [
      {
        title: 'Main Luxury Lounge',
        category: 'Interior Design',
        likes: '3.1k',
        comments: '112',
        image: '/luxury_parlour_bg.png'
      },
      {
        title: 'VIP Styling Suite',
        category: 'Interior Design',
        likes: '2.5k',
        comments: '89',
        image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Premium Wash Stations',
        category: 'Salon Architecture',
        likes: '1.8k',
        comments: '64',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Exclusive Client Lounge',
        category: 'Interior Design',
        likes: '4.2k',
        comments: '156',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'work',
    name: 'Work Photo',
    icon: Camera,
    items: [
      {
        title: 'Signature Gold Balayage',
        category: 'Hair Couture',
        likes: '1.2k',
        comments: '48',
        image: '/gallery_hair.png'
      },
      {
        title: 'Flawless Editorial Glow',
        category: 'Glamour Makeup',
        likes: '2.4k',
        comments: '82',
        image: 'https://images.unsplash.com/photo-1512496015851-a1dc8a473919?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Royal Traditional Bride',
        category: 'Bridal Artistry',
        likes: '3.8k',
        comments: '124',
        image: 'https://images.unsplash.com/photo-1595085608756-744033230b42?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Designer Gold-Leaf Manicure',
        category: 'Nail Artistry',
        likes: '920',
        comments: '31',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'video',
    name: 'Video',
    icon: Play,
    items: [
      {
        title: 'Behind the Scenes: Bridal Glow',
        category: 'Makeup Transformation',
        likes: '8.4k',
        comments: '342',
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800',
        isVideo: true
      },
      {
        title: 'Masterclass: French Cut Technique',
        category: 'Hair Styling Tutorial',
        likes: '12.1k',
        comments: '511',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
        isVideo: true
      }
    ]
  }
];

// ==========================================
// INDEXEDDB PERSISTENCE LAYER (Supports large base64 uploads without size limits)
// ==========================================
const dbName = 'NewLookGalleryDB';
const storeName = 'gallery';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const saveGalleryToIndexedDB = async (categoriesList) => {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    // Remove icon components before saving to make it fully JSON serializable
    const serializable = categoriesList.map(cat => {
      const { icon, ...rest } = cat;
      return rest;
    });

    store.put(serializable, 'categoriesData');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
    return false;
  }
};

const loadGalleryFromIndexedDB = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get('categoriesData');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return null;
  }
};

const mapFirestoreDocsToCategories = (docs) => {
  const newCategories = initialGalleryCategories.map(cat => ({
    ...cat,
    items: []
  }));

  if (docs.length === 0) {
    return initialGalleryCategories;
  }

  docs.forEach(doc => {
    const catId = doc.category === 'Parlour Photo' ? 'parlour' : (doc.category === 'Video' ? 'video' : 'work');
    const targetCat = newCategories.find(c => c.id === catId);
    if (targetCat) {
      targetCat.items.push({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        likes: doc.likes || '0',
        comments: doc.comments || '0',
        image: doc.image,
        isVideo: doc.isVideo,
        storagePath: doc.storagePath || null
      });
    }
  });

  return newCategories;
};

export default function Gallery({ isAdmin, onAdminClick, onLockPortal }) {
  const [activeTab, setActiveTab] = useState('work');
  const [categories, setCategories] = useState(initialGalleryCategories);

  // Load from database on mount (prioritize Firebase Firestore, fallback to local IndexedDB)
  useEffect(() => {
    let unsubscribe = null;

    const loadData = async () => {
      const isFirebaseConnected = db && db.app && db.app.options && db.app.options.apiKey && db.app.options.apiKey !== 'YOUR_API_KEY';

      if (isFirebaseConnected) {
        try {
          const galleryCol = collection(db, 'gallery');
          const q = query(galleryCol, orderBy('createdAt', 'desc'));
          
          // Setup real-time Firestore listener
          unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            const mapped = mapFirestoreDocsToCategories(docs);
            setCategories(mapped);
          }, (error) => {
            console.error("Firestore Real-time Listener Error:", error);
          });
          return;
        } catch (e) {
          console.error("Failed to connect Firebase listener, falling back to local database", e);
        }
      }

      // Fallback local database loading
      let savedData = null;
      try {
        savedData = await loadGalleryFromIndexedDB();
      } catch (e) {
        console.error("Failed to read from IndexedDB, falling back to LocalStorage", e);
      }

      if (!savedData) {
        const saved = localStorage.getItem('newLookGallery');
        if (saved) {
          try {
            savedData = JSON.parse(saved);
          } catch (e) {
            console.error("Failed to parse LocalStorage data", e);
          }
        }
      }

      if (savedData) {
        const restoredCategories = savedData.map(parsedCat => {
          const initialCat = initialGalleryCategories.find(c => c.id === parsedCat.id);
          return {
            ...parsedCat,
            icon: initialCat ? initialCat.icon : Camera
          };
        });
        setCategories(restoredCategories);
      }
    };

    loadData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Helper to save to state and IndexedDB with LocalStorage backup (only used in local sandbox mode)
  const saveToStorage = async (newCats) => {
    setCategories(newCats);
    
    // Save to IndexedDB
    try {
      await saveGalleryToIndexedDB(newCats);
    } catch (e) {
      console.error("Failed to save to IndexedDB", e);
    }

    // Try LocalStorage backup (will fail silently if base64 size > 5MB)
    try {
      const serializable = newCats.map(cat => {
        const { icon, ...rest } = cat;
        return rest;
      });
      localStorage.setItem('newLookGallery', JSON.stringify(serializable));
    } catch (e) {
      console.warn("LocalStorage backup failed due to quota limits, but database (IndexedDB) saved successfully.");
    }
  };

  const activeCategoryIndex = categories.findIndex((cat) => cat.id === activeTab);
  const activeData = categories[activeCategoryIndex] || { items: [] };

  return (
    <section id="gallery" className="relative py-24 bg-deepSpace overflow-hidden border-t border-white/5">
      {/* Background ambient light */}
      <div className="glow-orb w-[300px] h-[300px] bg-neonOrange/5 bottom-0 right-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-neonOrange uppercase block mb-3">Portfolio Feed</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            THE GLAMOUR FEED
          </h2>
          <p className="font-sans text-neutral-500 text-xs md:text-sm tracking-wide mt-4 max-w-xl mx-auto">
            Browse our real-time social gallery showcasing the finest hair, makeup, and skin transformations.
          </p>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center space-x-3 px-6 py-3.5 rounded-full border text-xs font-cyber tracking-widest uppercase transition-all duration-500 relative ${
                    isActive
                      ? 'border-neonOrange bg-gradient-to-r from-neonOrange/20 to-cyberOrange/15 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'border-white/5 bg-white/[0.01] text-neutral-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-neonOrange scale-110' : 'text-neutral-400'}`} />
                  <span>{category.name}</span>
                  {isActive && (
                    <span className="absolute -inset-[1px] rounded-full border border-gradient-to-r from-neonOrange to-cyberOrange pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin Login Button (Visible when NOT logged in) */}
          {!isAdmin && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onAdminClick}
              className="mt-8 flex items-center gap-2 px-6 py-2.5 border border-white/10 text-neutral-400 font-cyber font-medium uppercase tracking-widest text-[10px] rounded-lg hover:text-neonOrange hover:border-neonOrange/50 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Access
            </motion.button>
          )}
        </div>

        {/* Full Admin Dashboard Rendered Above Gallery */}
        {isAdmin && (
           <AdminDashboard 
             categories={categories} 
             saveToStorage={saveToStorage} 
             activeTab={activeTab} 
             onLockPortal={onLockPortal}
           />
        )}

        {/* Gallery Grid */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {activeData.items.map((item, index) => (
                <motion.div
                  key={item.id || item.title + index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:border-neonOrange/60 cursor-pointer transition-all duration-500 backdrop-blur-md"
                  whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.4, ease: 'easeOut' } }}
                >
                  {/* Animated Shimmer Overlay */}
                  <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer z-20 pointer-events-none" />
                  
                  {/* Media Rendering (Image or Video) */}
                  {item.isVideo ? (
                    <video
                      src={item.image}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.image || ''}')` }}
                    />
                  )}

                  {/* Video Play Overlay */}
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-neonOrange/20 group-hover:border-neonOrange/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {/* Default Subtle Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Hover Luxury Gold Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10 border border-neonOrange/20 rounded-2xl pointer-events-none">
                    
                    {/* Header info */}
                    <div className="flex justify-between items-start">
                      <span className="font-cyber tracking-[0.2em] text-[9px] text-neonOrange uppercase">
                        {item.category}
                      </span>
                      {item.isVideo ? (
                         <Play className="w-3.5 h-3.5 text-neonOrange/60" />
                      ) : (
                         <Sparkles className="w-3.5 h-3.5 text-neonOrange/60" />
                      )}
                    </div>

                    {/* Bottom detail and micro-stats */}
                    <div>
                      <h3 className="font-cyber font-semibold tracking-wider text-xs md:text-sm text-white uppercase mb-4">
                        {item.title}
                      </h3>

                      <div className="flex items-center space-x-6 border-t border-white/5 pt-4">
                        <div className="flex items-center space-x-1.5 text-neutral-400">
                          <Heart className="w-4 h-4" />
                          <span className="font-sans text-xs font-light">{item.likes}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-neutral-400">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-sans text-xs font-light">{item.comments}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

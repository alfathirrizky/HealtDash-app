import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward, X } from 'lucide-react';
import Myaudio from "../assets/Sound/Raisa - Bila (Official Lyric Video).mp3";

const FloatingAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const audioRef = useRef(null);
  const constraintsRef = useRef(null);

  // Daftar putar (Playlist)
  const playlist = [
    { title: "Raisa - Bila", url: Myaudio },
    { title: "Relaxing Audio 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Relaxing Audio 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
  ];

  const currentTrack = playlist[currentTrackIndex];

  // Efek untuk memutar lagu secara otomatis ketika track berubah (hanya jika sedang bermain)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play prevented or interrupted:", error);
        });
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();  
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const onEnded = () => {
    // Otomatis lanjut ke lagu berikutnya saat selesai
    nextTrack({ stopPropagation: () => {} });
  };

  return (
    <>
      {/* Invisible full-screen container to act as drag bounds */}
      <div className="fixed inset-0 pointer-events-none z-40" ref={constraintsRef} />
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className={`fixed z-50 bottom-10 right-10 flex flex-col items-center bg-white/90 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 cursor-grab active:cursor-grabbing transition-all duration-300 ${isExpanded ? 'w-[19rem] rounded-3xl' : 'w-16 rounded-full'}`}
      >
        <audio 
          ref={audioRef} 
          src={currentTrack.url} 
          onEnded={onEnded}
        />
        
        {!isExpanded ? (
          <div 
            onClick={toggleExpand}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-lg pointer-events-auto hover:scale-105 transition-transform cursor-pointer" 
            title="Buka Audio Player"
          >
            {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6 ml-1" />}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full p-3 gap-4 pointer-events-auto cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between w-full px-2">
              <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-full flex-shrink-0">
                  <Music className="w-4 h-4 text-blue-600 animate-bounce" />
                </div>
                <span className="truncate max-w-[150px]" title={currentTrack.title}>{currentTrack.title}</span>
              </div>
              <button 
                onClick={toggleExpand}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Tutup Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 w-full">
              <button 
                onClick={prevTrack}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5 fill-slate-500" />
              </button>

              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 mx-1"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              <button 
                onClick={nextTrack}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5 fill-slate-500" />
              </button>

              <div className="w-px h-6 bg-slate-200 mx-1"></div>

              <button 
                onClick={toggleMute}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default FloatingAudioPlayer;
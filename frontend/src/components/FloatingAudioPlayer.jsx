import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import Myaudio from "../assets/Sound/Raisa - Bila (Official Lyric Video).mp3";

const FloatingAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);
  const constraintsRef = useRef(null);

  // You can replace this URL with your actual audio asset later
  const audioUrl = Myaudio;

  const togglePlay = (e) => {
    e.stopPropagation();  
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
        className={`fixed z-50 bottom-10 right-10 flex flex-col items-center bg-white/90 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 cursor-grab active:cursor-grabbing transition-all duration-300 ${isExpanded ? 'w-56 rounded-3xl' : 'w-16 rounded-full'}`}
        onClick={toggleExpand}
      >
        <audio ref={audioRef} src={audioUrl} loop />
        
        {!isExpanded ? (
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-lg pointer-events-auto hover:scale-105 transition-transform" title="Buka Audio Player">
            {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6 ml-1" />}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full p-3 gap-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <Music className="w-4 h-4 text-blue-600 animate-bounce" />
              </div>
              <span>Relaxing Audio</span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
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

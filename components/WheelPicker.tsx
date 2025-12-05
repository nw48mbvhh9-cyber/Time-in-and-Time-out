import React, { useRef, useEffect, useState } from 'react';

interface WheelPickerProps {
  items: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  width?: string;
  loop?: boolean;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({ 
  items, 
  value, 
  onChange, 
  width = "w-16" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Default to 40, but will measure actual height on mount
  const [itemHeight, setItemHeight] = useState(40);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Measure actual item height to account for device font scaling
  useEffect(() => {
    if (itemRef.current) {
      setItemHeight(itemRef.current.offsetHeight);
    }
  }, []);

  // Sync scroll position when value changes (e.g. loading defaults or external updates)
  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      const selectedIndex = items.indexOf(value);
      if (selectedIndex !== -1) {
        containerRef.current.scrollTo({
          top: selectedIndex * itemHeight,
          behavior: 'smooth' 
        });
      }
    }
  }, [value, itemHeight, items]);

  // Handle scroll snap logic
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const scrollTop = containerRef.current.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    
    // Debounce the actual value change
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      // Clamp index
      const validIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
      const newValue = items[validIndex];
      
      if (newValue !== value) {
        onChange(newValue);
        // Snap perfectly
        if (containerRef.current) {
             containerRef.current.scrollTo({
                top: validIndex * itemHeight,
                behavior: 'smooth'
             });
        }
      }
    }, 150);
  };

  return (
    <div className={`relative h-40 overflow-hidden ${width} select-none`}>
        {/* Selection Highlight */}
      <div className="absolute top-1/2 left-0 w-full h-10 -mt-5 pointer-events-none z-10">
        <div className="w-full h-full border-t border-b border-blue-500/30 bg-blue-50/20 rounded-md"></div>
      </div>
      
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 w-full h-14 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar py-[60px]"
        style={{ 
            scrollBehavior: 'smooth',
            touchAction: 'pan-y', // Critical: tells browser to only handle vertical scroll gestures
            overscrollBehaviorX: 'none' // Critical: prevents horizontal rubber-banding
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            ref={index === 0 ? itemRef : null}
            className={`h-10 flex items-center justify-center snap-center text-lg transition-all duration-200 w-full ${
              item === value ? 'font-semibold text-slate-900 scale-110' : 'text-slate-400 scale-95'
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

import groundImage from '../assets/images/ground.jpg';
import React, { useEffect, useState } from 'react';

interface PositionData {
  x: number;
  y: number;
}

interface GroundImageProps {
  onChange: (data: PositionData) => void;
}

const GroundImage: React.FC<GroundImageProps> = ({ onChange }) => {
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleImageClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
  };

  useEffect(() => {
    const data: PositionData = {
      x: clickPosition.x,
      y: clickPosition.y,
    };
    onChange(data);
  }, [clickPosition]);

  return (
    <div style={{ display: 'flex', marginTop: '20px', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={groundImage}
          alt="Ground"
          style={{ width: '300px', height: 'auto', cursor: 'pointer' }}
          onClick={handleImageClick}
        />
        {(clickPosition.x !== 0 || clickPosition.y !== 0) && (
          <div
            style={{
              position: 'absolute',
              top: `${clickPosition.y}px`,
              left: `${clickPosition.x}px`,
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroundImage;

import React from 'react';
import { IoMdPerson } from 'react-icons/io';

function Avatar({ imageUrl, altText, size = 40 }) {
  return (
    <div className="relative rounded-full overflow-hidden">
      <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
      {!imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <IoMdPerson size={size / 2} />
        </div>
      )}
    </div>
  );
}

export default Avatar;

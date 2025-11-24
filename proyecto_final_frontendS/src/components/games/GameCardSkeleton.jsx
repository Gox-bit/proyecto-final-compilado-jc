import React from 'react';
import Skeleton from '../common/Skeleton';

const GameCardSkeleton = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col shadow-sm">
      
      {/* Imagen */}
      <div className="relative h-48 w-full">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        
        {/* Badge de Género */}
        <Skeleton className="h-5 w-20 rounded-full" />
        
        {/* Título */}
        <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Descripción (Fade out simulado) */}
        <div className="pt-2 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Botón inferior */}
        <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default GameCardSkeleton;
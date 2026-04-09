'use client';

import Image from 'next/image';
import { Plus, Zap } from 'lucide-react';
import type { TcgdexCardBrief } from '@/lib/ingestion';

// Energy type → Tailwind color class
const typeColors: Record<string, string> = {
  Fire: 'bg-pokemon-fire',
  Water: 'bg-pokemon-water',
  Grass: 'bg-pokemon-grass',
  Lightning: 'bg-pokemon-electric',
  Psychic: 'bg-pokemon-psychic',
  Fighting: 'bg-pokemon-fighting',
  Darkness: 'bg-pokemon-dark',
  Metal: 'bg-pokemon-steel',
  Fairy: 'bg-pokemon-fairy',
  Dragon: 'bg-pokemon-dragon',
  Colorless: 'bg-pokemon-colorless',
};

interface CardTileProps {
  card: TcgdexCardBrief;
  onClick?: () => void;
  onAdd?: () => void;
  size?: 'sm' | 'md';
}

export default function CardTile({ card, onClick, onAdd, size = 'md' }: CardTileProps) {
  const isSmall = size === 'sm';
  // card.image is the base URL from TCGdex; /high.webp gives the actual image file
  const imageUrl = card.image ? `${card.image}/high.webp` : null;

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-gold/20 bg-card-white/85 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 ${
        isSmall ? 'p-2' : 'p-2.5'
      }`}
      onClick={onClick}
    >
      {/* Card image */}
      <div
        className={`relative overflow-hidden rounded-lg bg-card-cream ${
          isSmall ? 'mb-2' : 'mb-2.5'
        }`}
        style={{ aspectRatio: '2.5/3.5' }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            sizes={isSmall ? '120px' : '180px'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Zap className="h-8 w-8 text-gold/40" />
          </div>
        )}

        {/* Add overlay */}
        {onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--text-primary))]/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-label={`Add ${card.name} to deck`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold shadow-md">
              <Plus className="h-4 w-4 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Card info */}
      <div className={`space-y-1 px-0.5 ${isSmall ? '' : 'space-y-1.5'}`}>
        <h3
          className={`truncate font-medium text-[rgb(var(--text-primary))] ${
            isSmall ? 'text-xs' : 'text-[13px]'
          }`}
        >
          {card.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] text-[rgb(var(--text-muted))]`}>
            {card.localId}
          </span>
        </div>
      </div>
    </div>
  );
}

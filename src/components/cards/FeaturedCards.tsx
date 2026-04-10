'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSet } from '@/lib/ingestion';
import type { TcgdexCardBrief } from '@/lib/ingestion';

// Pick a recent set with great art
const FEATURED_SET_ID = 'sv08.5';
const FEATURED_SET_NAME = 'Prismatic Evolutions';
const CARD_COUNT = 8;

export default function FeaturedCards() {
  const [cards, setCards] = useState<TcgdexCardBrief[]>([]);

  useEffect(() => {
    fetchSet(FEATURED_SET_ID).then((result) => {
      if (result.data?.cards) {
        // Pick cards that have images, spread across the set
        const withImages = result.data.cards.filter((c) => c.image);
        const step = Math.floor(withImages.length / CARD_COUNT);
        const picked = Array.from({ length: CARD_COUNT }, (_, i) =>
          withImages[Math.min(i * step, withImages.length - 1)]
        );
        setCards(picked);
      }
    });
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-seeker">
              Latest Set
            </p>
            <h2 className="font-display text-3xl font-bold text-[rgb(var(--text-primary))]">
              {FEATURED_SET_NAME}
            </h2>
          </div>
          <Link
            href="/cards"
            className="text-sm font-medium text-[rgb(var(--text-muted))] underline-offset-4 hover:text-[rgb(var(--text-primary))] hover:underline"
          >
            Browse all cards
          </Link>
        </div>

        {/* Card fan — slight rotations for visual interest */}
        <div className="flex items-end justify-center gap-2 sm:gap-3">
          {cards.map((card, i) => {
            // Spread cards in a gentle arc
            const mid = (CARD_COUNT - 1) / 2;
            const offset = i - mid;
            const rotate = offset * 3;
            const translateY = Math.abs(offset) * 6;

            return (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                  zIndex: i === Math.floor(CARD_COUNT / 2) ? 10 : CARD_COUNT - Math.abs(offset),
                }}
                className="group relative shrink-0 transition-transform duration-200 hover:z-20 hover:-translate-y-3 hover:rotate-0"
              >
                <div
                  className="relative overflow-hidden rounded-xl border-2 border-gold/40 bg-card-cream shadow-md shadow-black/10 transition-shadow duration-200 group-hover:border-gold group-hover:shadow-xl group-hover:shadow-gold/20"
                  style={{ width: 90, aspectRatio: '2.5/3.5' }}
                >
                  <Image
                    src={`${card.image}/high.webp`}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

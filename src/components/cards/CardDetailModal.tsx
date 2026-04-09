'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, ExternalLink, Shield, Zap, Swords } from 'lucide-react';
import type { TcgdexCard } from '@/lib/ingestion';
import { getCardImageUrl } from '@/lib/ingestion';

interface CardDetailModalProps {
  card: TcgdexCard;
  onClose: () => void;
  onAdd?: () => void;
}

export default function CardDetailModal({ card, onClose, onAdd }: CardDetailModalProps) {
  const imageUrl = card.image ? getCardImageUrl(card.image, { quality: 'high' }) : null;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const tcgPrice = card.pricing?.tcgplayer;
  const marketPrice =
    tcgPrice?.normal?.marketPrice ?? tcgPrice?.holofoil?.marketPrice ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgb(var(--text-primary))]/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/30 bg-card-white/95 shadow-2xl shadow-gold/10 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl p-2 text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/10 hover:text-[rgb(var(--text-primary))]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Card image */}
          <div
            className="relative overflow-hidden rounded-xl bg-card-cream"
            style={{ aspectRatio: '2.5/3.5' }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={card.name}
                fill
                className="object-cover"
                sizes="350px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Zap className="h-16 w-16 text-gold/30" />
              </div>
            )}
          </div>

          {/* Card info */}
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {card.types?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-[rgb(var(--text-secondary))]"
                  >
                    {t}
                  </span>
                ))}
                {card.rarity && (
                  <span className="text-xs text-[rgb(var(--text-muted))]">
                    {card.rarity}
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold text-[rgb(var(--text-primary))]">
                {card.name}
              </h2>
              {card.hp && (
                <p className="text-sm text-[rgb(var(--text-secondary))]">
                  HP {card.hp}
                  {card.stage && ` · ${card.stage}`}
                  {card.set?.name && ` · ${card.set.name}`}
                </p>
              )}
            </div>

            {/* Flavor / effect text */}
            {(card.description || card.effect) && (
              <p className="text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
                {card.description ?? card.effect}
              </p>
            )}

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Abilities
                </h4>
                {card.abilities.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gold/15 bg-gold/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-seeker" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-seeker">
                        {a.type}
                      </span>
                      <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                        {a.name}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[rgb(var(--text-secondary))]">
                      {a.effect}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Attacks */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Attacks
                </h4>
                {card.attacks.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gold/15 bg-card-cream/50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Swords className="h-3.5 w-3.5 text-[rgb(var(--text-muted))]" />
                        <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                          {a.name}
                        </span>
                      </div>
                      {a.damage && (
                        <span className="font-mono text-sm font-bold text-gold">
                          {a.damage}
                        </span>
                      )}
                    </div>
                    {a.cost && a.cost.length > 0 && (
                      <div className="mt-1.5 flex gap-1">
                        {a.cost.map((c, j) => (
                          <span
                            key={j}
                            className="rounded-full border border-gold/20 bg-gold/10 px-1.5 py-0.5 text-[10px] font-medium text-[rgb(var(--text-secondary))]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {a.effect && (
                      <p className="mt-1 text-xs text-[rgb(var(--text-secondary))]">
                        {a.effect}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Weaknesses / Resistance / Retreat */}
            {(card.weaknesses || card.resistances || card.retreat != null) && (
              <div className="flex gap-3">
                {card.weaknesses && card.weaknesses.length > 0 && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="text-[10px] text-[rgb(var(--text-muted))]">Weakness</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                      {card.weaknesses[0].type} {card.weaknesses[0].value}
                    </p>
                  </div>
                )}
                {card.resistances && card.resistances.length > 0 && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="text-[10px] text-[rgb(var(--text-muted))]">Resistance</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                      {card.resistances[0].type} {card.resistances[0].value}
                    </p>
                  </div>
                )}
                {card.retreat != null && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="text-[10px] text-[rgb(var(--text-muted))]">Retreat</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                      {card.retreat}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pricing */}
            {marketPrice != null && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Market Price
                </h4>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-center">
                    <p className="text-[10px] text-[rgb(var(--text-muted))]">TCGPlayer</p>
                    <p className="font-mono text-xl font-bold text-gold">
                      ${marketPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {onAdd && (
                <button
                  onClick={onAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold to-gold-dark py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Add to Deck
                </button>
              )}
              <a
                href={`https://tcgdex.net/en/cards/${card.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-gold/30 px-4 py-2.5 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                TCGdex
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

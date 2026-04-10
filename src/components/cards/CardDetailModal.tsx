'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, ExternalLink, Shield, Swords, Zap } from 'lucide-react';
import type { TcgdexCard } from '@/lib/ingestion';

// ─── SVG Energy Icons ─────────────────────────────────────────────────────────
// Inline SVGs so there are no external image dependencies

function EnergyIcon({ type, size = 20 }: { type: string; size?: number }) {
  const s = size;
  switch (type) {
    case 'Fire': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Fire</title><circle cx="10" cy="10" r="10" fill="#E8503A"/><path d="M10 4c0 0 3.5 4 3.5 7 0 2.5-1.5 4.5-3.5 4.5S6.5 13.5 6.5 11c0-2 1.5-3.5 2.5-4.5C9 8 10 9 10 9c0 0 1.5-2 0-5z" fill="white"/></svg>
    );
    case 'Water': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Water</title><circle cx="10" cy="10" r="10" fill="#4A90D9"/><path d="M10 4.5L14.5 12.5C14.5 15 12.5 16.5 10 16.5C7.5 16.5 5.5 15 5.5 12.5Z" fill="white"/></svg>
    );
    case 'Grass': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Grass</title><circle cx="10" cy="10" r="10" fill="#5BAD5B"/><path d="M10 15.5C9 12 5.5 9 4 7C6.5 6.5 9.5 9 10 15.5Z" fill="white"/><path d="M10 15.5C11 12 14.5 9 16 7C13.5 6.5 10.5 9 10 15.5Z" fill="white"/><rect x="9.5" y="5" width="1" height="10.5" fill="white"/></svg>
    );
    case 'Lightning': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Lightning</title><circle cx="10" cy="10" r="10" fill="#F0C000"/><path d="M12.5 4L7 11.5H11L7.5 17L14.5 9.5H11Z" fill="white"/></svg>
    );
    case 'Psychic': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Psychic</title><circle cx="10" cy="10" r="10" fill="#B86CE8"/><path d="M10 4.5L11.5 8.5H16L12.5 11L13.5 15.5L10 12.5L6.5 15.5L7.5 11L4 8.5H8.5Z" fill="white"/></svg>
    );
    case 'Fighting': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Fighting</title><circle cx="10" cy="10" r="10" fill="#C95F2E"/><path d="M7 6.5H13V10C13 12.5 11.7 14 10 14C8.3 14 7 12.5 7 10V6.5Z" fill="white"/><rect x="7.5" y="15" width="5" height="1.5" rx="0.75" fill="white"/></svg>
    );
    case 'Darkness': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Darkness</title><circle cx="10" cy="10" r="10" fill="#444"/><path d="M13 5.5C10.5 5 8 6.5 6.5 8.5C5 10.5 5.5 13 7 14.5C5 13 3.5 10 4.5 7.5C5.5 5 8.5 4 13 5.5Z" fill="white"/><circle cx="13.5" cy="8" r="1.5" fill="white"/></svg>
    );
    case 'Metal': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Metal</title><circle cx="10" cy="10" r="10" fill="#9099A1"/><path d="M10 4L11.2 8.8L16 10L11.2 11.2L10 16L8.8 11.2L4 10L8.8 8.8Z" fill="white"/><circle cx="10" cy="10" r="2" fill="#9099A1"/></svg>
    );
    case 'Fairy': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Fairy</title><circle cx="10" cy="10" r="10" fill="#E87DBE"/><path d="M10 4L11 9L16 10L11 11L10 16L9 11L4 10L9 9Z" fill="white"/><path d="M10 7.5L10.5 9.5L12.5 10L10.5 10.5L10 12.5L9.5 10.5L7.5 10L9.5 9.5Z" fill="#E87DBE"/></svg>
    );
    case 'Dragon': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Dragon</title><circle cx="10" cy="10" r="10" fill="#7038F8"/><path d="M10 4L16 10L10 16L4 10Z" fill="white"/><path d="M10 7L13 10L10 13L7 10Z" fill="#7038F8"/></svg>
    );
    case 'Colorless': return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>Colorless</title><circle cx="10" cy="10" r="10" fill="#A0A0A0"/><path d="M10 4.5L11.5 8.5L16 8.5L12.5 11.5L13.5 15.5L10 13L6.5 15.5L7.5 11.5L4 8.5L8.5 8.5Z" fill="white"/></svg>
    );
    default: return (
      <svg width={s} height={s} viewBox="0 0 20 20"><title>{type}</title><circle cx="10" cy="10" r="10" fill="#C0C0C0"/><circle cx="10" cy="10" r="5" fill="white"/><circle cx="10" cy="10" r="3" fill="#C0C0C0"/></svg>
    );
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface CardDetailModalProps {
  card: TcgdexCard;
  onClose: () => void;
  onAdd?: () => void;
}

export default function CardDetailModal({ card, onClose, onAdd }: CardDetailModalProps) {
  const imageUrl = card.image ? `${card.image}/high.webp` : null;
  const isTrainer = card.category === 'Trainer';
  const isEnergy = card.category === 'Energy';
  const isPokemon = card.category === 'Pokemon';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const tcgPrice = card.pricing?.tcgplayer;
  const marketPrice = tcgPrice?.normal?.marketPrice ?? tcgPrice?.holofoil?.marketPrice ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgb(var(--text-primary))]/40 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/30 bg-card-white/95 shadow-2xl shadow-gold/10 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl p-2 text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/10 hover:text-[rgb(var(--text-primary))]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Card image */}
          <div className="relative overflow-hidden rounded-xl bg-card-cream" style={{ aspectRatio: '2.5/3.5' }}>
            {imageUrl ? (
              <Image src={imageUrl} alt={card.name} fill className="object-cover" sizes="350px" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Zap className="h-16 w-16 text-gold/30" />
              </div>
            )}
          </div>

          {/* Card info */}
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {/* Energy type badges for Pokemon */}
                {card.types?.map((t) => (
                  <span key={t} className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-[rgb(var(--text-secondary))]">
                    <EnergyIcon type={t} size={12} />
                    {t}
                  </span>
                ))}
                {/* Trainer subtype badge */}
                {(isTrainer || isEnergy) && (
                  <span className="rounded-full bg-seeker/10 px-2 py-0.5 text-[11px] font-semibold text-seeker">
                    {card.trainerType ?? card.energyType ?? card.category}
                  </span>
                )}
                {card.rarity && (
                  <span className="text-[11px] text-[rgb(var(--text-muted))]">{card.rarity}</span>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold text-[rgb(var(--text-primary))]">{card.name}</h2>
              <p className="mt-0.5 text-sm text-[rgb(var(--text-secondary))]">
                {isPokemon && card.hp && `HP ${card.hp}`}
                {isPokemon && card.stage && ` · ${card.stage}`}
                {isPokemon && card.evolveFrom && ` · Evolves from ${card.evolveFrom}`}
                {card.set?.name && ` · ${card.set.name}`}
                {card.localId && ` #${card.localId}`}
              </p>
            </div>

            {/* Pokédex flavor text — only for Pokemon */}
            {card.description && (
              <p className="text-sm leading-relaxed text-[rgb(var(--text-secondary))] italic">
                {card.description}
              </p>
            )}

            {/* Trainer / Energy effect — dedicated section */}
            {(isTrainer || isEnergy) && card.effect && (
              <div className="rounded-xl border border-seeker/20 bg-seeker/5 px-4 py-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-seeker">
                  {card.trainerType ?? card.energyType ?? 'Effect'}
                </p>
                <p className="text-sm leading-relaxed text-[rgb(var(--text-primary))]">{card.effect}</p>
              </div>
            )}

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Abilities</h4>
                {card.abilities.map((a, i) => (
                  <div key={i} className="rounded-xl border border-gold/15 bg-gold/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-seeker" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-seeker">{a.type}</span>
                      <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{a.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-[rgb(var(--text-secondary))]">{a.effect}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Attacks */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Attacks</h4>
                {card.attacks.map((a, i) => (
                  <div key={i} className="rounded-xl border border-gold/15 bg-card-cream/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Swords className="h-3.5 w-3.5 text-[rgb(var(--text-muted))]" />
                        <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{a.name}</span>
                      </div>
                      {a.damage && <span className="font-mono text-sm font-bold text-gold">{a.damage}</span>}
                    </div>
                    {a.cost && a.cost.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {a.cost.map((c, j) => <EnergyIcon key={j} type={c} />)}
                      </div>
                    )}
                    {a.effect && <p className="mt-1 text-xs text-[rgb(var(--text-secondary))]">{a.effect}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Weakness / Resistance / Retreat */}
            {(card.weaknesses?.length || card.resistances?.length || card.retreat != null) && (
              <div className="flex gap-2">
                {card.weaknesses && card.weaknesses.length > 0 && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Weakness</p>
                    <div className="flex items-center justify-center gap-1">
                      <EnergyIcon type={card.weaknesses[0].type} size={16} />
                      <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">{card.weaknesses[0].value}</span>
                    </div>
                  </div>
                )}
                {card.resistances && card.resistances.length > 0 && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Resistance</p>
                    <div className="flex items-center justify-center gap-1">
                      <EnergyIcon type={card.resistances[0].type} size={16} />
                      <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">{card.resistances[0].value}</span>
                    </div>
                  </div>
                )}
                {card.retreat != null && (
                  <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                    <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Retreat</p>
                    {card.retreat === 0 ? (
                      <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">Free</span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: card.retreat }).map((_, i) => (
                          <EnergyIcon key={i} type="Colorless" size={16} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            {marketPrice != null && (
              <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-center">
                <p className="text-[10px] text-[rgb(var(--text-muted))]">TCGPlayer Market</p>
                <p className="font-mono text-xl font-bold text-gold">${marketPrice.toFixed(2)}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {onAdd && (
                <button onClick={onAdd} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold to-gold-dark py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
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

'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, ExternalLink, Zap } from 'lucide-react';
import type { TcgdexCard } from '@/lib/ingestion';

// ─── Energy Icons ─────────────────────────────────────────────────────────────

function EnergyIcon({ type, size = 20 }: { type: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/energy/${type.toLowerCase()}.png`}
      alt={type}
      title={type}
      width={size}
      height={size}
      style={{ display: 'inline-block', flexShrink: 0 }}
    />
  );
}

// ─── Series helper ────────────────────────────────────────────────────────────

function getSeriesName(setId: string): string {
  const id = setId.toLowerCase();
  if (id.startsWith('me'))    return 'Mega Evolution';
  if (id.startsWith('sv'))    return 'Scarlet & Violet';
  if (id.startsWith('swsh'))  return 'Sword & Shield';
  if (id.startsWith('sm'))    return 'Sun & Moon';
  if (id.startsWith('xy'))    return 'XY';
  if (id.startsWith('bw'))    return 'Black & White';
  if (id.startsWith('hgss'))  return 'HeartGold SoulSilver';
  if (id.startsWith('dp'))    return 'Diamond & Pearl';
  if (id.startsWith('ex'))    return 'EX Era';
  if (id.startsWith('rs'))    return 'Ruby & Sapphire';
  if (id.startsWith('ecard')) return 'e-Card';
  if (id.startsWith('lc'))    return 'Legendary Collection';
  if (id.startsWith('neo'))   return 'Neo';
  if (id.startsWith('gym'))   return 'Gym';
  if (id.startsWith('base'))  return 'Base';
  return '';
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
            {(isTrainer || isEnergy) && (
              <div className="rounded-xl border border-seeker/20 bg-seeker/5 px-4 py-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-seeker">
                  {card.trainerType ?? card.energyType ?? 'Effect'}
                </p>
                {card.effect ? (
                  <p className="text-sm leading-relaxed text-[rgb(var(--text-primary))]">{card.effect}</p>
                ) : (
                  <p className="text-sm italic text-[rgb(var(--text-muted))]">Effect text not available for this card.</p>
                )}
              </div>
            )}

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">Abilities</h4>
                {card.abilities.map((a, i) => (
                  <div key={i} className="rounded-xl border border-gold/15 bg-gold/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-red-500">{a.type}</span>
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
                      <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{a.name}</span>
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

            {/* Weakness / Resistance / Retreat — always shown for Pokemon */}
            {isPokemon && (
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                  <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Weakness</p>
                  {card.weaknesses && card.weaknesses.length > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <EnergyIcon type={card.weaknesses[0].type} size={16} />
                      <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">{card.weaknesses[0].value}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[rgb(var(--text-muted))]">—</span>
                  )}
                </div>
                <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                  <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Resistance</p>
                  {card.resistances && card.resistances.length > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <EnergyIcon type={card.resistances[0].type} size={16} />
                      <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">{card.resistances[0].value}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[rgb(var(--text-muted))]">—</span>
                  )}
                </div>
                <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 px-3 py-2 text-center">
                  <p className="mb-1 text-[10px] text-[rgb(var(--text-muted))]">Retreat</p>
                  {card.retreat == null ? (
                    <span className="text-xs text-[rgb(var(--text-muted))]">—</span>
                  ) : card.retreat === 0 ? (
                    <span className="text-xs font-semibold text-[rgb(var(--text-primary))]">Free</span>
                  ) : (
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: card.retreat }).map((_, i) => (
                        <EnergyIcon key={i} type="Colorless" size={16} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card info grid — shown for all card types */}
            {(() => {
              const number = card.set?.cardCount?.official
                ? `${card.localId}/${card.set.cardCount.official}`
                : String(card.localId);
              const series = getSeriesName(card.set?.id ?? '');
              const rows: [string, string][] = [
                ['Artist',    card.illustrator ?? '—'],
                ['Rarity',    card.rarity ?? '—'],
                ['Language',  'English'],
                ['Number',    number],
                ['Expansion', card.set?.name ?? '—'],
                ['Series',    series || '—'],
              ];
              return (
                <div className="rounded-xl border border-gold/15 bg-card-cream/30 px-4 py-3">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {rows.map(([label, value]) => (
                      <div key={label} className="flex flex-col">
                        <dt className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">{label}</dt>
                        <dd className="text-xs text-[rgb(var(--text-primary))]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })()}

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

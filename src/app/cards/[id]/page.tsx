import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Swords, Zap, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { fetchCard } from '@/lib/ingestion';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await fetchCard(params.id);
  if (!result.data) return { title: 'Card Not Found' };
  return {
    title: result.data.name,
    description: result.data.description ?? `${result.data.name} — Pokémon TCG card`,
  };
}

export default async function CardDetailPage({ params }: Props) {
  const result = await fetchCard(params.id);

  if (!result.data) notFound();

  const card = result.data;
  const imageUrl = card.image ? `${card.image}/high.webp` : null;
  const tcgPrice = card.pricing?.tcgplayer;
  const marketPrice =
    tcgPrice?.normal?.marketPrice ?? tcgPrice?.holofoil?.marketPrice ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Back link */}
        <Link
          href="/cards"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--text-muted))] transition-colors hover:text-[rgb(var(--text-primary))]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cards
        </Link>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* Card image */}
          <div className="space-y-4">
            <div
              className="relative overflow-hidden rounded-2xl border border-gold/30 bg-card-cream shadow-lg shadow-gold/10"
              style={{ aspectRatio: '2.5/3.5' }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Zap className="h-16 w-16 text-gold/30" />
                </div>
              )}
            </div>

            {/* Price */}
            {marketPrice != null && (
              <div className="rounded-2xl border border-gold/30 bg-card-white/85 p-4 text-center backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Market Price
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-gold">
                  ${marketPrice.toFixed(2)}
                </p>
                <p className="text-[11px] text-[rgb(var(--text-muted))]">TCGPlayer</p>
              </div>
            )}

            {/* External link */}
            <a
              href={`https://tcgdex.net/en/cards/${card.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/30 px-4 py-2.5 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-gold/5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on TCGdex
            </a>
          </div>

          {/* Card info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {card.types?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gold/20 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-[rgb(var(--text-secondary))]"
                  >
                    {t}
                  </span>
                ))}
                {card.category && (
                  <span className="rounded-full border border-seeker/20 bg-seeker/10 px-3 py-0.5 text-xs font-semibold text-seeker">
                    {card.category}
                  </span>
                )}
                {card.rarity && (
                  <span className="text-xs text-[rgb(var(--text-muted))]">{card.rarity}</span>
                )}
              </div>

              <h1 className="font-display text-3xl font-bold text-[rgb(var(--text-primary))]">
                {card.name}
              </h1>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-[rgb(var(--text-muted))]">
                {card.hp && <span>HP {card.hp}</span>}
                {card.stage && <span>{card.stage}</span>}
                {card.evolveFrom && <span>Evolves from {card.evolveFrom}</span>}
                {card.set?.name && (
                  <span>{card.set.name} · #{card.localId}</span>
                )}
                {card.regulationMark && <span>Regulation {card.regulationMark}</span>}
              </div>

              {card.description && (
                <p className="mt-4 text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
                  {card.description}
                </p>
              )}
            </div>

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Abilities
                </h2>
                <div className="space-y-3">
                  {card.abilities.map((a, i) => (
                    <div key={i} className="rounded-xl border border-gold/15 bg-gold/5 p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-seeker" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-seeker">
                          {a.type}
                        </span>
                        <span className="font-semibold text-[rgb(var(--text-primary))]">
                          {a.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-[rgb(var(--text-secondary))]">{a.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attacks */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Attacks
                </h2>
                <div className="space-y-3">
                  {card.attacks.map((a, i) => (
                    <div key={i} className="rounded-xl border border-gold/15 bg-card-cream/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Swords className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                          <span className="font-semibold text-[rgb(var(--text-primary))]">
                            {a.name}
                          </span>
                        </div>
                        {a.damage && (
                          <span className="font-mono text-lg font-bold text-gold">{a.damage}</span>
                        )}
                      </div>
                      {a.cost && a.cost.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {a.cost.map((c, j) => (
                            <span
                              key={j}
                              className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-[rgb(var(--text-secondary))]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {a.effect && (
                        <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">{a.effect}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weakness / Resistance / Retreat */}
            {(card.weaknesses?.length || card.resistances?.length || card.retreat != null) && (
              <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  Battle Stats
                </h2>
                <div className="flex gap-3">
                  {card.weaknesses && card.weaknesses.length > 0 && (
                    <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 p-3 text-center">
                      <p className="text-[10px] text-[rgb(var(--text-muted))]">Weakness</p>
                      <p className="mt-0.5 font-semibold text-[rgb(var(--text-primary))]">
                        {card.weaknesses[0].type} {card.weaknesses[0].value}
                      </p>
                    </div>
                  )}
                  {card.resistances && card.resistances.length > 0 && (
                    <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 p-3 text-center">
                      <p className="text-[10px] text-[rgb(var(--text-muted))]">Resistance</p>
                      <p className="mt-0.5 font-semibold text-[rgb(var(--text-primary))]">
                        {card.resistances[0].type} {card.resistances[0].value}
                      </p>
                    </div>
                  )}
                  {card.retreat != null && (
                    <div className="flex-1 rounded-xl border border-gold/15 bg-card-cream/50 p-3 text-center">
                      <p className="text-[10px] text-[rgb(var(--text-muted))]">Retreat</p>
                      <p className="mt-0.5 font-semibold text-[rgb(var(--text-primary))]">
                        {card.retreat}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trainer/Energy effect */}
            {card.effect && !card.attacks?.length && (
              <div className="rounded-2xl border border-gold/20 bg-card-white/85 p-6 backdrop-blur-sm">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
                  {card.trainerType ?? card.energyType ?? 'Effect'}
                </h2>
                <p className="text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
                  {card.effect}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

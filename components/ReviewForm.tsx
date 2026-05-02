'use client';

import * as React from 'react';
import { Star, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = React.useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-1" role="group" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-100 active:scale-90"
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-8 w-8 transition-colors duration-100 ${
              star <= active
                ? 'fill-brand-gold text-brand-gold'
                : 'fill-transparent text-ink/25'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const LABELS = ['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !'];

export default function ReviewForm() {
  const [rating, setRating] = React.useState(0);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Veuillez choisir une note.'); return; }
    if (!name.trim()) { setError('Veuillez indiquer votre prénom.'); return; }
    if (comment.trim().length < 10) { setError('Le commentaire doit faire au moins 10 caractères.'); return; }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSuccess(true);
    } catch {
      setError('Une erreur est survenue. Réessayez ou contactez-nous directement.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="bg-white section-pad">
        <div className="container-tight">
          <div className="mx-auto max-w-lg rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center fancy-shadow">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 font-display text-xl font-bold text-brand">Merci pour votre avis !</h3>
            <p className="mt-2 text-sm text-ink/65">
              Il sera examiné et publié prochainement. Votre retour compte beaucoup pour nous.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="laisser-avis" className="bg-white section-pad">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">
              Votre expérience compte
            </h2>
            <p className="mt-3 text-base text-ink/65">
              Partagez votre trajet avec TKA driver. Votre avis aide d'autres clients à nous choisir.
            </p>
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl border border-brand/10 bg-white p-6 fancy-shadow sm:p-8"
          >
            {/* Star rating */}
            <div className="flex flex-col items-center gap-3">
              <StarRating value={rating} onChange={setRating} />
              <p className={`text-sm font-semibold transition-all duration-150 ${rating ? 'text-brand-gold' : 'text-ink/30'}`}>
                {LABELS[rating] || 'Touchez une étoile'}
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="review-name">Votre prénom *</Label>
                  <Input
                    id="review-name"
                    placeholder="Ex. Sophie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="review-email">Email (optionnel)</Label>
                  <Input
                    id="review-email"
                    type="email"
                    placeholder="Pour vous répondre si besoin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="review-comment">Votre avis *</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Décrivez votre expérience : ponctualité, confort, professionnalisme…"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button type="submit" size="xl" disabled={loading} className="w-full">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
                ) : (
                  'Publier mon avis'
                )}
              </Button>

              <p className="text-center text-xs text-ink/40">
                Les avis sont modérés avant publication. Aucune donnée n'est revendue.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

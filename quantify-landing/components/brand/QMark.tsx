/**
 * QMark — Composant logo canonique de Quantify
 *
 * SOURCE DE VÉRITÉ du Q-mark. Ne jamais redessiner le Q ailleurs.
 * Toujours importer ce composant pour afficher le logo.
 *
 * Usage :
 *   <QMark size={48} />
 *   <QMark size={90} variant="white" />
 *   <QMark size={28} variant="mono" />
 */

import React, { useId } from 'react';

export type QMarkVariant = 'gradient' | 'white' | 'dark' | 'mono';

export interface QMarkProps {
  /** Taille en pixels (largeur = hauteur). Valeurs recommandées : 16, 24, 28, 48, 64, 90 */
  size?: number;
  /** Variante de rendu */
  variant?: QMarkVariant;
  /** Classe CSS additionnelle */
  className?: string;
  /** Aria-label pour l'accessibilité */
  ariaLabel?: string;
}

// ── Paths SVG exacts — NE PAS MODIFIER ─────────────────────────
// Le Q est construit dans un espace 100×100, cropé via viewBox="6 8 88 88"
// Cercle (lentille loupe) : arc presque complet, ouverture en bas à droite
// Manche : ligne diagonale depuis la sortie du cercle
const Q_CIRCLE = "M 59.2,72.4 A 27,27 0 1,1 40.8,72.4";
const Q_HANDLE_X1 = 59.2, Q_HANDLE_Y1 = 72.4;
const Q_HANDLE_X2 = 72,   Q_HANDLE_Y2 = 83;
const Q_STROKE_WIDTH = 9.5;
const Q_VIEWBOX = "6 8 88 88";

// ── Couleurs par variante ───────────────────────────────────────
const GRADIENT_START = '#FF8C42';
const GRADIENT_END   = '#E04400';
const WHITE          = '#FFFFFF';
const MONO           = '#1A1A1A';

// Rendu SVG sans hooks pour être utilisable dans des générateurs d'images comme next/og.
export interface QMarkGlyphProps {
  size?: number;
  strokeColor?: string;
  gradientId?: string;
  className?: string;
  ariaLabel?: string;
}

export const QMarkGlyph: React.FC<QMarkGlyphProps> = ({
  size = 48,
  strokeColor = MONO,
  gradientId,
  className,
  ariaLabel = 'Quantify',
}) => (
  <svg
    viewBox={Q_VIEWBOX}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-label={ariaLabel}
    role="img"
    className={className}
    style={{ display: 'block', flexShrink: 0 }}
  >
    {gradientId && (
      <defs>
        <linearGradient id={gradientId} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor={GRADIENT_START} />
          <stop offset="100%" stopColor={GRADIENT_END} />
        </linearGradient>
      </defs>
    )}
    <path
      d={Q_CIRCLE}
      fill="none"
      stroke={strokeColor}
      strokeWidth={Q_STROKE_WIDTH}
      strokeLinecap="round"
    />
    <line
      x1={Q_HANDLE_X1}
      y1={Q_HANDLE_Y1}
      x2={Q_HANDLE_X2}
      y2={Q_HANDLE_Y2}
      stroke={strokeColor}
      strokeWidth={Q_STROKE_WIDTH}
      strokeLinecap="round"
    />
  </svg>
)

// ── Composant ──────────────────────────────────────────────────
export const QMark: React.FC<QMarkProps> = ({
  size = 48,
  variant = 'gradient',
  className,
  ariaLabel = 'Quantify',
}) => {
  // useId évite les collisions d'ID SVG quand plusieurs QMark sont sur la même page
  const uid = useId().replace(/:/g, '')
  const gradId = `qGrad-${uid}`

  const strokeColor =
    variant === 'gradient' ? `url(#${gradId})` :
    variant === 'white' ? WHITE :
    MONO

  return (
    <QMarkGlyph
      size={size}
      strokeColor={strokeColor}
      gradientId={variant === 'gradient' ? gradId : undefined}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
};

// ── Wordmark (icône + texte "Quantify") ────────────────────────
export interface QWordmarkProps {
  /** Hauteur du wordmark en pixels. Largeur proportionnelle (~4.4×). Min : 120px */
  height?: number;
  /** Variante de l'icône */
  variant?: QMarkVariant;
  className?: string;
}

export const QWordmark: React.FC<QWordmarkProps> = ({
  height = 65,
  variant = 'gradient',
  className,
}) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `qWmGrad-${uid}`;

  const strokeValue =
    variant === 'gradient' ? `url(#${gradId})` :
    variant === 'white'    ? WHITE : MONO;

  // Le "Q" du texte reprend toujours la couleur de l'icône
  const qTextColor =
    variant === 'gradient' ? GRADIENT_END :
    variant === 'white'    ? WHITE : MONO;

  const wordmarkTextColor =
    variant === 'white' ? WHITE :
    variant === 'mono' || variant === 'dark' ? MONO : '#12263A';

  const width = Math.round(height * 4.4);

  return (
    <svg
      viewBox="0 0 310 70"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quantify"
      role="img"
      className={className}
      style={{ display: 'block' }}
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradId} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%"   stopColor={GRADIENT_START} />
            <stop offset="100%" stopColor={GRADIENT_END}   />
          </linearGradient>
        </defs>
      )}

      {/* Icône Q (scalée à 65% dans l'espace du wordmark) */}
      <g transform="translate(2,2) scale(0.65)">
        <path
          d={Q_CIRCLE}
          fill="none"
          stroke={strokeValue}
          strokeWidth={Q_STROKE_WIDTH}
          strokeLinecap="round"
        />
        <line
          x1={Q_HANDLE_X1} y1={Q_HANDLE_Y1}
          x2={Q_HANDLE_X2} y2={Q_HANDLE_Y2}
          stroke={strokeValue}
          strokeWidth={Q_STROKE_WIDTH}
          strokeLinecap="round"
        />
      </g>

      {/* Texte "Quantify" */}
      <text
        x="72"
        y="47"
        fontFamily="'Poppins', 'Inter ExtraBold', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="42"
        letterSpacing="-1"
        fill={wordmarkTextColor}
      >
        <tspan fill={qTextColor}>Q</tspan>uantify
      </text>
    </svg>
  );
};

// ── AppIcon (conteneur carré arrondi + Q blanc) ────────────────
export interface QAppIconProps {
  size?: number;
  /** 'orange' = fond #FF6B35, 'dark' = fond #1A3550 */
  bg?: 'orange' | 'dark';
  className?: string;
}

export const QAppIcon: React.FC<QAppIconProps> = ({
  size = 60,
  bg = 'orange',
  className,
}) => {
  const bgColor  = bg === 'orange' ? '#FF6B35' : '#1A3550';
  const iconSize = Math.round(size * 0.67);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '24%',
        background: bgColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <QMark
        size={iconSize}
        variant={bg === 'dark' ? 'gradient' : 'white'}
      />
    </div>
  );
};

export default QMark;

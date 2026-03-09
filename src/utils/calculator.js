export const SURFACE_TYPE_MULTIPLIERS = {
  'drywall-repaint': { label: 'Drywall (repaint)', multiplier: 1.0 },
  'drywall-new': { label: 'Drywall (new/unpainted)', multiplier: 1.15 },
  'smooth-wood': { label: 'Smooth wood', multiplier: 1.1 },
  'rough-wood': { label: 'Rough wood', multiplier: 1.3 },
  'brick': { label: 'Brick', multiplier: 1.5 },
  'cinder-block': { label: 'Cinder block', multiplier: 1.6 },
};

export const TEXTURE_MULTIPLIERS = {
  'smooth': { label: 'Smooth', multiplier: 1.0 },
  'orange-peel': { label: 'Orange peel', multiplier: 1.15 },
  'heavy-texture': { label: 'Heavy texture', multiplier: 1.35 },
};

export const SHEEN_MULTIPLIERS = {
  'flat': { label: 'Flat', multiplier: 1.0 },
  'eggshell': { label: 'Eggshell', multiplier: 1.02 },
  'satin': { label: 'Satin', multiplier: 1.05 },
  'semi-gloss': { label: 'Semi-gloss', multiplier: 1.08 },
  'gloss': { label: 'Gloss', multiplier: 1.1 },
};

export const COLOR_CHANGE_MULTIPLIERS = {
  'same': { label: 'Same/similar color', multiplier: 1.0 },
  'moderate': { label: 'Moderate change', multiplier: 1.15 },
  'dramatic': { label: 'Dramatic change (e.g. dark to light)', multiplier: 1.3 },
};

function roundToQuarts(gallons) {
  const whole = Math.ceil(gallons);
  const remainder = whole - gallons;
  if (remainder > 0 && remainder <= 0.25) {
    return {
      gallons: whole - 1,
      quarts: Math.ceil(remainder * 4),
      rounded: whole,
    };
  }
  return { gallons: whole, quarts: 0, rounded: whole };
}

export function calculate(inputs) {
  const {
    squareFootage,
    surfaceType,
    texture,
    sheen,
    coats,
    primerNeeded,
    colorChange,
    overageBuffer,
  } = inputs;

  const sqFt = parseFloat(squareFootage);
  const buffer = parseFloat(overageBuffer) || 15;
  const numCoats = parseInt(coats, 10);

  const surfaceMultiplier = SURFACE_TYPE_MULTIPLIERS[surfaceType]?.multiplier ?? 1.0;
  const textureMultiplier = TEXTURE_MULTIPLIERS[texture]?.multiplier ?? 1.0;
  const sheenMultiplier = SHEEN_MULTIPLIERS[sheen]?.multiplier ?? 1.0;
  const colorMultiplier = COLOR_CHANGE_MULTIPLIERS[colorChange]?.multiplier ?? 1.0;

  // Step 5
  const adjustedSqFt = sqFt * surfaceMultiplier * textureMultiplier * sheenMultiplier * colorMultiplier;

  // Step 6
  const gallonsPerCoat = adjustedSqFt / 350;

  // Step 7
  const totalGallons = gallonsPerCoat * numCoats;

  // Step 8
  const finalGallons = totalGallons * (1 + buffer / 100);

  // Step 9
  const paint = roundToQuarts(finalGallons);

  // Step 10 — Primer
  let primer = null;
  if (primerNeeded) {
    const primerAdjustedSqFt = sqFt * surfaceMultiplier;
    const primerGallonsRaw = primerAdjustedSqFt / 300;
    const primerFinal = primerGallonsRaw * (1 + buffer / 100);
    primer = roundToQuarts(primerFinal);
  }

  return {
    steps: {
      rawSqFt: sqFt,
      surfaceMultiplier,
      textureMultiplier,
      sheenMultiplier,
      colorMultiplier,
      adjustedSqFt,
      gallonsPerCoat,
      totalGallons,
      bufferPercent: buffer,
      finalGallons,
    },
    paint,
    primer,
  };
}

export function getWarnings(inputs) {
  const warnings = [];
  const { colorChange, coats, isNewSurface, primerNeeded } = inputs;

  if (colorChange === 'dramatic' && parseInt(coats, 10) === 1) {
    warnings.push({
      id: 'dramatic-one-coat',
      message: 'Dramatic color changes typically require at least 2 coats. Consider updating your coat count.',
    });
  }

  if (isNewSurface && !primerNeeded) {
    warnings.push({
      id: 'new-surface-no-primer',
      message: 'New surfaces typically require primer for proper adhesion and an even finish.',
    });
  }

  return warnings;
}

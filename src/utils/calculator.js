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

// Existing wall sheen — affects how well new paint absorbs and adheres.
// Glossier existing surfaces are less porous and slightly less receptive, requiring
// more paint to achieve even coverage (and often deglossing before painting).
export const EXISTING_SHEEN_MULTIPLIERS = {
  'flat': { label: 'Flat / Matte', multiplier: 1.0 },
  'eggshell': { label: 'Eggshell', multiplier: 1.02 },
  'satin': { label: 'Satin', multiplier: 1.05 },
  'semi-gloss': { label: 'Semi-gloss', multiplier: 1.08 },
  'gloss': { label: 'Gloss', multiplier: 1.12 },
};

// New paint sheen — affects coverage rate. Glossier paints contain more binder and
// less pigment per gallon, producing a thicker film that covers fewer square feet.
// Range is intentionally wider than the old single-sheen table (1.0 → 1.20).
export const PAINT_SHEEN_MULTIPLIERS = {
  'flat': { label: 'Flat / Matte', multiplier: 1.0 },
  'eggshell': { label: 'Eggshell', multiplier: 1.05 },
  'satin': { label: 'Satin', multiplier: 1.10 },
  'semi-gloss': { label: 'Semi-gloss', multiplier: 1.15 },
  'gloss': { label: 'Gloss', multiplier: 1.20 },
};

export const COLOR_CHANGE_MULTIPLIERS = {
  'same': { label: 'Same / similar color', multiplier: 1.0 },
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
    existingSheen,
    paintSheen,
    coats,
    primerNeeded,
    colorChange,
    overageBuffer,
    isNewSurface,
    // ceiling
    includeCeiling,
    ceilingTexture,
    additionalCeilingSqFt,
  } = inputs;

  const wallSqFt = parseFloat(squareFootage);
  const buffer = parseFloat(overageBuffer) || 15;
  const numCoats = parseInt(coats, 10);

  const surfaceMultiplier = SURFACE_TYPE_MULTIPLIERS[surfaceType]?.multiplier ?? 1.0;
  const textureMultiplier = TEXTURE_MULTIPLIERS[texture]?.multiplier ?? 1.0;
  const existingSheenMultiplier = EXISTING_SHEEN_MULTIPLIERS[existingSheen]?.multiplier ?? 1.0;
  const paintSheenMultiplier = PAINT_SHEEN_MULTIPLIERS[paintSheen]?.multiplier ?? 1.0;
  const colorMultiplier = COLOR_CHANGE_MULTIPLIERS[colorChange]?.multiplier ?? 1.0;

  // Adjusted sq ft incorporates all surface & paint characteristics
  const adjustedSqFt =
    wallSqFt *
    surfaceMultiplier *
    textureMultiplier *
    existingSheenMultiplier *
    paintSheenMultiplier *
    colorMultiplier;

  const gallonsPerCoat = adjustedSqFt / 350;
  const totalGallons = gallonsPerCoat * numCoats;
  const finalGallons = totalGallons * (1 + buffer / 100);
  const paint = roundToQuarts(finalGallons);

  // Primer — uses surface multiplier + texture multiplier only.
  // Sheen and color change don't affect primer coverage.
  let primer = null;
  if (primerNeeded) {
    const primerAdjustedSqFt = wallSqFt * surfaceMultiplier * textureMultiplier;
    const primerFinal = (primerAdjustedSqFt / 300) * (1 + buffer / 100);
    primer = roundToQuarts(primerFinal);
  }

  // Ceiling — always flat sheen (multiplier 1.0).
  // Base sq footage = wall sq footage (common single-room estimate).
  // Surface type = drywall-repaint or drywall-new based on isNewSurface.
  // Color change applied because users may be changing ceiling color too.
  let ceiling = null;
  let ceilingSteps = null;
  if (includeCeiling) {
    const addlSqFt = parseFloat(additionalCeilingSqFt) || 0;
    const ceilingSqFt = wallSqFt + addlSqFt;
    const ceilingSurfaceMultiplier = isNewSurface
      ? SURFACE_TYPE_MULTIPLIERS['drywall-new'].multiplier
      : SURFACE_TYPE_MULTIPLIERS['drywall-repaint'].multiplier;
    const ceilingTextureMultiplier = TEXTURE_MULTIPLIERS[ceilingTexture]?.multiplier ?? 1.0;
    // Ceiling paint is always flat → paintSheenMultiplier = 1.0
    // Existing ceiling sheen also assumed flat → existingSheenMultiplier = 1.0
    const adjustedCeilingSqFt =
      ceilingSqFt * ceilingSurfaceMultiplier * ceilingTextureMultiplier * colorMultiplier;
    const ceilingGallonsPerCoat = adjustedCeilingSqFt / 350;
    const ceilingTotalGallons = ceilingGallonsPerCoat * numCoats;
    const ceilingFinalGallons = ceilingTotalGallons * (1 + buffer / 100);
    ceiling = roundToQuarts(ceilingFinalGallons);
    ceilingSteps = {
      baseSqFt: wallSqFt,
      addlSqFt,
      totalSqFt: ceilingSqFt,
      ceilingSurfaceMultiplier,
      ceilingTextureMultiplier,
      colorMultiplier,
      adjustedCeilingSqFt,
      ceilingGallonsPerCoat,
      ceilingTotalGallons,
      ceilingFinalGallons,
    };
  }

  return {
    steps: {
      rawSqFt: wallSqFt,
      surfaceMultiplier,
      textureMultiplier,
      existingSheenMultiplier,
      paintSheenMultiplier,
      colorMultiplier,
      adjustedSqFt,
      gallonsPerCoat,
      totalGallons,
      bufferPercent: buffer,
      finalGallons,
    },
    paint,
    primer,
    ceiling,
    ceilingSteps,
  };
}

export function getWarnings(inputs) {
  const warnings = [];
  const { colorChange, coats, isNewSurface, primerNeeded, existingSheen, paintSheen } = inputs;

  if (colorChange === 'dramatic' && parseInt(coats, 10) === 1) {
    warnings.push({
      id: 'dramatic-one-coat',
      message:
        'Dramatic color changes typically require at least 2 coats. Consider updating your coat count.',
    });
  }

  if (isNewSurface && !primerNeeded) {
    warnings.push({
      id: 'new-surface-no-primer',
      message: 'New surfaces typically require primer for proper adhesion and an even finish.',
    });
  }

  if ((existingSheen === 'semi-gloss' || existingSheen === 'gloss') && !primerNeeded) {
    warnings.push({
      id: 'glossy-existing-no-primer',
      message:
        `Painting over ${existingSheen} surfaces usually requires deglossing (sanding or liquid deglosser) and a bonding primer for proper adhesion.`,
    });
  }

  if (existingSheen === 'gloss' && (paintSheen === 'flat' || paintSheen === 'eggshell')) {
    warnings.push({
      id: 'gloss-to-flat',
      message:
        'Transitioning from gloss to a flat or eggshell finish can result in uneven sheen. Ensure the surface is thoroughly deglossed before applying.',
    });
  }

  return warnings;
}

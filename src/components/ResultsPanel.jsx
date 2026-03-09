import { useState } from 'react';
import {
  SURFACE_TYPE_MULTIPLIERS,
  TEXTURE_MULTIPLIERS,
  EXISTING_SHEEN_MULTIPLIERS,
  PAINT_SHEEN_MULTIPLIERS,
  COLOR_CHANGE_MULTIPLIERS,
} from '../utils/calculator';

function GallonDisplay({ label, gallons, quarts, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      {sub && <p className="mb-1 text-xs text-slate-400">{sub}</p>}
      <p className="text-3xl font-bold text-slate-800">
        {gallons > 0 && (
          <span>
            {gallons} <span className="text-lg font-medium text-slate-500">gal</span>
          </span>
        )}
        {gallons > 0 && quarts > 0 && (
          <span className="text-slate-400 text-xl mx-2">+</span>
        )}
        {quarts > 0 && (
          <span>
            {quarts} <span className="text-lg font-medium text-slate-500">qt</span>
          </span>
        )}
        {gallons === 0 && quarts === 0 && (
          <span className="text-slate-400 text-2xl">—</span>
        )}
      </p>
    </div>
  );
}

function StepRow({ step, value, highlight }) {
  return (
    <tr className={highlight ? 'bg-blue-50' : undefined}>
      <td className="py-2 pr-4 text-sm text-slate-600">{step}</td>
      <td className="py-2 text-right text-sm font-medium text-slate-800 whitespace-nowrap">{value}</td>
    </tr>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}

function galStr(g) {
  return g.quarts > 0 ? `${g.gallons} gal + ${g.quarts} qt` : `${g.gallons} gal`;
}

export default function ResultsPanel({ result, inputs, onReset }) {
  const [expanded, setExpanded] = useState(false);

  const { steps, paint, primer, ceiling, ceilingSteps } = result;

  const surfaceLabel = SURFACE_TYPE_MULTIPLIERS[inputs.surfaceType]?.label ?? inputs.surfaceType;
  const textureLabel = TEXTURE_MULTIPLIERS[inputs.texture]?.label ?? inputs.texture;
  const existingSheenLabel = EXISTING_SHEEN_MULTIPLIERS[inputs.existingSheen]?.label ?? inputs.existingSheen;
  const paintSheenLabel = PAINT_SHEEN_MULTIPLIERS[inputs.paintSheen]?.label ?? inputs.paintSheen;
  const colorLabel = COLOR_CHANGE_MULTIPLIERS[inputs.colorChange]?.label ?? inputs.colorChange;
  const ceilingTextureLabel = TEXTURE_MULTIPLIERS[inputs.ceilingTexture]?.label ?? inputs.ceilingTexture;

  // How many result cards to show
  const cards = [
    { key: 'paint', label: 'Wall Paint', data: paint },
    ceiling ? { key: 'ceiling', label: 'Ceiling Paint', sub: 'Always flat', data: ceiling } : null,
    primer ? { key: 'primer', label: 'Primer', data: primer } : null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Your Estimate</h2>

      {/* Main result cards */}
      <div className={`grid gap-4 mb-5 ${cards.length === 1 ? '' : cards.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {cards.map((c) => (
          <GallonDisplay
            key={c.key}
            label={c.label}
            sub={c.sub}
            gallons={c.data.gallons}
            quarts={c.data.quarts}
          />
        ))}
        {!primer && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
            <p className="text-sm text-slate-400">No primer required</p>
          </div>
        )}
      </div>

      {/* Touch-up note */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <span className="mt-0.5 text-blue-500" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </span>
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Consider saving 1 quart for future touch-ups.
        </p>
      </div>

      {/* Expandable breakdown */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          aria-expanded={expanded}
        >
          <span>Step-by-step breakdown</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {expanded && (
          <div className="border-t border-slate-200 px-4 pb-4">

            {/* Wall paint breakdown */}
            <SectionLabel>Wall Paint</SectionLabel>
            <table className="w-full">
              <tbody>
                <StepRow step="Raw wall sq footage" value={`${steps.rawSqFt.toLocaleString()} sq ft`} />
                <StepRow step={`Surface type (${surfaceLabel})`} value={`× ${steps.surfaceMultiplier.toFixed(2)}`} />
                <StepRow step={`Wall texture (${textureLabel})`} value={`× ${steps.textureMultiplier.toFixed(2)}`} />
                <StepRow step={`Existing wall sheen (${existingSheenLabel})`} value={`× ${steps.existingSheenMultiplier.toFixed(2)}`} />
                <StepRow step={`New paint sheen (${paintSheenLabel})`} value={`× ${steps.paintSheenMultiplier.toFixed(2)}`} />
                <StepRow step={`Color change (${colorLabel})`} value={`× ${steps.colorMultiplier.toFixed(2)}`} />
                <StepRow step="Adjusted sq footage" value={`${steps.adjustedSqFt.toFixed(1)} sq ft`} highlight />
                <StepRow step="Coverage rate" value="350 sq ft / gal" />
                <StepRow step="Gallons per coat" value={`${steps.gallonsPerCoat.toFixed(2)} gal`} />
                <StepRow step={`× ${inputs.coats} coat${inputs.coats > 1 ? 's' : ''}`} value={`${steps.totalGallons.toFixed(2)} gal`} />
                <StepRow step={`Overage buffer (+${steps.bufferPercent}%)`} value={`${steps.finalGallons.toFixed(2)} gal`} highlight />
                <StepRow step="Rounded to purchasable units" value={galStr(paint)} highlight />
              </tbody>
            </table>

            {/* Ceiling breakdown */}
            {ceiling && ceilingSteps && (
              <>
                <SectionLabel>Ceiling Paint</SectionLabel>
                <table className="w-full">
                  <tbody>
                    <StepRow step="Base sq footage (= wall input)" value={`${ceilingSteps.baseSqFt.toLocaleString()} sq ft`} />
                    {ceilingSteps.addlSqFt > 0 && (
                      <StepRow step="Additional ceiling sq ft" value={`+ ${ceilingSteps.addlSqFt.toLocaleString()} sq ft`} />
                    )}
                    <StepRow step="Total ceiling sq footage" value={`${ceilingSteps.totalSqFt.toLocaleString()} sq ft`} highlight />
                    <StepRow
                      step={`Surface type (${inputs.isNewSurface ? 'Drywall new' : 'Drywall repaint'})`}
                      value={`× ${ceilingSteps.ceilingSurfaceMultiplier.toFixed(2)}`}
                    />
                    <StepRow step={`Ceiling texture (${ceilingTextureLabel})`} value={`× ${ceilingSteps.ceilingTextureMultiplier.toFixed(2)}`} />
                    <StepRow step="Paint sheen (always flat)" value="× 1.00" />
                    <StepRow step={`Color change (${colorLabel})`} value={`× ${ceilingSteps.colorMultiplier.toFixed(2)}`} />
                    <StepRow step="Adjusted sq footage" value={`${ceilingSteps.adjustedCeilingSqFt.toFixed(1)} sq ft`} highlight />
                    <StepRow step="Coverage rate" value="350 sq ft / gal" />
                    <StepRow step="Gallons per coat" value={`${ceilingSteps.ceilingGallonsPerCoat.toFixed(2)} gal`} />
                    <StepRow step={`× ${inputs.coats} coat${inputs.coats > 1 ? 's' : ''}`} value={`${ceilingSteps.ceilingTotalGallons.toFixed(2)} gal`} />
                    <StepRow step={`Overage buffer (+${steps.bufferPercent}%)`} value={`${ceilingSteps.ceilingFinalGallons.toFixed(2)} gal`} highlight />
                    <StepRow step="Rounded to purchasable units" value={galStr(ceiling)} highlight />
                  </tbody>
                </table>
              </>
            )}

            {/* Primer breakdown */}
            {primer && (
              <>
                <SectionLabel>Primer</SectionLabel>
                <table className="w-full">
                  <tbody>
                    <StepRow step="Raw wall sq footage" value={`${steps.rawSqFt.toLocaleString()} sq ft`} />
                    <StepRow step={`Surface type (${surfaceLabel})`} value={`× ${steps.surfaceMultiplier.toFixed(2)}`} />
                    <StepRow step={`Wall texture (${textureLabel})`} value={`× ${steps.textureMultiplier.toFixed(2)}`} />
                    <StepRow step="Coverage rate" value="300 sq ft / gal" />
                    <StepRow step={`Overage buffer (+${steps.bufferPercent}%)`} value="" />
                    <StepRow step="Rounded to purchasable units" value={galStr(primer)} highlight />
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 w-full rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        Recalculate
      </button>
    </div>
  );
}

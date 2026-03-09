import { useState } from 'react';
import {
  SURFACE_TYPE_MULTIPLIERS,
  TEXTURE_MULTIPLIERS,
  SHEEN_MULTIPLIERS,
  COLOR_CHANGE_MULTIPLIERS,
} from '../utils/calculator';

function GallonDisplay({ label, gallons, quarts }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-800">
        {gallons > 0 && (
          <span>
            {gallons} <span className="text-lg font-medium text-slate-500">gal</span>
          </span>
        )}
        {gallons > 0 && quarts > 0 && <span className="text-slate-400 text-xl mx-2">+</span>}
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
      <td className="py-2 text-right text-sm font-medium text-slate-800">{value}</td>
    </tr>
  );
}

export default function ResultsPanel({ result, inputs, onReset }) {
  const [expanded, setExpanded] = useState(false);

  const { steps, paint, primer } = result;

  const surfaceLabel = SURFACE_TYPE_MULTIPLIERS[inputs.surfaceType]?.label ?? inputs.surfaceType;
  const textureLabel = TEXTURE_MULTIPLIERS[inputs.texture]?.label ?? inputs.texture;
  const sheenLabel = SHEEN_MULTIPLIERS[inputs.sheen]?.label ?? inputs.sheen;
  const colorLabel = COLOR_CHANGE_MULTIPLIERS[inputs.colorChange]?.label ?? inputs.colorChange;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Your Estimate</h2>

      {/* Main results */}
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <GallonDisplay
          label="Paint Needed"
          gallons={paint.gallons}
          quarts={paint.quarts}
        />
        {primer ? (
          <GallonDisplay
            label="Primer Needed"
            gallons={primer.gallons}
            quarts={primer.quarts}
          />
        ) : (
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
          <div className="border-t border-slate-200 px-4 pb-3">
            <table className="w-full mt-3">
              <tbody>
                <StepRow step="Raw square footage" value={`${steps.rawSqFt.toLocaleString()} sq ft`} />
                <StepRow step={`Surface multiplier (${surfaceLabel})`} value={`× ${steps.surfaceMultiplier.toFixed(2)}`} />
                <StepRow step={`Texture multiplier (${textureLabel})`} value={`× ${steps.textureMultiplier.toFixed(2)}`} />
                <StepRow step={`Sheen multiplier (${sheenLabel})`} value={`× ${steps.sheenMultiplier.toFixed(2)}`} />
                <StepRow step={`Color change multiplier (${colorLabel})`} value={`× ${steps.colorMultiplier.toFixed(2)}`} />
                <StepRow step="Adjusted square footage" value={`${steps.adjustedSqFt.toFixed(1)} sq ft`} highlight />
                <StepRow step="Coverage rate" value="350 sq ft / gal" />
                <StepRow step="Gallons per coat" value={`${steps.gallonsPerCoat.toFixed(2)} gal`} />
                <StepRow step={`Number of coats (× ${inputs.coats})`} value={`${steps.totalGallons.toFixed(2)} gal`} />
                <StepRow step={`Overage buffer (+${steps.bufferPercent}%)`} value={`${steps.finalGallons.toFixed(2)} gal`} highlight />
                <StepRow
                  step="Rounded to purchasable units"
                  value={
                    paint.quarts > 0
                      ? `${paint.gallons} gal + ${paint.quarts} qt`
                      : `${paint.gallons} gal`
                  }
                  highlight
                />
              </tbody>
            </table>

            {primer && (
              <>
                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Primer Calculation</p>
                <table className="w-full">
                  <tbody>
                    <StepRow step="Coverage rate" value="300 sq ft / gal" />
                    <StepRow step={`Surface multiplier (${surfaceLabel})`} value={`× ${steps.surfaceMultiplier.toFixed(2)}`} />
                    <StepRow step={`Overage buffer (+${steps.bufferPercent}%)`} value="" />
                    <StepRow
                      step="Primer total"
                      value={
                        primer.quarts > 0
                          ? `${primer.gallons} gal + ${primer.quarts} qt`
                          : `${primer.gallons} gal`
                      }
                      highlight
                    />
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

import {
  SURFACE_TYPE_MULTIPLIERS,
  TEXTURE_MULTIPLIERS,
  EXISTING_SHEEN_MULTIPLIERS,
  PAINT_SHEEN_MULTIPLIERS,
  COLOR_CHANGE_MULTIPLIERS,
} from '../utils/calculator';

function SelectField({ label, id, value, onChange, options, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {hint && <p className="text-xs text-slate-400 -mt-0.5">{hint}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {options.map(([key, { label: optLabel }]) => (
          <option key={key} value={key}>
            {optLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function Toggle({ label, valueA, labelA, valueB, labelB, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => onChange(valueA)}
          className={`flex-1 py-2 font-medium transition-colors ${
            value === valueA
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {labelA}
        </button>
        <button
          type="button"
          onClick={() => onChange(valueB)}
          className={`flex-1 py-2 font-medium transition-colors ${
            value === valueB
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {labelB}
        </button>
      </div>
    </div>
  );
}

export default function InputForm({ inputs, onChange, onCalculate, errors }) {
  const set = (field) => (value) => onChange({ ...inputs, [field]: value });
  const err = errors || {};

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Paint Calculator Inputs</h2>

      <div className="grid gap-5 sm:grid-cols-2">

        {/* ── WALL SURFACE ── */}
        <SectionDivider label="Wall Surface" />

        {/* Square Footage */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="sqft" className="text-sm font-medium text-slate-700">
            Wall Square Footage
          </label>
          <p className="text-xs text-slate-400 -mt-0.5">Total paintable wall area (exclude doors & windows if desired)</p>
          <input
            id="sqft"
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={inputs.squareFootage}
            onChange={(e) => set('squareFootage')(e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${
              err.squareFootage
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {err.squareFootage && <p className="text-xs text-red-600">{err.squareFootage}</p>}
        </div>

        {/* Surface Type */}
        <SelectField
          label="Surface Type"
          id="surfaceType"
          value={inputs.surfaceType}
          onChange={set('surfaceType')}
          options={Object.entries(SURFACE_TYPE_MULTIPLIERS)}
        />

        {/* Surface Texture */}
        <SelectField
          label="Surface Texture"
          id="texture"
          value={inputs.texture}
          onChange={set('texture')}
          options={Object.entries(TEXTURE_MULTIPLIERS)}
        />

        {/* Surface Condition */}
        <Toggle
          label="Surface Condition"
          valueA={false}
          labelA="Repaint"
          valueB={true}
          labelB="New Surface"
          value={inputs.isNewSurface}
          onChange={set('isNewSurface')}
        />

        {/* Primer Needed */}
        <Toggle
          label="Primer Needed?"
          valueA={false}
          labelA="No"
          valueB={true}
          labelB="Yes"
          value={inputs.primerNeeded}
          onChange={set('primerNeeded')}
        />

        {/* ── SHEEN ── */}
        <SectionDivider label="Sheen" />

        {/* Existing Wall Sheen */}
        <SelectField
          label="Existing Wall Sheen"
          id="existingSheen"
          hint="Current sheen of the wall before painting"
          value={inputs.existingSheen}
          onChange={set('existingSheen')}
          options={Object.entries(EXISTING_SHEEN_MULTIPLIERS)}
        />

        {/* New Paint Sheen */}
        <SelectField
          label="New Paint Sheen"
          id="paintSheen"
          hint="Sheen of the paint you're applying"
          value={inputs.paintSheen}
          onChange={set('paintSheen')}
          options={Object.entries(PAINT_SHEEN_MULTIPLIERS)}
        />

        {/* ── PAINT JOB ── */}
        <SectionDivider label="Paint Job" />

        {/* Number of Coats */}
        <div className="flex flex-col gap-1">
          <label htmlFor="coats" className="text-sm font-medium text-slate-700">
            Number of Coats
          </label>
          <select
            id="coats"
            value={inputs.coats}
            onChange={(e) => set('coats')(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="1">1 coat</option>
            <option value="2">2 coats</option>
            <option value="3">3 coats</option>
          </select>
        </div>

        {/* Color Change */}
        <SelectField
          label="Color Change Severity"
          id="colorChange"
          value={inputs.colorChange}
          onChange={set('colorChange')}
          options={Object.entries(COLOR_CHANGE_MULTIPLIERS)}
        />

        {/* Overage Buffer */}
        <div className="flex flex-col gap-1">
          <label htmlFor="buffer" className="text-sm font-medium text-slate-700">
            Overage Buffer %
          </label>
          <input
            id="buffer"
            type="number"
            min="0"
            max="100"
            value={inputs.overageBuffer}
            onChange={(e) => set('overageBuffer')(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* ── CEILING ── */}
        <SectionDivider label="Ceiling" />

        {/* Include Ceiling Toggle */}
        <div className="sm:col-span-2">
          <Toggle
            label="Include Ceiling Estimate?"
            valueA={false}
            labelA="No"
            valueB={true}
            labelB="Yes"
            value={inputs.includeCeiling}
            onChange={set('includeCeiling')}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Ceiling paint is always flat. Base sq footage defaults to your wall sq footage as a room estimate.
          </p>
        </div>

        {inputs.includeCeiling && (
          <>
            {/* Ceiling Texture */}
            <SelectField
              label="Ceiling Texture"
              id="ceilingTexture"
              value={inputs.ceilingTexture}
              onChange={set('ceilingTexture')}
              options={Object.entries(TEXTURE_MULTIPLIERS)}
            />

            {/* Additional Ceiling Sq Ft */}
            <div className="flex flex-col gap-1">
              <label htmlFor="addlCeilingSqFt" className="text-sm font-medium text-slate-700">
                Additional Ceiling Sq Ft
              </label>
              <p className="text-xs text-slate-400 -mt-0.5">Vaulted, coffered, or other extra area</p>
              <input
                id="addlCeilingSqFt"
                type="number"
                min="0"
                placeholder="0"
                value={inputs.additionalCeilingSqFt}
                onChange={(e) => set('additionalCeilingSqFt')(e.target.value)}
                className={`rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${
                  err.additionalCeilingSqFt
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {err.additionalCeilingSqFt && (
                <p className="text-xs text-red-600">{err.additionalCeilingSqFt}</p>
              )}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onCalculate}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Calculate
      </button>
    </div>
  );
}

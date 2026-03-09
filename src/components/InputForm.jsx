import {
  SURFACE_TYPE_MULTIPLIERS,
  TEXTURE_MULTIPLIERS,
  SHEEN_MULTIPLIERS,
  COLOR_CHANGE_MULTIPLIERS,
} from '../utils/calculator';

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
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

export default function InputForm({ inputs, onChange, onCalculate, error }) {
  const set = (field) => (value) => onChange({ ...inputs, [field]: value });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Paint Calculator Inputs</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Square Footage */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="sqft" className="text-sm font-medium text-slate-700">
            Square Footage
          </label>
          <input
            id="sqft"
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={inputs.squareFootage}
            onChange={(e) => set('squareFootage')(e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
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

        {/* Sheen */}
        <SelectField
          label="Sheen"
          id="sheen"
          value={inputs.sheen}
          onChange={set('sheen')}
          options={Object.entries(SHEEN_MULTIPLIERS)}
        />

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

        {/* New Surface / Repaint Toggle */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Surface Condition</span>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => set('isNewSurface')(false)}
              className={`flex-1 py-2 font-medium transition-colors ${
                !inputs.isNewSurface
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Repaint
            </button>
            <button
              type="button"
              onClick={() => set('isNewSurface')(true)}
              className={`flex-1 py-2 font-medium transition-colors ${
                inputs.isNewSurface
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              New Surface
            </button>
          </div>
        </div>

        {/* Primer Needed Toggle */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Primer Needed?</span>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => set('primerNeeded')(false)}
              className={`flex-1 py-2 font-medium transition-colors ${
                !inputs.primerNeeded
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => set('primerNeeded')(true)}
              className={`flex-1 py-2 font-medium transition-colors ${
                inputs.primerNeeded
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Yes
            </button>
          </div>
        </div>
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

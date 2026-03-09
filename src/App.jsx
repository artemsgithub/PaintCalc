import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsPanel from './components/ResultsPanel';
import WarningBanner from './components/WarningBanner';
import { APP_VERSION } from './utils/version';
import { calculate, getWarnings } from './utils/calculator';

const DEFAULT_INPUTS = {
  squareFootage: '',
  surfaceType: 'drywall-repaint',
  texture: 'smooth',
  existingSheen: 'flat',
  paintSheen: 'flat',
  coats: '2',
  isNewSurface: false,
  primerNeeded: false,
  colorChange: 'same',
  overageBuffer: '15',
  includeCeiling: false,
  ceilingTexture: 'smooth',
  additionalCeilingSqFt: '',
};

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const warnings = getWarnings(inputs);

  function handleCalculate() {
    const newErrors = {};
    const sqFt = parseFloat(inputs.squareFootage);
    if (!inputs.squareFootage || isNaN(sqFt) || sqFt <= 0) {
      newErrors.squareFootage = 'Please enter a valid square footage greater than 0.';
    }
    if (inputs.includeCeiling && inputs.additionalCeilingSqFt !== '') {
      const addl = parseFloat(inputs.additionalCeilingSqFt);
      if (isNaN(addl) || addl < 0) {
        newErrors.additionalCeilingSqFt = 'Additional ceiling sq ft must be 0 or greater.';
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }
    setResult(calculate(inputs));
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleReset() {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-2xl bg-blue-600 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Paint Calculator</h1>
          <p className="mt-1 text-slate-500">Estimate paint and primer for your next project</p>
          <span className="mt-2 inline-block rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            v{APP_VERSION}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {warnings.length > 0 && <WarningBanner warnings={warnings} />}

          <InputForm
            inputs={inputs}
            onChange={setInputs}
            onCalculate={handleCalculate}
            errors={errors}
          />

          {result && (
            <div id="results-section">
              <ResultsPanel result={result} inputs={inputs} onReset={handleReset} />
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Estimates based on standard coverage rates. Always consult product labels for exact coverage.
        </p>
      </div>
    </div>
  );
}

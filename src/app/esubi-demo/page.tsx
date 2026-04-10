'use client';

import { useState } from 'react';
import { 
  Esubi, 
  FloatingEsubi, 
  EsubiProvider, 
  ConnectedFloatingEsubi,
  useEsubi,
  type EsubiExpression 
} from '@/components/esubi';

// Demo controls component that uses the Esubi context
function EsubiControls() {
  const { celebrate, search, confused, error, reset, setMessage } = useEsubi();

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => search()} className="btn-secondary">
        Start Search
      </button>
      <button onClick={() => celebrate()} className="btn-primary">
        Celebrate!
      </button>
      <button onClick={() => confused()} className="btn-secondary">
        Confused
      </button>
      <button onClick={() => error('Oops! Database connection failed.')} className="btn-secondary">
        Trigger Error
      </button>
      <button onClick={() => reset()} className="btn-secondary">
        Reset
      </button>
      <button 
        onClick={() => setMessage('Custom message here!')} 
        className="btn-seeker"
      >
        Custom Message
      </button>
    </div>
  );
}

export default function EsubiDemoPage() {
  const [selectedExpression, setSelectedExpression] = useState<EsubiExpression>('idle');

  const expressions: EsubiExpression[] = [
    'idle',
    'searching',
    'celebrating',
    'confused',
    'error',
    'waving',
  ];

  return (
    <EsubiProvider>
      <main className="min-h-screen bg-card-white p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-display text-4xl mb-4">
              Meet Esubi (SB-060)
            </h1>
            <p className="text-[rgb(var(--text-secondary))] text-lg">
              Your friendly Seeker Buddy • Pronounced &quot;eh-SOO-bee&quot; (エスビ)
            </p>
          </div>

          {/* Expression Gallery */}
          <section className="glass-panel p-8 mb-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              All Expressions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {expressions.map((expr) => (
                <button
                  key={expr}
                  onClick={() => setSelectedExpression(expr)}
                  className={`
                    flex flex-col items-center gap-3 p-4 rounded-xl
                    transition-all duration-200
                    ${selectedExpression === expr 
                      ? 'bg-seeker/10 ring-2 ring-seeker' 
                      : 'hover:bg-card-cream'
                    }
                  `}
                >
                  <Esubi 
                    expression={expr} 
                    size="lg" 
                    interactive={false}
                    animated={selectedExpression === expr}
                  />
                  <span className="font-medium capitalize">{expr}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Interactive Demo */}
          <section className="glass-panel p-8 mb-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Interactive Demo
            </h2>
            
            <div className="flex flex-col items-center gap-6">
              <p className="text-[rgb(var(--text-secondary))]">
                Click Esubi or hover to see interactions!
              </p>
              
              <Esubi 
                expression={selectedExpression}
                size="xl"
                showBubble={true}
                animated={true}
                interactive={true}
              />
            </div>
          </section>

          {/* Size Variants */}
          <section className="glass-panel p-8 mb-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Size Variants
            </h2>
            
            <div className="flex items-end justify-center gap-8">
              <div className="text-center">
                <Esubi size="sm" interactive={false} />
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">sm (64px)</p>
              </div>
              <div className="text-center">
                <Esubi size="md" interactive={false} />
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">md (96px)</p>
              </div>
              <div className="text-center">
                <Esubi size="lg" interactive={false} />
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">lg (128px)</p>
              </div>
              <div className="text-center">
                <Esubi size="xl" interactive={false} />
                <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">xl (192px)</p>
              </div>
            </div>
          </section>

          {/* Global State Demo */}
          <section className="glass-panel p-8 mb-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Global State Control
            </h2>
            <p className="text-[rgb(var(--text-secondary))] mb-6">
              These buttons control the floating Esubi in the corner. This is how you&apos;d
              trigger Esubi reactions from anywhere in your app!
            </p>
            
            <EsubiControls />
          </section>

          {/* Usage Code */}
          <section className="glass-panel p-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Usage Examples
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Usage:</h3>
                <pre className="bg-card-grey/50 p-4 rounded-lg text-sm overflow-x-auto">
{`import { Esubi } from '@/components/esubi';

<Esubi expression="idle" size="lg" />
<Esubi expression="searching" message="Looking..." />
<Esubi expression="celebrating" showBubble />`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Floating Assistant:</h3>
                <pre className="bg-card-grey/50 p-4 rounded-lg text-sm overflow-x-auto">
{`import { FloatingEsubi } from '@/components/esubi';

// In your layout:
<FloatingEsubi 
  position="bottom-right" 
  collapsible={true}
/>`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">With Global State:</h3>
                <pre className="bg-card-grey/50 p-4 rounded-lg text-sm overflow-x-auto">
{`import { EsubiProvider, ConnectedFloatingEsubi, useEsubi } from '@/components/esubi';

// In your root layout:
<EsubiProvider>
  <App />
  <ConnectedFloatingEsubi position="bottom-right" />
</EsubiProvider>

// Anywhere in your app:
function MyComponent() {
  const { celebrate, search, error } = useEsubi();
  
  const handleSave = async () => {
    search(); // Esubi starts searching animation
    await saveDeck();
    celebrate(); // Esubi celebrates!
  };
}`}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Floating Esubi - connected to global state */}
        <ConnectedFloatingEsubi position="bottom-right" collapsible={true} />
      </main>
    </EsubiProvider>
  );
}

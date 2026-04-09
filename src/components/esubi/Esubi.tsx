'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type EsubiExpression = 
  | 'idle' 
  | 'searching' 
  | 'celebrating' 
  | 'confused' 
  | 'error'
  | 'waving';

export type EsubiSize = 'sm' | 'md' | 'lg' | 'xl';

export interface EsubiProps {
  /** Current expression/state */
  expression?: EsubiExpression;
  /** Size preset */
  size?: EsubiSize;
  /** Custom size in pixels (overrides size preset) */
  customSize?: number;
  /** Optional message to display in speech bubble */
  message?: string;
  /** Show speech bubble */
  showBubble?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Enable hover interactions */
  interactive?: boolean;
  /** Enable idle animations (breathing, antenna sway) */
  animated?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIZE_MAP: Record<EsubiSize, number> = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 192,
};

const EXPRESSION_MESSAGES: Record<EsubiExpression, string[]> = {
  idle: [
    "Hey there, trainer!",
    "Need help building a deck?",
    "What are we looking for today?",
  ],
  searching: [
    "Searching...",
    "Let me find that for you!",
    "Hmm, looking...",
  ],
  celebrating: [
    "Amazing! 🎉",
    "You did it!",
    "That's a winning deck!",
  ],
  confused: [
    "Hmm, I'm not sure...",
    "Can you try again?",
    "What do you mean?",
  ],
  error: [
    "Oops! Something went wrong.",
    "I tripped on a cable...",
    "Let's try that again.",
  ],
  waving: [
    "Hi there! 👋",
    "Welcome back!",
    "Good to see you!",
  ],
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function Esubi({
  expression = 'idle',
  size = 'md',
  customSize,
  message,
  showBubble = false,
  className,
  onClick,
  interactive = true,
  animated = true,
}: EsubiProps) {
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [isHovered, setIsHovered] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');

  const pixelSize = customSize || SIZE_MAP[size];

  // Update expression when prop changes
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  // Pick random message when expression changes or on mount
  useEffect(() => {
    if (!message) {
      const messages = EXPRESSION_MESSAGES[currentExpression];
      setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [currentExpression, message]);

  // Handle click with celebration animation
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (interactive) {
      // Default: quick wave animation
      setCurrentExpression('waving');
      setTimeout(() => setCurrentExpression(expression), 1000);
    }
  }, [onClick, interactive, expression]);

  // Handle hover
  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={cn(
        'relative inline-flex flex-col items-center gap-2',
        interactive && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Speech Bubble */}
      {(showBubble || isHovered) && (
        <div 
          className={cn(
            'absolute bottom-full mb-2 px-3 py-2',
            'bg-card-white/95 backdrop-blur-sm',
            'border-2 border-gold rounded-lg',
            'shadow-card',
            'text-sm text-center max-w-[200px]',
            'animate-fade-in',
            'z-10'
          )}
        >
          <span className="text-[rgb(var(--text-primary))]">
            {message || randomMessage}
          </span>
          {/* Bubble tail */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
            style={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #D4A017',
            }}
          />
        </div>
      )}

      {/* Esubi Image Container */}
      <div
        className={cn(
          'relative transition-transform duration-200',
          // Idle breathing animation
          animated && currentExpression === 'idle' && 'animate-[breathe_3s_ease-in-out_infinite]',
          // Searching pulse
          animated && currentExpression === 'searching' && 'animate-[wiggle_0.3s_ease-in-out_infinite]',
          // Celebrating bounce
          animated && currentExpression === 'celebrating' && 'animate-bounce',
          // Hover lift
          isHovered && 'scale-105 -translate-y-1',
          // Confused tilt
          currentExpression === 'confused' && 'animate-[tilt_2s_ease-in-out_infinite]',
        )}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src={`/esubi/static/esubi-${currentExpression}.png`}
          alt={`Esubi is ${currentExpression}`}
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}

// =============================================================================
// FLOATING ASSISTANT VARIANT
// =============================================================================

export interface FloatingEsubiProps extends Omit<EsubiProps, 'size' | 'customSize'> {
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Whether Esubi is visible */
  visible?: boolean;
  /** Collapse to small icon when not interacting */
  collapsible?: boolean;
}

export function FloatingEsubi({
  position = 'bottom-right',
  visible = true,
  collapsible = true,
  expression = 'idle',
  message,
  showBubble,
  onClick,
  ...props
}: FloatingEsubiProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const handleClick = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        !isExpanded && collapsible && 'opacity-70 hover:opacity-100'
      )}
    >
      <Esubi
        expression={expression}
        size={isExpanded || !collapsible ? 'lg' : 'sm'}
        message={message}
        showBubble={isExpanded ? showBubble : false}
        onClick={handleClick}
        {...props}
      />
    </div>
  );
}

// =============================================================================
// CONTEXT PROVIDER FOR GLOBAL ESUBI STATE
// =============================================================================

import { createContext, useContext, type ReactNode } from 'react';

interface EsubiContextType {
  expression: EsubiExpression;
  message: string;
  setExpression: (expr: EsubiExpression) => void;
  setMessage: (msg: string) => void;
  celebrate: () => void;
  search: () => void;
  confused: () => void;
  error: (msg?: string) => void;
  reset: () => void;
}

const EsubiContext = createContext<EsubiContextType | null>(null);

export function EsubiProvider({ children }: { children: ReactNode }) {
  const [expression, setExpression] = useState<EsubiExpression>('idle');
  const [message, setMessage] = useState('');

  const celebrate = useCallback(() => {
    setExpression('celebrating');
    setMessage('Amazing! 🎉');
    setTimeout(() => {
      setExpression('idle');
      setMessage('');
    }, 3000);
  }, []);

  const search = useCallback(() => {
    setExpression('searching');
    setMessage('Searching...');
  }, []);

  const confused = useCallback(() => {
    setExpression('confused');
    setMessage("I'm not sure about that...");
    setTimeout(() => {
      setExpression('idle');
      setMessage('');
    }, 3000);
  }, []);

  const error = useCallback((msg?: string) => {
    setExpression('error');
    setMessage(msg || 'Oops! Something went wrong.');
    setTimeout(() => {
      setExpression('idle');
      setMessage('');
    }, 4000);
  }, []);

  const reset = useCallback(() => {
    setExpression('idle');
    setMessage('');
  }, []);

  return (
    <EsubiContext.Provider
      value={{
        expression,
        message,
        setExpression,
        setMessage,
        celebrate,
        search,
        confused,
        error,
        reset,
      }}
    >
      {children}
    </EsubiContext.Provider>
  );
}

export function useEsubi() {
  const context = useContext(EsubiContext);
  if (!context) {
    throw new Error('useEsubi must be used within an EsubiProvider');
  }
  return context;
}

// =============================================================================
// CONNECTED FLOATING ESUBI (Uses Context)
// =============================================================================

export function ConnectedFloatingEsubi(props: Omit<FloatingEsubiProps, 'expression' | 'message'>) {
  const { expression, message } = useEsubi();
  
  return (
    <FloatingEsubi
      expression={expression}
      message={message}
      showBubble={!!message}
      {...props}
    />
  );
}

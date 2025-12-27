import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        'relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200',
        sizeClasses[size],
        'w-full max-h-[90vh] overflow-y-auto'
      )}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200 bg-white/50 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 lg:p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-slate-200 bg-white/50 rounded-b-3xl">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

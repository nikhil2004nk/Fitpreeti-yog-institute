interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '' 
}) => (
  <main className={`min-h-screen ${className}`}>
    <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
      {children}
    </div>
  </main>
);

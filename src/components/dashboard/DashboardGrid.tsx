import { ReactNode } from "react";

interface DashboardGridProps {
    children: ReactNode;
}

function DashboardGrid({ children }: DashboardGridProps) {
    return (
        <div className="container mx-auto w-full lg:w-4/5 py-8">
            {/* 
              Grid container with responsive columns:
              - Mobile (default): 1 column (grid-cols-1)
              - Medium screens (md): 2 columns (md:grid-cols-2) 
              - Large screens (lg): 3 columns (lg:grid-cols-3)
              
              gap-4: 1rem (16px) spacing between grid items
              
              Horizontal padding:
              - Mobile: 1rem padding on both sides (px-4)
              - Medium+ screens: No padding (md:px-0)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
                {children}
            </div>
        </div>
    )
}

export default DashboardGrid;
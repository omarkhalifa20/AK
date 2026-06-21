import DashboardNav from '@/components/Dashboard/DashboardNav';
import React from 'react'

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F3F1]">
      <DashboardNav/>
      <div className='pe-[231px]'>
        {children}
      </div>
      
      
    </div>
  );
}
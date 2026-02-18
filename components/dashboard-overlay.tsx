"use client";

export function DashboardOverlay() {
  const handleOverlayClick = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-30 md:hidden hidden" 
      id="sidebar-overlay"
      onClick={handleOverlayClick}
    />
  );
}

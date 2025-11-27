// =====================================================
// InventoryPro - Sidebar Toggle Script (Desktop + Mobile)
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar-wrapper');
    const pageContent = document.getElementById('page-content-wrapper');

    // Sidebar Toggle Function
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Toggle clicked'); // Debug
            
            if (window.innerWidth > 768) {
                // Desktop: collapse sidebar
                toggleDesktopSidebar();
            } else {
                // Mobile: show/hide with overlay
                toggleMobileSidebar();
            }
        });
    } else {
        console.error('sidebarToggle button not found');
    }

    // Desktop Sidebar Toggle
    function toggleDesktopSidebar() {
        sidebar.classList.toggle('collapsed');
        pageContent.classList.toggle('expanded');
        
        // Save state
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }

    // Mobile Sidebar Toggle
    function toggleMobileSidebar() {
        sidebar.classList.toggle('show');
        toggleOverlay();
    }

    // Toggle Overlay (Mobile only)
    function toggleOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        
        if (!overlay) {
            // Create overlay
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            // Close sidebar when clicking overlay
            overlay.addEventListener('click', function() {
                closeSidebar();
            });
        } else {
            // Remove overlay
            overlay.remove();
        }
    }

    // Close Sidebar Function
    function closeSidebar() {
        sidebar.classList.remove('show');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar && sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
            const isSidebarOpen = sidebar && sidebar.classList.contains('show');
            
            if (!isClickInsideSidebar && !isClickOnToggle && isSidebarOpen) {
                closeSidebar();
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                // Desktop view - remove mobile elements
                sidebar.classList.remove('show');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    overlay.remove();
                }
            } else {
                // Mobile view - remove desktop collapsed state
                sidebar.classList.remove('collapsed');
                pageContent.classList.remove('expanded');
            }
        }, 250);
    });

    // Prevent sidebar from closing when clicking inside it
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Restore sidebar state on desktop
    if (window.innerWidth > 768) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            pageContent.classList.add('expanded');
        }
    }

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('#sidebar-wrapper .list-group-item');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Smooth scrolling for sidebar
    if (sidebar) {
        sidebar.style.scrollBehavior = 'smooth';
    }

    // Initialize tooltips for sidebar items when sidebar is expanded
    initializeTooltips();
});

// Initialize tooltips for sidebar items
function initializeTooltips() {
    const sidebarItems = document.querySelectorAll('#sidebar-wrapper .list-group-item');

    sidebarItems.forEach(item => {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.textContent = item.getAttribute('data-title');
        document.body.appendChild(tooltip);

        // Position and show tooltip on hover
        item.addEventListener('mouseenter', function(e) {
            if (!document.getElementById('sidebar-wrapper').classList.contains('collapsed')) {
                const rect = this.getBoundingClientRect();
                tooltip.style.position = 'absolute';
                tooltip.style.left = rect.right + 10 + 'px';
                tooltip.style.top = rect.top + window.scrollY + 'px';
                tooltip.style.display = 'block';
                tooltip.style.opacity = '0';
                tooltip.style.pointerEvents = 'none';

                // Fade in
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transition = 'opacity 0.2s ease';
                }, 10);
            }
        });

        item.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 200);
        });
    });
}

// Export functions if needed
window.sidebarUtils = {
    close: function() {
        const sidebar = document.getElementById('sidebar-wrapper');
        const pageContent = document.getElementById('page-content-wrapper');
        
        if (sidebar) {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            } else {
                sidebar.classList.add('collapsed');
                pageContent.classList.add('expanded');
            }
        }
    },
    open: function() {
        const sidebar = document.getElementById('sidebar-wrapper');
        const pageContent = document.getElementById('page-content-wrapper');
        
        if (sidebar) {
            if (window.innerWidth <= 768) {
                sidebar.classList.add('show');
                
                let overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    document.body.appendChild(overlay);
                    
                    overlay.addEventListener('click', function() {
                        window.sidebarUtils.close();
                    });
                }
            } else {
                sidebar.classList.remove('collapsed');
                pageContent.classList.remove('expanded');
            }
        }
    },
    toggle: function() {
        const sidebar = document.getElementById('sidebar-wrapper');
        if (sidebar) {
            if (window.innerWidth <= 768) {
                if (sidebar.classList.contains('show')) {
                    window.sidebarUtils.close();
                } else {
                    window.sidebarUtils.open();
                }
            } else {
                if (sidebar.classList.contains('collapsed')) {
                    window.sidebarUtils.open();
                } else {
                    window.sidebarUtils.close();
                }
            }
        }
    }
};

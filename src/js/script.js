// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        
        // Save the state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }

    // Initialize sidebar state from localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
    }

    // Add click event listener to toggle button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Add keyboard shortcut (Alt + S) for toggling sidebar
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 's') {
            toggleSidebar();
        }
    });
});

// Time handling functions
function updateCurrentTime() {
    const now = new Date();
    // Get IST hour (UTC+5:30). getUTCHours gives hours in UTC, add 5 for +5, and add 30 minutes / 60 minutes per hour for +0.5
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    let istHours = utcHours + 5;
    let istMinutes = utcMinutes + 30;

    if (istMinutes >= 60) {
        istHours += Math.floor(istMinutes / 60);
        istMinutes %= 60;
    }

    istHours %= 24; // Wrap around midnight

    const istTimeFormatted = `${String(istHours).padStart(2, '0')}:${String(istMinutes).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
    const sidebarTimestampElement = document.getElementById('sidebarTimestamp');
    if (sidebarTimestampElement) {
        sidebarTimestampElement.textContent = `Current Time (IST): ${istTimeFormatted}`;
    }

    // Check if current time is between 3 PM (15) and 5 PM (17) IST
    // Use the calculated istHours for the check
    const isWithinTimeRange = istHours >= 15 && istHours < 17;

    // Show/hide time-restricted charts
    document.querySelectorAll('.time-restricted').forEach(chart => {
        if (isWithinTimeRange) {
            chart.classList.add('active');
        } else {
            chart.classList.remove('active');
        }
    });
}

// Update time visibility check every second to update the timestamp
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // Run immediately on load

// Tableau visualization URLs
const vizUrls = {
    'tableauViz1': 'https://public.tableau.com/views/Nullclasspx133/JobPostingsbyCompanyandJobPortal?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz2': 'https://public.tableau.com/views/Nullclasspx133/RoleandJobTitle?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz3': 'https://public.tableau.com/views/Nullclasspx133/CountryJobTitleandRoleRelationship?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz4': 'https://public.tableau.com/views/Nullclasspx133/Top5Rolein2023?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz5': 'https://public.tableau.com/views/Nullclasspx133/Top20CompanieswithMaximumUIUXDesigner?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz6': 'https://public.tableau.com/views/Nullclasspx133/InternshipPreferencebyWorkType?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz7': 'https://public.tableau.com/views/Nullclasspx133/FullTImeJobsinAfrica?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz8': 'https://public.tableau.com/views/Nullclasspx133/Top10CompaniesforDataEngineers?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz9': 'https://public.tableau.com/views/Nullclasspx133/JobsinIndiaandGermany?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
    'tableauViz10': 'https://public.tableau.com/views/Nullclasspx133/MechanicalEngineers?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
};

// Modal handling
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalVizContainer = document.getElementById('modalVizContainer');
let currentViz = null;

function openModal(vizId) {
    const url = vizUrls[vizId];
    if (!url) {
        console.error('Viz URL not found for ID:', vizId);
        return;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Create new Tableau visualization in modal
    const vizOptions = {
        hideTabs: true,
        hideToolbar: true,
        width: '100%',
        height: '100%'
    };
    
    // Dispose of previous viz if it exists
    if (currentViz) {
        currentViz.dispose();
        currentViz = null;
        modalVizContainer.innerHTML = ''; // Clear container
    }

    currentViz = new tableau.Viz(modalVizContainer, url, vizOptions);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clean up the visualization
    if (currentViz) {
        currentViz.dispose();
        currentViz = null;
    }
    modalVizContainer.innerHTML = '';
}

// Event Listeners for modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Add click handlers to chart containers
document.querySelectorAll('.chart-container').forEach(container => {
    container.addEventListener('click', () => {
        const vizId = container.getAttribute('data-viz-id');
        openModal(vizId);
    });
});

// Tableau visualization initialization for the main dashboard
function initTableauViz() {
    // Create visualization instances
    Object.entries(vizUrls).forEach(([containerId, url]) => {
        const container = document.getElementById(containerId);
        if (container) {
            const vizOptions = {
                hideTabs: true,
                hideToolbar: true,
                width: '100%',
                height: '100%'
            };
            new tableau.Viz(container, url, vizOptions);
        } else {
             console.warn('Container not found for ID:', containerId);
        }
    });
}

// Initialize Tableau visualizations when the page loads
window.addEventListener('load', initTableauViz);

// Chart 1: Job Portal vs Company
const chart1 = new Chart(document.getElementById('chart1'), {
    type: 'bar',
    data: {
        labels: ['Indeed', 'LinkedIn', 'Glassdoor', 'Monster'],
        datasets: [{
            label: 'Number of Companies',
            data: [150, 120, 80, 60],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Companies by Job Portal'
            }
        }
    }
});

// Chart 2: Role, Job Title and Job Posting
const chart2 = new Chart(document.getElementById('chart2'), {
    type: 'line',
    data: {
        labels: ['Nov 2021', 'Dec 2021', 'Jan 2022', 'Feb 2022', 'Mar 2022'],
        datasets: [{
            label: 'Contract Jobs (Male)',
            data: [45, 52, 48, 55, 60],
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false
        }, {
            label: 'Full-time Jobs (Female)',
            data: [35, 42, 38, 45, 50],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Job Postings by Type and Preference'
            }
        }
    }
});

// Chart 3: Country, Job Title and Role
const chart3 = new Chart(document.getElementById('chart3'), {
    type: 'radar',
    data: {
        labels: ['Data Scientist', 'Software Engineer', 'UX Designer', 'Product Manager', 'Business Analyst'],
        datasets: [{
            label: 'India',
            data: [65, 75, 45, 55, 60],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)'
        }, {
            label: 'USA',
            data: [75, 85, 55, 65, 70],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Role Distribution by Country'
            }
        }
    }
});

// Chart 4: Engagement Rate Analysis
const chart4 = new Chart(document.getElementById('chart4'), {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Engagement Rate vs Impressions',
            data: [
                {x: 150, y: 0.05},
                {x: 200, y: 0.07},
                {x: 250, y: 0.06},
                {x: 300, y: 0.08},
                {x: 350, y: 0.09}
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Engagement Rate vs Impressions'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Impressions'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Engagement Rate'
                }
            }
        }
    }
});

// Chart 5: Top 5 Roles 2023
const chart5 = new Chart(document.getElementById('chart5'), {
    type: 'doughnut',
    data: {
        labels: ['Data Scientist', 'UX Designer', 'Product Manager', 'Software Engineer', 'Business Analyst'],
        datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Top 5 Roles in 2023'
            }
        }
    }
});

// Chart 6: Top 20 Companies - UX Designers
const chart6 = new Chart(document.getElementById('chart6'), {
    type: 'bar',
    data: {
        labels: ['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'],
        datasets: [{
            label: 'Number of UX Designers',
            data: [25, 20, 18, 15, 12],
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Top Companies by UX Designer Count'
            }
        }
    }
});

// Chart 7: Preference vs Work Type
const chart7 = new Chart(document.getElementById('chart7'), {
    type: 'pie',
    data: {
        labels: ['Male - Contract', 'Female - Full-time', 'Male - Full-time', 'Female - Contract'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Work Type Distribution by Preference'
            }
        }
    }
});

// Chart 8: Qualification Analysis - African Continent
const chart8 = new Chart(document.getElementById('chart8'), {
    type: 'bar',
    data: {
        labels: ['B.Tech', 'M.Tech', 'PhD'],
        datasets: [{
            label: 'Number of Jobs',
            data: [45, 30, 15],
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Job Distribution by Qualification'
            }
        }
    }
});

// Chart 9: Top 10 Companies - Data Engineers
const chart9 = new Chart(document.getElementById('chart9'), {
    type: 'horizontalBar',
    data: {
        labels: ['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'],
        datasets: [{
            label: 'Number of Data Engineers',
            data: [30, 25, 20, 15, 10],
            backgroundColor: 'rgba(255, 159, 64, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Top Companies by Data Engineer Count'
            }
        }
    }
});

// Chart 10: India vs Germany Analysis
const chart10 = new Chart(document.getElementById('chart10'), {
    type: 'bar',
    data: {
        labels: ['Data Scientist', 'Art Teacher', 'AeroSpace Engineer'],
        datasets: [{
            label: 'India',
            data: [35, 25, 20],
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
        }, {
            label: 'Germany',
            data: [30, 20, 25],
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Job Distribution: India vs Germany'
            }
        }
    }
});

// Chart 11: Company Size Analysis
const chart11 = new Chart(document.getElementById('chart11'), {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Company Size vs Name',
            data: [
                {x: 10000, y: 1},
                {x: 20000, y: 2},
                {x: 30000, y: 3},
                {x: 40000, y: 4},
                {x: 45000, y: 5}
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Company Size Distribution'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Company Size'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Company Index'
                }
            }
        }
    }
}); 
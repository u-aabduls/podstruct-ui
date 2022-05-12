const Menu = [
    {
        heading: 'Administrative Dashboard',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Pods',
        icon: 'icon-folder',
        path: '/dashboardv2',
        translate: 'sidebar.nav.DASHBOARD',
        
    },
    {
        name: 'Courses',
        icon: 'icon-notebook',
        
        translate: 'sidebar.nav.DASHBOARD',
        submenu: [{
            name: 'Assignments',
            icon: 'icon-pencil',
            path: '/table-standard'
        },
        {
            name: 'Attendance',
            icon: 'icon-check',
            path: '/table-datatable'
        }
    ]
    },
    {
        name: 'Users',
        icon: 'icon-user',
        translate: 'sidebar.nav.DASHBOARD',
        
    },
    {
        name: 'Grades',
        icon: 'icon-calculator',
        translate: 'sidebar.nav.DASHBOARD',
        
    },
    {
        name: 'Payments',
        icon: 'icon-wallet',
        translate: 'sidebar.nav.DASHBOARD',
        
    },
    {
        name: 'Settings',
        icon: 'icon-settings',
        translate: 'sidebar.nav.DASHBOARD',
        
    }
];

export default Menu;


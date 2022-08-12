const Menu = [
    {
        heading: 'Administrative Dashboard',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Dashboard',
        icon: 'icon-speedometer',
        path: '/dashboard',
        translate: 'sidebar.nav.DASHBOARD'
    },
    {
        name: 'Pods',
        icon: 'icon-folder',
        translate: 'sidebar.nav.DASHBOARD',
        submenu: [{
            name: 'View Pods',
            icon: 'icon-grid',
            path: '/pods/view',
            translate: 'sidebar.nav.table.EXTENDED'
        },
        {
            name: 'Create Pod',
            icon: 'icon-plus',
            path: '/pod/create'
        }]
    },
    {
        name: 'Courses',
        icon: 'icon-notebook',
        translate: 'sidebar.nav.DASHBOARD',
        submenu: [{
            name: 'Manage',
            icon: 'fas fa-user-cog',
            path: '/courses'
        },
        {
            name: 'Assignments',
            icon: 'icon-pencil',
            path: '/table-standard'
        },
        {
            name: 'Attendance',
            icon: 'icon-check',
            path: '/table-datatable'
        }]
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
        name: 'Messages',
        icon: 'icon-speech',
        translate: 'sidebar.nav.DASHBOARD',
    },
    {
        name: 'Payments',
        icon: 'icon-wallet',
        translate: 'sidebar.nav.DASHBOARD',
    }
];

export default Menu;


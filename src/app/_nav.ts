import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   icon: 'icon-speedometer',
  //   badge: {
  //     variant: 'info',
  //     text: '',
  //   },
  // },
  {
    title: true,
    name: "Quản lý & Thiết lập",
  },
  // {
  //   name: 'Quản lý Danh mục',
  //   url: '/base',
  //   icon: 'icon-puzzle',
  //   children: [
  //     {
  //       name: 'DM Trường học',
  //       url: '/base/cards',
  //       icon: 'icon-puzzle',
  //     },
  //   ],
  // },
  // {
  //   name: 'Quản lý tài khoản',
  //   url: '/account',
  //   icon: 'icon-plus',
  //   children: [
  //     // {
  //     //   name: 'Thông tin tài khoản',
  //     //   url: '/account/account-information',
  //     //   icon: 'icon-puzzle',
  //     // },
  //     {
  //       name: 'Thay đổi mật khẩu',
  //       url: '/account/change-pass',
  //       icon: 'icon-puzzle',
  //     },
  //   ],
  // },
  {
    name: "Quản lý người sử dụng",
    url: "/user-management",
    icon: "icon-plus",
    children: [
      {
        name: "Cấu hình nhóm NSD",
        url: "/user-management/user-management",
        icon: "icon-puzzle",
      },
      {
        name: "Quản lý tài khoản NSD",
        url: "/user-management/user-account-management",
        icon: "icon-puzzle",
        linkProps: { queryParams: { id: "something" } },
      },
      {
        name: "Thêm tài khoản NSD",
        url: "/user-management/add-user-account-management",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Tham số cấu hình",
    url: "/configuration-parameters",
    icon: "icon-plus",
    children: [
      {
        name: "Cấu hình trường học",
        url: "/configuration-parameters/configuration-school",
        icon: "icon-puzzle",
      },
      {
        name: "Cấu hình năm học",
        url: "/configuration-parameters/configuration-year",
        icon: "icon-puzzle",
      },
      {
        name: "Cấu hình học kỳ",
        url: "/configuration-parameters/configuration-semester",
        icon: "icon-puzzle",
      },
      {
        name: "Cấu hình tiết học",
        url: "/configuration-parameters/configuration-lesson",
        icon: "icon-puzzle",
      },
      {
        name: "Cấu hình khối",
        url: "/configuration-parameters/configuration-grade",
        icon: "icon-puzzle",
      },
      {
        name: "Phân phối môn học",
        url: "/configuration-parameters/declare-subject",
        icon: "icon-puzzle",
      },
      {
        name: "Chương trình học",
        url: "/configuration-parameters/study-program",
        icon: "icon-puzzle",
      },
      {
        name: "Mẫu nhận xét",
        url: "/configuration-parameters/configuration-comment-form",
        icon: "icon-puzzle",
      },
      {
        name: "Thời gian học / ngày lễ",
        url: "/configuration-parameters/study-time-holiday",
        icon: "icon-puzzle",
      },
      {
        name: "Khóa/mở sổ điểm",
        url: "/configuration-parameters/lock-unlock-academic-transcript",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Quản lý lớp học",
    url: "/class-management",
    icon: "icon-plus",
    children: [
      {
        name: "Danh sách lớp học",
        url: "/class-management/class-management-list",
        icon: "icon-puzzle",
      },
      {
        name: "Danh sách học sinh",
        url: "/class-management/class-management-student",
        icon: "icon-puzzle",
      },
      {
        name: "DS môn học theo lớp",
        url: "/class-management/class-management-subject",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Quản lý học sinh",
    url: "/student-management",
    icon: "icon-plus",
    children: [
      {
        name: "Điểm danh",
        url: "/student-management/attendance",
        icon: "icon-puzzle",
      },
      {
        name: "Danh sách học sinh",
        url: "/student-management/student-management-list",
        icon: "icon-puzzle",
      },
      {
        name: "Tạo mới học sinh",
        url: "/student-management/student-management-add",
        icon: "icon-puzzle",
      },
      {
        name: "Đăng ký môn học tự chọn",
        url: "/student-management/subject-registration",
        icon: "icon-puzzle",
      },
      {
        name: "Danh sách miễn môn",
        url: "/student-management/exemption-list",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Quản lý cán bộ",
    url: "/officials-management",
    icon: "icon-plus",
    children: [
      {
        name: "Danh sách cán bộ",
        url: "/officials-management/officials-list",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Giảng dạy",
    url: "/teaching",
    icon: "icon-plus",
    children: [
      {
        name: "Phân công chủ nhiệm",
        url: "/teaching/assign-homeroom-teaching",
        icon: "icon-puzzle",
      },
      {
        name: "Phân công giảng dạy",
        url: "/teaching/assign-of-teaching",
        icon: "icon-puzzle",
      },
      {
        name: "Thời khóa biểu",
        url: "/teaching/schedule",
        icon: "icon-puzzle",
      },
    ],
  },
  {
    name: "Sổ điểm điện tử",
    url: "/score-book",
    icon: "icon-plus",
    children: [
      {
        name: "Đánh giá định kỳ môn học",
        url: "/score-book/periodic-assessment",
        icon: "icon-puzzle",
      },
      {
        name: "Sổ điểm",
        url: "/score-book/academic-transcript",
        icon: "icon-puzzle",
      },
      {
        name: "Thi lại, rèn luyện trong hè",
        url: "/score-book/summer-training",
        icon: "icon-puzzle",
      },
      {
        name: "Bảng tổng hợp đánh giá KQ GD",
        url: "/score-book/primary-school-academic-transcript",
        icon: "icon-puzzle",
      },
      {
        name: "Đánh giá theo lớp",
        url: "/score-book/class-summations",
        icon: "icon-puzzle",
      },
    ],
  },
  // {
  //   title: true,
  //   name: 'Quản lý Danh mục'
  // },
  // {
  //   name: 'DM trường học',
  //   url: '/theme/colors',
  //   icon: 'icon-drop'
  // },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   icon: 'icon-pencil'
  // },
  // {
  //   name: 'User',
  //   url: '/theme/user',
  //   icon: 'icon-user'
  // },
  // {
  //   title: true,
  //   name: 'Components'
  // },
  // {
  //   name: 'Base',
  //   url: '/base',
  //   icon: 'icon-puzzle',
  //   children: [
  //     {
  //       name: 'Cards',
  //       url: '/base/cards',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Carousels',
  //       url: '/base/carousels',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Collapses',
  //       url: '/base/collapses',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Forms',
  //       url: '/base/forms',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Navbars',
  //       url: '/base/navbars',
  //       icon: 'icon-puzzle'

  //     },
  //     {
  //       name: 'Pagination',
  //       url: '/base/paginations',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Popovers',
  //       url: '/base/popovers',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Progress',
  //       url: '/base/progress',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Switches',
  //       url: '/base/switches',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tables',
  //       url: '/base/tables',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tabs',
  //       url: '/base/tabs',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tooltips',
  //       url: '/base/tooltips',
  //       icon: 'icon-puzzle'
  //     }
  //   ]
  // },
  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   icon: 'icon-cursor',
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons',
  //       icon: 'icon-cursor'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns',
  //       icon: 'icon-cursor'
  //     },
  //     {
  //       name: 'Brand Buttons',
  //       url: '/buttons/brand-buttons',
  //       icon: 'icon-cursor'
  //     }
  //   ]
  // },
  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   icon: 'icon-pie-chart'
  // },
  // {
  //   name: 'Icons',
  //   url: '/icons',
  //   icon: 'icon-star',
  //   children: [
  //     {
  //       name: 'CoreUI Icons',
  //       url: '/icons/coreui-icons',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'success',
  //         text: 'NEW'
  //       }
  //     },
  //     {
  //       name: 'Flags',
  //       url: '/icons/flags',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Font Awesome',
  //       url: '/icons/font-awesome',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'secondary',
  //         text: '4.7'
  //       }
  //     },
  //     {
  //       name: 'Simple Line Icons',
  //       url: '/icons/simple-line-icons',
  //       icon: 'icon-star'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   icon: 'icon-bell',
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Modals',
  //       url: '/notifications/modals',
  //       icon: 'icon-bell'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   icon: 'icon-calculator',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'Extras',
  // },
  // {
  //   name: 'Pages',
  //   url: '/pages',
  //   icon: 'icon-star',
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'icon-star'
  //     }
  //   ]
  // },
  // {
  //   name: 'Disabled',
  //   url: '/dashboard',
  //   icon: 'icon-ban',
  //   badge: {
  //     variant: 'secondary',
  //     text: 'NEW'
  //   },
  //   attributes: { disabled: true },
  // },
  // {
  //   name: 'Download CoreUI',
  //   url: 'http://coreui.io/angular/',
  //   icon: 'icon-cloud-download',
  //   class: 'mt-auto',
  //   variant: 'success',
  //   attributes: { target: '_blank', rel: 'noopener' }
  // },
  // {
  //   name: 'Try CoreUI PRO',
  //   url: 'http://coreui.io/pro/angular/',
  //   icon: 'icon-layers',
  //   variant: 'danger',
  //   attributes: { target: '_blank', rel: 'noopener' }
  // }
];

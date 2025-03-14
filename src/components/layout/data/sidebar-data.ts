//@ts-nocheck
import {
  IconBarcode,
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconBuildingWarehouse,
  IconBasket,
  IconCategory,
  IconCategoryPlus,
  IconHeartHandshake,
  IconBrandNem,
  IconUniverse,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Smart-POS',
      logo: Command,
      plan: '',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },

        // {
        //   title: 'Billing',
        //   url: '/billing',
        //   icon: IconLayoutDashboard,
        // },

        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
      ],
    },
    {
      title: 'Inventory Management',
      items: [
        {
          title: 'Inventory',
          icon: IconBuildingWarehouse,
          items: [
            // {
            //   title: 'Sign In',
            //   url: '/sign-in',
            // },
            {
              title: 'Products',
              url: '/inventory-management/products',
              icon: IconBasket,
            },
            {
              title: 'Create Product',
              url: '/inventory-management/productsadding',
              icon: IconBarcode,
            },
            // {
            //   title: 'Expired Products',
            //   url: '/inventory-management/expired-products',
            //   icon: IconBug,
            // },
            {
              title: 'Category',
              url: '/inventory-management/category-list',
              icon: IconCategory,
            },
            // {
            //   title: 'Sub Category',
            //   url: '/inventory-management/sub-category-list',
            //   icon: IconCategoryPlus,
            // },
            {
              title: 'Supplier',
              url: '/inventory-management/suppliers',
              icon: IconHeartHandshake,
            },
            {
              title: 'Manufacturers',
              url: '/inventory-management/brand-list',
              icon: IconBrandNem,
            },
            {
              title: 'Packs',
              url: '/inventory-management/units',
              icon: IconUniverse,
            },

            // {
            //   title: 'Forgot Password',
            //   url: '/forgot-password',
            // },
            // {
            //   title: 'OTP',
            //   url: '/otp',
            // },
          ],
        },
        // {
        //   title: 'Errors',
        //   icon: IconBug,
        //   items: [
        //     {
        //       title: 'Unauthorized',
        //       url: '/401',
        //       icon: IconLock,
        //     },
        //     {
        //       title: 'Forbidden',
        //       url: '/403',
        //       icon: IconUserOff,
        //     },
        //     {
        //       title: 'Not Found',
        //       url: '/404',
        //       icon: IconError404,
        //     },
        //     {
        //       title: 'Internal Server Error',
        //       url: '/500',
        //       icon: IconServerOff,
        //     },
        //     {
        //       title: 'Maintenance Error',
        //       url: '/503',
        //       icon: IconBarrierBlock,
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Stock Management',
    //   items: [
    //     {
    //       title: 'Stock',
    //       icon: IconBuildingWarehouse,
    //       items: [
    //         // {
    //         //   title: 'Sign In',
    //         //   url: '/sign-in',
    //         // },
    //         {
    //           title: 'Manage Stock',
    //           url: '/stock-management/manage-stock',
    //           icon: IconBarcode,
    //         },
    //       ],
    //     },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
    // {
    //   title: 'Sales Management',
    //   items: [
    //     {
    //       title: 'Sales',
    //       icon: IconBuildingWarehouse,
    //       items: [
    //         {
    //           title: 'Sales',
    //           url: '/sales-management/sales-list',
    //           icon: IconBarcode,
    //         },
    //         // {
    //         //   title: 'Forgot Password',
    //         //   url: '/forgot-password',
    //         // },
    //         // {
    //         //   title: 'OTP',
    //         //   url: '/otp',
    //         // },
    //       ],
    //     },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
    // {
    //   title: 'Promotion Management',
    //   items: [
    //     {
    //       title: 'Promotion',
    //       icon: IconBuildingWarehouse,
    //       items: [
    //         // {
    //         //   title: 'Sign In',
    //         //   url: '/sign-in',
    //         // },
    //         {
    //           title: 'Coupons',
    //           url: '/promotion-management/coupons',
    //           icon: IconBarcode,
    //         },

    //         // {
    //         //   title: 'Forgot Password',
    //         //   url: '/forgot-password',
    //         // },
    //         // {
    //         //   title: 'OTP',
    //         //   url: '/otp',
    //         // },
    //       ],
    //     },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
    // {
    //   title: 'Promotion Management',
    //   items: [
    //     {
    //       title: 'Promotion',
    //       icon: IconBuildingWarehouse,
    //       items: [
    //         // {
    //         //   title: 'Sign In',
    //         //   url: '/sign-in',
    //         // },
    //         {
    //           title: 'Coupons',
    //           url: '/promotion-management/coupons',
    //           icon: IconBarcode,
    //         },

    //         // {
    //         //   title: 'Forgot Password',
    //         //   url: '/forgot-password',
    //         // },
    //         // {
    //         //   title: 'OTP',
    //         //   url: '/otp',
    //         // },
    //       ],
    //     },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },

    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ],
}

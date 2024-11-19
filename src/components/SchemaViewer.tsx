'use client';
import { Calendar, Inbox, Search, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Home',
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export  function SchemaViewer() {


  return (
    <Sidebar className="bg-gradient-to-r from-white to-slate-200/50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-8 mb-4 !text-slate-800  flex justify-center  text-xl tracking-widest text-nowrap">
            Database Schema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <div 
                key={Math.random()} className="bg-white rounded-xl m-4 text-white w-full min-h-[250px]">
                  {item.title}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

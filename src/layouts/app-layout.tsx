import ChatBoxView from "@/components/chat-box-view";
import FriendsList from "@/components/partials/friends-list";
import Sidebar from "@/components/partials/sidebar";
import { ChatBoxProvider } from "@/components/providers/chat-box-provider";
import React from "react";
import { Outlet } from "react-router";

const AppLayout: React.FC = () => {
  return (
    <ChatBoxProvider>
      <div className="flex h-full min-h-full w-full flex-1 items-stretch justify-center">
        <div className="relative hidden sm:block">
          <Sidebar />
        </div>
        <main className="flex w-full min-w-[400px] flex-col p-2 md:min-w-[500px]">
          <Outlet />
        </main>
        <div className="relative hidden flex-1 lg:block">
          <FriendsList />
        </div>
        <ChatBoxView />
      </div>
    </ChatBoxProvider>
  );
};

export default AppLayout;

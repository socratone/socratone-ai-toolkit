'use client';

import { useState } from 'react';
import ChatBox from './components/ChatBox';
import ChatDrawer from './components/ChatDrawer';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ChatDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ChatBox onOpenMenu={() => setDrawerOpen(true)} />
    </>
  );
}

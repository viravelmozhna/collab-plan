"use client";

import { useEffect, useState } from "react";

// The API runs on a free tier that spins down after 15 minutes of inactivity
// and takes around a minute to wake. Without this, that first request just
// looks like the app is broken.
const WAKE_UP_DELAY_MS = 4000;

interface WakingUpNoticeProps {
  isActive?: boolean;
}

const WakingUpNotice = ({ isActive = true }: WakingUpNoticeProps) => {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsTakingLong(false);
      return;
    }

    const timer = setTimeout(() => setIsTakingLong(true), WAKE_UP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isTakingLong) return null;

  return (
    <p className="text-greyish-2 text-sm mt-12" role="status">
      The server is waking up after being idle. This can take up to a minute.
    </p>
  );
};

export default WakingUpNotice;

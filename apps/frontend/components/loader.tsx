"use client";

import WakingUpNotice from "./waking-up-notice";

export default function Loader() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-bluish rounded-full animate-spin"></div>
      <WakingUpNotice />
    </div>
  );
}

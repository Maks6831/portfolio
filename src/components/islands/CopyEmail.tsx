"use client";

import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

import MagicButton from "@/components/ui/MagicButton";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
  };

  return (
    <MagicButton
      title={copied ? "Email is Copied!" : "Copy my email address"}
      icon={<IoCopyOutline />}
      position="left"
      handleClick={handleCopy}
      otherClasses="!bg-[#161A31]"
    />
  );
}

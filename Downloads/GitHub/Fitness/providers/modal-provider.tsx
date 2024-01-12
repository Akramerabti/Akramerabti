"use client";

import { useEffect, useState } from "react";
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) {return null}

  return (
    <>
    <StoreModal />
    </>
  )
}
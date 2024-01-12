"use client";

import { Modal } from "@/components/ui/modal";
import { stat } from "fs";
import { useStoreModal } from "@/hooks/use-store-modal";
import { use, useEffect } from "react";
import { on } from "events";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
    
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen])


  return (
     <div className="p-4">
       Root Page
     </div>
    );
  }

  export default SetupPage;
  

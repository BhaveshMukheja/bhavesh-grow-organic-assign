// This is the Overlay component to take the input of the user for selecting multiple 
// across pages

import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";

interface OverlayProps {
  onSubmit: (inpSub: number) => void;
}

export default function Overlay({ onSubmit }: OverlayProps) {
  // using useRef hook for the reference managment

  const op = useRef<OverlayPanel | null>(null);

  // using useState hook for the state management of the input
  const [input, setInput] = useState<string>("");

  // Function to toggle the visibility of the OverlayPanel
  const toggleOverlay = (event: React.MouseEvent) => {
    if (op.current) {
      op.current.toggle(event); // Show/hide the overlay
    }
  };

  // Function to handle the submission of the input value

  const handleSubmit = () => {
    const inpSub = parseInt(input, 10);
    if (!isNaN(inpSub) && inpSub > 0) {
      onSubmit(inpSub);
      setInput("");
      if (op.current) {
        op.current.hide();
      }
    }
  };

  return (
    <div className="card flex justify-content-center">
      <i className="pi pi-angle-down" onClick={toggleOverlay} />

      <OverlayPanel ref={op}>
        <div
          className="card flex justify-content-center"
          style={{ padding: "10px 0px" }}
        >
          <InputText
            keyfilter="int"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Select Rows..."
          />
        </div>
        <Button type="button" label="Submit" onClick={handleSubmit} />
      </OverlayPanel>
    </div>
  );
}

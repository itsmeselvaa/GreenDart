import React, { useRef, useState } from "react";

const Courosel = () => {
  const scrollRef = useRef(null); // Ref for the scrollable div
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const [startX, setStartX] = useState(0); // Track starting X position
  const [scrollLeft, setScrollLeft] = useState(0); // Track scroll position

  // Handle mouse down (click)
  const handleStart = (e) => {
    setIsDragging(true);
    const x = e.pageX || e.touches[0].pageX; // Get X position (mouse or touch)
    setStartX(x - scrollRef.current.offsetLeft); // Calculate the start position relative to div

    setScrollLeft(scrollRef.current.scrollLeft); // Store the current scroll position
  };

  // Handle mouse move (drag)
  const handleMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX; // Get X position (mouse or touch)
    const walk = x - startX; // Calculate the movement (how much to scroll)
    console.log("X", x);
    console.log("scrollRef.current.offsetLeft", scrollRef.current.offsetLeft);
    console.log("startX", startX);
    console.log("walk", walk);
    console.log("scrollLeft", scrollLeft);
    scrollRef.current.scrollLeft = scrollLeft - walk; // Apply the scroll
  };

  // Handle mouse up or touch end (release drag)
  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <h2>Drag to Scroll Example</h2>
      <div
        ref={scrollRef}
        className={isDragging ? "cursor-grabbing" : "cursor-grab"}
        onMouseDown={handleStart} // Mouse down starts the drag
        onMouseMove={handleMove} // Mouse move handles scrolling
        onMouseUp={handleEnd} // Mouse up ends the drag
        onMouseLeave={handleEnd} // Mouse leave also ends the drag
        onTouchStart={handleStart} // Touch start (for mobile)
        onTouchMove={handleMove} // Touch move (for mobile)
        onTouchEnd={handleEnd} // Touch end (for mobile)
        style={{
          width: "100%",
          height: "200px",
          overflowX: "scroll", // Enable horizontal scroll
          whiteSpace: "nowrap", // Prevent wrapping, keep items in a line
          border: "1px solid black",
        }}
      >
        <div
          style={{
            width: "2000px", // Make the content larger than the container to allow scrolling
            height: "100%",
            background: "linear-gradient(to right, white, yellow)",
          }}
        >
          <p>Drag the container horizontally!</p>
        </div>
      </div>

      <p>
        Drag the content inside the box, and you'll see the horizontal scroll
        effect.
      </p>
    </div>
  );
};

export default Courosel;

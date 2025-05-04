import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
// const newArrivals = [
//   {
//     _id: "1",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=1",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "2",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=2",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "3",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=3",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "4",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=4",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "5",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=5",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "6",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=6",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "7",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=7",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "8",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=8",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
// ];

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );

        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; //scroll-faster
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = (e) => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? "-500" : "500";
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      setCanScrollLeft(leftScroll > 0);
      const rightScroll =
        container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollRight(rightScroll);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-16 px-4  ">
      <div className="relative container mx-auto text-center mb-15">
        <h2 className="text-3xl font-bold mb-4"> Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-40px] flex space-x-2 ">
          <button
            onClick={() => scroll("left")}
            className={`p-2 rounded border ${
              canScrollLeft
                ? " bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={!canScrollLeft}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded border ${
              canScrollRight
                ? " bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={!canScrollRight}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        draggable="false"
      >
        {newArrivals.map((item) => (
          <div
            key={item._id}
            className="relative min-w-[100%] sm:min-w-[50%] lg:min-w-[30%]"
          >
            <img
              src={item.images[0]?.url}
              alt=""
              className="w-full h-[500px] object-cover rounded-lg ]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md text-white  p-4 rounded-b-lg">
              <Link to={`/products/${item._id}`} className="block">
                <h4 className="font-medium">{item.name}</h4>
                <p className="mt-1"> ${item.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;

import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 50]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Gray",
    "Pink",
    "Purple",
    "Orange",
  ];
  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Silk",
    "Leather",
    "Denim",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "Under Armour",
    "Levi's",
    "H&M",
    "Zara",
    "Uniqlo",
    "Gap",
  ];
  const genders = ["Men", "Women"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      category: params.get("category") || "",
      gender: params.get("gender") || "",
      color: params.get("color") || "",
      size: params.get("size") ? params.get("size").split(",") : [],
      material: params.get("material") ? params.get("material").split(",") : [],
      brand: params.get("brand") ? params.get("brand").split(",") : [],
      minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : 0,
      maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : 100,
    });

    setPriceRange([
      params.get("minPrice") ? Number(params.get("minPrice")) : 0,
      params.get("maxPrice") ? Number(params.get("maxPrice")) : 100,
    ]);
  }, [searchParams, location.search]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorChange = (color) => {
    const newFilters = { ...filters, color };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newMaxPrice = Number(e.target.value);
    setPriceRange([0, newMaxPrice]);
    const newFilters = {
      ...filters,
      minPrice: 0,
      maxPrice: newMaxPrice,
    };
    setFilters(newFilters);
    // Delay updating URL slightly if you want (for better UX), or update immediately:
    searchParams.set("maxPrice", newMaxPrice);
    setSearchParams(searchParams);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(","));
      } else if (
        newFilters[key] !== "" &&
        newFilters[key] !== 0 &&
        newFilters[key].length > 0
      ) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 100,
    };
    setFilters(clearedFilters);
    setPriceRange([0, 100]);
    setSearchParams({});
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800">Filter</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 underline"
        >
          Clear
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div className="flex items-center space-x-2 mb-2" key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div className="flex items-center space-x-2 mb-2" key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <span>{gender}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 border rounded-full cursor-pointer transition hover:scale-105 ${
                filters.color === color ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div className="flex items-center space-x-2 mb-1" key={size}>
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="h-4 w-4 text-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
          <div className="flex items-center space-x-2  mb-1" key={brand}>
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="h-4 w-4 text-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div className="flex items-center space-x-2  mb-1" key={material}>
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="h-4 w-4 text-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <label className="block text-gray-800 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          step={1}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-700 mt-2 text-sm">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;

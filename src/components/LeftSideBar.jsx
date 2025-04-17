import React from "react";

function LeftSidebar({ isOpen, searchTerm, setSearchTerm, selectedOption, handleOptionSelect }) {
  const menuItems = ["Next Task", "My Leads", "My Active Leads", "My Inactive Leads", "Client", "Chat", "Profile"];

  const filteredItems = menuItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-40`}
    >
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <ul>
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(item)}
              className={`cursor-pointer px-4 py-2 rounded hover:bg-indigo-200 ${
                selectedOption === item ? "bg-indigo-300 font-semibold" : ""
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;

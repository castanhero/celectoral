import { useState } from "react";
import { FaUserTie, FaUsers, FaUserFriends, FaUserTag, FaHouseUser } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoPeopleCircle } from "react-icons/io5";

const navItems = [
  { id: "alcalde",  label: "Alcaldia",   icon: <FaUserTie /> },
  { id: "concejal", label: "Concejal",  icon: <FaUsers /> },
  { id: "gobernacion", label: "Gobernacion",  icon: <FaUserFriends  /> },
  

];
{/*  { id: "asambleistasterritorio", label: "Asambleístas por Territorio",  icon: <FaUserTag />},
  { id: "asambleistaspoblacion", label: "Asambleístas por Poblacion",  icon: <FaHouseUser /> }*/}
interface NavProps {
  onSelect: (id: string) => void;
  active: string;
}

export default function Nav({ onSelect, active }: NavProps) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 lg:justify-center">
          {navItems.map((item) => (
            <li key={item.id} className="shrink-0">
              <button
                onClick={() => onSelect(item.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition
                  ${
                    active === item.id
                      ? "bg-[#416972] text-white shadow"
                      : "text-[#416972] hover:bg-[#416972]/10 border border-[#416972]/20"
                  }`}>
                <span className="text-lg shrink-0">{item.icon}</span>
                <span className="leading-tight">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
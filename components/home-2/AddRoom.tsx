"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";



const AddRoom = ({ setTotal }) => {
  const [rooms, setRooms] = useState([{ adults: 0, children: 0, infants: 0 }]);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRoom = () => {
    if (rooms.length < 5) {
      setRooms([...rooms, { adults: 0, children: 0, infants: 0 }]);
    }
  };

  const handleRemoveRoom = (index: number) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
    calculateTotal(updatedRooms);
  };

  const handleChange = (index: number, type: 'adults' | 'children' | 'infants', value: number) => {
    const updatedRooms = [...rooms];
    
    if (updatedRooms[index]) {
      updatedRooms[index][type] = value;
      setRooms(updatedRooms);
      calculateTotal(updatedRooms);
    } else {
      console.error("Invalid index:", index);
    }
  };

  const calculateTotal = (rooms: Array<{ adults: number; children: number; infants: number }>) => {
    const totalCounts = rooms.reduce(
      (acc, room) => ({
        adults: acc.adults + room.adults,
        children: acc.children + room.children,
        infants: acc.infants + room.infants,
      }),
      { adults: 0, children: 0, infants: 0 }
    );
    setTotal(totalCounts);
  };

  const handleDone = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="border rounded-full p-3 cursor-pointer hover:bg-gray-200" onClick={() => setIsOpen(!isOpen)}>
        {rooms.reduce((acc, room) => acc + room.adults, 0)} adult - {rooms.reduce((acc, room) => acc + room.children, 0)} child - {rooms.reduce((acc, room) => acc + room.infants, 0)} infant
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50">
          <div className="relative bg-white border rounded-lg mt-2 p-4 shadow-lg w-96 z-50">
            {rooms.map((room, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Room {index + 1}</span>
                  {rooms.length > 1 && (
                    <button className="text-red-500 px-2" onClick={() => handleRemoveRoom(index)}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="block text-sm">Adult Age (13+)</label>
                    <select
                      value={room.adults}
                      onChange={(e) => handleChange(index, "adults", Number(e.target.value))}
                      className="w-full border rounded p-1"
                    >
                      <option value={0}></option>
                      {[...Array(4).keys()].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Child Age (6-12)</label>
                    <select
                      value={room.children}
                      onChange={(e) => handleChange(index, "children", Number(e.target.value))}
                      className="w-full border rounded p-1"
                    >
                      <option value={0}></option>
                      {[...Array(3).keys()].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Infant Age (0-5)</label>
                    <select
                      value={room.infants}
                      onChange={(e) => handleChange(index, "infants", Number(e.target.value))}
                      className="w-full border rounded p-1"
                    >
                      <option value={0}></option>
                      {[...Array(3).keys()].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <button 
                onClick={handleAddRoom} 
                className="bg-primary text-white p-2 rounded" 
                disabled={rooms.length >= 5}
              >
                Add Room
              </button>
              
              <button 
                onClick={handleDone} 
                className="bg-green-500 text-white p-2 rounded ml-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoom;

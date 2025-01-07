import { Key, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const AddRoom = () => {
  const [rooms, setRooms] = useState(() => {
    // Initialize rooms state from localStorage if available
    const savedRooms = localStorage.getItem("addedRooms");
    return savedRooms ? JSON.parse(savedRooms) : [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [localTotal, setLocalTotal] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // Calculate totals from initial localStorage data
  useEffect(() => {
    const calculateTotals = () => {
      const totalAdultCount = rooms.reduce((acc: any, room: { adults: any; }) => acc + room.adults, 0);
      const totalChildrenCount = rooms.reduce(
        (acc: any, room: { children: any; }) => acc + room.children,
        0
      );
      const totalInfantCount = rooms.reduce((acc: any, room: { infants: any; }) => acc + room.infants, 0);

      setLocalTotal({
        adults: totalAdultCount,
        children: totalChildrenCount,
        infants: totalInfantCount,
      });
    };

    calculateTotals();
  }, [rooms]);

  const handleAddRoom = () => {
    if (rooms.length < 5) {
      setRooms([...rooms, { adults: 1, children: 0, infants: 0 }]);
    } else {
      alert("You can only add up to 5 rooms if available.");
    }
  };

  const handleRemoveRoom = (index: any) => {
    setRooms(rooms.filter((_: any, i: any) => i !== index));
  };

  // const handleChange = (index: string | number, type: string, value: number) => {
  //   const updatedRooms = [...rooms];
  //   updatedRooms[index][type] = value;
  //   setRooms(updatedRooms);
  // };

  const handleChange = (index: number, type: string, value: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][type] = value;
    setRooms(updatedRooms);
  };


  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
    if (rooms.length === 0) {
      setRooms([{ adults: 1, children: 0, infants: 0 }]);
    }
  };

  const handleDone = () => {
    localStorage.removeItem("restrictValue");
    const totalAdultCount = rooms.reduce((acc: any, room: { adults: any; }) => acc + room.adults, 0);
    const totalChildrenCount = rooms.reduce(
      (acc: any, room: { children: any; }) => acc + room.children,
      0
    );
    const totalInfantCount = rooms.reduce((acc: any, room: { infants: any; }) => acc + room.infants, 0);
    // const totalExtraBeds = rooms.reduce((acc: string | number, room: { adults: number; }) => acc + (room.adults > 2 ? 1 : 0), 0);
    const totalExtraBeds = rooms.reduce((acc: number, room: { adults: number }) => acc + (room.adults > 2 ? 1 : 0), 0);

    const totals = {
      totalRooms: rooms.length,
      adults: totalAdultCount,
      children: totalChildrenCount,
      infants: totalInfantCount,
      extraBeds: totalExtraBeds,
    };

    setLocalTotal(totals);

    // Save the room details and totals in localStorage
    localStorage.setItem("addedRooms", JSON.stringify(rooms));
    localStorage.removeItem("roomId");
    localStorage.setItem("totalCounts", JSON.stringify(totals));


    setIsOpen(false);
  };


  return (
    <div className="relative">
      <div
        className="border rounded-full p-3 cursor-pointer hover:bg-gray-200"
        onClick={handleOpenDropdown}
      >
        {rooms.length > 0
          ? `${rooms.length} room${rooms.length > 1 ? "s" : ""} - ${localTotal.adults
          } adult${localTotal.adults !== 1 ? "s" : ""} - ${localTotal.children
          } child${localTotal.children !== 1 ? "ren" : ""} - ${localTotal.infants
          } infant${localTotal.infants !== 1 ? "s" : ""}`
          : "0 rooms - 0 adults - 0 children - 0 infants"}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50">
          <div className="relative bg-white border rounded-lg mt-2 p-4 shadow-lg w-96 z-50">
            {rooms.map((room: { adults: string | number | readonly string[] | undefined; children: string | number | readonly string[] | undefined; infants: string | number | readonly string[] | undefined; }, index: number | null | undefined) => (
              <div key={index} className="mb-4">
                <div className="flex gap-4 items-center mb-3">
                  <div className="flex-1">
                    <label>Adults Age</label>
                    <p>Age(12+)</p>
                    <select
                      value={room.adults}
                      onChange={(e) =>
                        index !== null && index !== undefined && handleChange(index, "adults", parseInt(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label>Children</label>
                    <p>Age(6-11)</p>
                    <select
                      value={room.children}
                      onChange={(e) =>
                        index !== null && index !== undefined && handleChange(index, "children", parseInt(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label>Infants</label>
                    <p>Age(0-5)</p>
                    <select
                      value={room.infants}
                      onChange={(e) =>
                        index !== null && index !== undefined && handleChange(index, "infants", parseInt(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                    </select>
                  </div>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => index !== null && index !== undefined && handleRemoveRoom(index)}
                      className="text-red-500 ml-4"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={handleAddRoom}
                className="bg-primary text-white p-2 rounded"
              >
                Add Room
              </button>
              <button
                onClick={handleDone}
                className="bg-primary text-white p-2 rounded"
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

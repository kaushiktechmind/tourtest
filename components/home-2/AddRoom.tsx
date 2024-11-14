import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

<<<<<<< HEAD
const AddRoom = ({ setRooms, onTotalChange }) => {
  const [rooms, setLocalRooms] = useState([]); // Start with an empty array for 0 rooms
=======


const AddRoom = ({ setTotal, locationName, formattedStartDate, formattedEndDate, adults }) => {
  const [rooms, setRooms] = useState([{ adults: 0, children: 0, infants: 0, noOfRooms: 0 }]);
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
  const [isOpen, setIsOpen] = useState(false);
  const [localTotal, setLocalTotal] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const handleAddRoom = () => {
    if (rooms.length < 5) {
      const newRooms = [...rooms, { adults: 0, children: 0, infants: 0 }];
      setLocalRooms(newRooms); // Update local state
      setRooms(newRooms); // Pass updated rooms to parent
    }
  };

<<<<<<< HEAD
  const handleRemoveRoom = (index) => {
=======
  const router = useRouter();
  const searchParams = useSearchParams();
  const adultNo = Number(searchParams.get("adults"));
  const childrenNo = Number(searchParams.get("children"));
  const infantNo = Number(searchParams.get("infants"));

  const handleRemoveRoom = (index: number) => {
>>>>>>> 539b3b455f5b1a085afecd8b82305fc4076464de
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setLocalRooms(updatedRooms);
    setRooms(updatedRooms); // Pass updated rooms to parent
  };

  const handleChange = (index, type, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][type] = value;
    setLocalRooms(updatedRooms); // Update local state
    setRooms(updatedRooms); // Pass updated rooms to parent
  };

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
    if (rooms.length === 0) {
      setLocalRooms([{ adults: 0, children: 0, infants: 0 }]);
    }
  };

  const handleDone = () => {
    // Calculate total counts when 'Done' is clicked
    const totalAdultCount = rooms.reduce((acc, room) => acc + room.adults, 0);
    const totalChildrenCount = rooms.reduce(
      (acc, room) => acc + room.children,
      0
    );
    const totalInfantCount = rooms.reduce((acc, room) => acc + room.infants, 0);

    setLocalTotal({
      adults: totalAdultCount,
      children: totalChildrenCount,
      infants: totalInfantCount,
    });

    // Trigger the parent callback with updated total counts
    if (onTotalChange) {
      onTotalChange({ totalAdultCount, totalChildrenCount, totalInfantCount });
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="border rounded-full p-3 cursor-pointer hover:bg-gray-200"
        onClick={handleOpenDropdown}
      >
        {rooms.length > 0
          ? `${rooms.length} room${rooms.length > 1 ? "s" : ""} - ${
              localTotal.adults
            } adult${localTotal.adults !== 1 ? "s" : ""} - ${
              localTotal.children
            } child${localTotal.children !== 1 ? "ren" : ""} - ${
              localTotal.infants
            } infant${localTotal.infants !== 1 ? "s" : ""}`
          : "0 rooms - 0 adults - 0 children - 0 infants"}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50">
          <div className="relative bg-white border rounded-lg mt-2 p-4 shadow-lg w-96 z-50">
            {rooms.map((room, index) => (
              <div key={index} className="mb-4">
                <div className="flex gap-4 items-center mb-3">
                  <div className="flex-1">
                    <label>Adults Age</label>
                    <p>Age(13+)</p>
                    <select
                      value={room.adults}
                      onChange={(e) =>
                        handleChange(index, "adults", parseInt(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label>Children</label>
                    <p>Age(6-5)</p>
                    <select
                      value={room.children}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "children",
                          parseInt(e.target.value)
                        )
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
                        handleChange(index, "infants", parseInt(e.target.value))
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveRoom(index)}
                    className="text-red-500 ml-4"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
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

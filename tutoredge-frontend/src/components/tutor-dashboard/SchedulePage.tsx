import 'react-day-picker/dist/style.css'; // Import base styles

import { format } from 'date-fns';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';

import Button from '../ui/Button';

// --- Types and Mock Data ---
type Availability = {
  day: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

const initialAvailability: Availability[] = [
  { day: 'Monday', isAvailable: true, startTime: '15:00', endTime: '21:00' },
  { day: 'Tuesday', isAvailable: true, startTime: '15:00', endTime: '21:00' },
  { day: 'Wednesday', isAvailable: true, startTime: '15:00', endTime: '21:00' },
  { day: 'Thursday', isAvailable: true, startTime: '15:00', endTime: '21:00' },
  { day: 'Friday', isAvailable: true, startTime: '15:00', endTime: '21:00' },
  { day: 'Saturday', isAvailable: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Sunday', isAvailable: false, startTime: '09:00', endTime: '17:00' },
];

const confirmedBookings = [
  new Date(2025, 8, 28),
  new Date(2025, 8, 30),
  new Date(2025, 9, 5),
];

// --- Sub-Component for a single day's availability row ---
// Corrected type definition here
const AvailabilityRow: React.FC<{
  dayData: Availability;
  onUpdate: (day: string, data: Partial<Availability>) => void;
}> = ({ dayData, onUpdate }) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">{dayData.day}</p>
          <p
            className={`text-sm ${dayData.isAvailable ? 'text-green-600' : 'text-gray-500'}`}
          >
            {dayData.isAvailable ? 'Available' : 'Unavailable'}
          </p>
        </div>
        <input
          type="checkbox"
          checked={dayData.isAvailable}
          onChange={(e) =>
            onUpdate(dayData.day, { isAvailable: e.target.checked })
          }
          className="h-6 w-10 cursor-pointer appearance-none rounded-full bg-gray-300 transition duration-200 checked:bg-blue-600"
        />
      </div>
      {dayData.isAvailable && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="text-xs text-gray-500">Start time</label>
            <input
              type="time"
              value={dayData.startTime}
              onChange={(e) =>
                onUpdate(dayData.day, { startTime: e.target.value })
              }
              className="mt-1 w-full rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">End time</label>
            <input
              type="time"
              value={dayData.endTime}
              onChange={(e) =>
                onUpdate(dayData.day, { endTime: e.target.value })
              }
              className="mt-1 w-full rounded-md border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
const SchedulePage = () => {
  const [availability, setAvailability] =
    useState<Availability[]>(initialAvailability);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [timeOff, setTimeOff] = useState<Date[]>([new Date(2025, 9, 10)]);

  const handleAvailabilityUpdate = (
    day: string,
    data: Partial<Availability>,
  ) => {
    setAvailability((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...data } : d)),
    );
  };

  const handleSaveChanges = () => {
    // console.log('Saving updated availability:', availability);
    // alert('Availability saved! (Simulated)');
  };

  const handleAddTimeOff = () => {
    if (!selectedDay) return;
    if (timeOff.some((d) => d.getTime() === selectedDay.getTime())) return;
    setTimeOff(
      [...timeOff, selectedDay].sort((a, b) => a.getTime() - b.getTime()),
    );
    // console.log('Adding time off for:', selectedDay);
  };

  const handleRemoveTimeOff = (dateToRemove: Date) => {
    setTimeOff(timeOff.filter((d) => d.getTime() !== dateToRemove.getTime()));
    // console.log('Removing time off for:', dateToRemove);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ================= SCHEDULE & AVAILABILITY HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow">
  <h1 className="text-xl font-bold">
    Schedule & Availability
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Set your weekly teaching hours and manage specific days off
    easily.
  </p>
</div>

{/* ================= INFO / GUIDELINES ================= */}
<div className="mb-6 rounded-xl bg-white p-4 shadow-sm text-sm text-gray-700">
  <p className="mb-1 font-semibold text-gray-800">
    Scheduling Guidelines
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>
      Define your regular teaching availability for each day of
      the week.
    </li>
    <li>
      Mark specific dates as unavailable for planned leaves or
      holidays.
    </li>
    <li>
      Students will only be able to book sessions during your
      available time slots.
    </li>
    <li>
      Keeping your schedule updated helps avoid booking
      conflicts.
    </li>
  </ul>
</div>

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Schedule & Availability
        </h1>
        <p className="mt-1 text-gray-500">
          Set your weekly teaching hours and manage specific days off.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Recurring Availability
            </h2>
            <Button onClick={handleSaveChanges}>Save</Button>
          </div>
          {availability.map((dayData) => (
            <AvailabilityRow
              key={dayData.day}
              dayData={dayData}
              onUpdate={handleAvailabilityUpdate}
            />
          ))}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-4 px-2 text-xl font-bold text-gray-800">
            My Calendar
          </h2>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={{ booked: confirmedBookings, timeOff }}
            modifiersClassNames={{
              booked: 'bg-blue-200 rounded-full',
              timeOff: 'bg-red-200 text-red-900 rounded-full',
            }}
            defaultMonth={new Date(2025, 8)}
          />
          <div className="mt-4 border-t px-2 pt-4">
            {selectedDay ? (
              <div>
                <p className="font-semibold text-gray-800">
                  Selected Day: {format(selectedDay, 'PPP')}
                </p>
                <Button onClick={handleAddTimeOff} className="mt-2">
                  Add Time Off
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Select a date to view details or add time off.
              </p>
            )}

            {timeOff.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">
                  Scheduled Time Off
                </h3>
                <ul className="mt-2 space-y-2">
                  {timeOff.map((date) => (
                    <li
                      key={date.toString()}
                      className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                    >
                      <span className="text-sm text-gray-700">
                        {format(date, 'PPP')}
                      </span>
                      <button
                        onClick={() => handleRemoveTimeOff(date)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 border-t pt-4 text-sm text-gray-600">
              <div className="mb-1 flex items-center gap-2">
                <span className="size-4 rounded-full bg-blue-200"></span> =
                Confirmed Booking
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-full bg-red-200"></span> = Time
                Off
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;

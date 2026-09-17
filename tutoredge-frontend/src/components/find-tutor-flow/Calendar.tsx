import React from 'react';

interface CalendarProps {
  month: number; // 1-12
  year: number;
  availableDates: string[]; // dates in 'YYYY-MM-DD'
  selectedDates: string[];
  onSelectDate: (date: string) => void;
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const Calendar: React.FC<CalendarProps> = ({
  month,
  year,
  availableDates,
  selectedDates,
  onSelectDate,
}) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekDay = new Date(year, month - 1, 1).getDay();

  const dates: (string | null)[] = [
    ...Array(firstWeekDay).fill(null),
    ...Array(daysInMonth)
      .fill(null)
      .map(
        (_, i) =>
          `${year}-${month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`,
      ),
  ];

  return (
    <div style={{ width: 250, margin: 10 }}>
      <h4 style={{ textAlign: 'center' }}>
        {new Date(year, month - 1).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })}
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          marginBottom: 8,
        }}
      >
        {weekDays.map((wd) => (
          <div key={wd} style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {wd}
          </div>
        ))}
        {dates.map((date, i) => {
          if (!date) return <div key={i}></div>;

          const isAvailable = availableDates.includes(date);
          const isSelected = selectedDates.includes(date);

          // Helper function for the 'no-nested-ternary' fix
          const getTextColor = () => {
            if (isSelected) {
              return 'white';
            }
            if (isAvailable) {
              return 'black';
            }
            return '#ccc';
          };

          return (
            <div
              key={date}
              onClick={() => isAvailable && onSelectDate(date)}
              style={{
                textAlign: 'center',
                padding: 8,
                borderRadius: 4,
                backgroundColor: isSelected ? '#007bff' : 'transparent',
                color: getTextColor(), // Use the helper function
                cursor: isAvailable ? 'pointer' : 'default',
                userSelect: 'none',
                border: isSelected
                  ? '2px solid #0056b3'
                  : '1px solid transparent',
              }}
            >
              {/* --- THIS IS THE FIX ---
                We provide a fallback '0' to parseInt in case [2] is undefined,
                which satisfies TypeScript.
              */}
              {parseInt(date.split('-')[2] || '0', 10)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

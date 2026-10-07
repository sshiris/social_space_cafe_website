"use client";

import { useState } from "react";
import { meetingRoomSlots } from "@/lib/booking-slots";

export function BookingSlotSelector() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  return (
    <div>
      <label>
        Choose a date
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => {
            setSelectedDate(event.target.value);
            setSelectedSlots([]);
          }}
        />
      </label>

      {selectedDate && (
        <div>
          {meetingRoomSlots.map((slot) => (
            <button key={slot.startTime} type="button">
              {slot.startTime}–{slot.endTime}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
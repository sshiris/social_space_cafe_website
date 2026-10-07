export const meetingRoomSlots = [
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "10:00", endTime: "11:00" },
  { startTime: "11:00", endTime: "12:00" },
  { startTime: "12:00", endTime: "13:00" },
  { startTime: "13:00", endTime: "14:00" },
  { startTime: "14:00", endTime: "15:00" },
  { startTime: "15:00", endTime: "16:00" },
];

type BookedSlot = {
  startTime: string;
};

export function getAvailableSlots(bookedSlots: BookedSlot[]) {
  return meetingRoomSlots.map((slot) => {
    const isBooked = bookedSlots.some(
      (bookedSlot) => bookedSlot.startTime.slice(0, 5) === slot.startTime,
    );

    return {
      ...slot,
      available: !isBooked,
    };
  });
}

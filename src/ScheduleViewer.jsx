/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const ScheduleViewer = ({ shiftsData, users }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert users array to object for easy lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = {
        name: user.name,
        // Assign different base colors for each user
        color: user.id === 23 ? '#047857' : user.id === 24 ? '#ea580c' : '#0369a1',
      };
    });

    const newEvents = [];

    // Process Layer 1
    shiftsData.layers[0].layers.forEach(shift => {
      newEvents.push({
        title: `L1: ${userMap[shift.userId].name}`,
        start: shift.startDate,
        end: shift.endDate,
        backgroundColor: userMap[shift.userId].color,
        classNames: ['layer-1'],
        extendedProps: { layer: 1 }
      });
    });

    // Process Layer 2
    if (shiftsData.layers[1]?.layers) {
      shiftsData.layers[1].layers.forEach(shift => {
        newEvents.push({
          title: `L2: ${userMap[shift.userId].name}`,
          start: shift.startDate,
          end: shift.endDate,
          backgroundColor: userMap[shift.userId].color,
          classNames: ['layer-2'],
          extendedProps: { layer: 2 }
        });
      });
    }

    // Process Final Schedule
    shiftsData.finalSchedule.forEach(shift => {
      newEvents.push({
        title: `Final: ${userMap[shift.userId].name}`,
        start: shift.startDate,
        end: shift.endDate,
        backgroundColor: userMap[shift.userId].color,
        classNames: ['final-schedule'],
        extendedProps: { layer: 'final' }
      });
    });

    setEvents(newEvents);
  }, [shiftsData, users]);

  function renderEventContent(eventInfo) {
    const layer = eventInfo.event.extendedProps.layer;
    let opacity = '1';
    let border = 'none';

    // Visual distinctions for different layers
    switch (layer) {
      case 1:
        opacity = '0.7';
        break;
      case 2:
        opacity = '0.85';
        border = '2px dashed white';
        break;
      case 'final':
        border = '2px solid white';
        break;
      default:
        break;
    }

    return (
      <div
        className="p-1 rounded cursor-pointer"
        style={{
          backgroundColor: eventInfo.backgroundColor,
          opacity,
          border
        }}
      >
        <i className="text-white text-sm">{eventInfo.event.title}</i>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
        }}
        slotDuration="06:00:00"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        events={events}
        height="80vh"
        eventContent={renderEventContent}
        allDaySlot={false}
      />

      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold">Legend</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 opacity-70" style={{ backgroundColor: '#047857' }}></div>
            <span>Layer 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 opacity-85 border-2 border-dashed border-white" style={{ backgroundColor: '#047857' }}></div>
            <span>Layer 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-solid border-white" style={{ backgroundColor: '#047857' }}></div>
            <span>Final Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewer;
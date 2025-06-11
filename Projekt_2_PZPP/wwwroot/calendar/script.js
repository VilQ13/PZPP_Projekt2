document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');
    const colorMenu = document.getElementById('colorMenu');
    let selectedEvent = null;

    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first');
        window.location.href = '/login'; 
        return;
    }

    const colors = [
        '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf',
        '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
        '#fffffc', '#d0f4de', '#f0efeb', '#a9def9'
    ];

    colorMenu.innerHTML = '';
    colors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = color;
        div.onclick = async () => {
            if (selectedEvent) {
                await updateEventColor(selectedEvent, color);
            }
            colorMenu.style.display = 'none';
        };
        colorMenu.appendChild(div);
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: false,
        editable: true,
        eventDisplay: 'block',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const res = await fetch('/api/calendarevents', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });

                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                    return;
                }

                if (!res.ok) throw new Error('Failed to fetch events');
                const events = await res.json();

                
                const fcEvents = events.map(e => ({
                    id: e.id,
                    title: e.title,
                    start: e.start,
                    end: e.end || null,
                    allDay: e.allDay,
                    backgroundColor: e.backgroundColor,
                    borderColor: e.borderColor,
                    extendedProps: {
                        description: e.description
                    }
                }));

                successCallback(fcEvents);
            } catch (err) {
                console.error('Error fetching events:', err);
                failureCallback(err);
            }
        },

        dateClick: async function (info) {
            const title = prompt('Add event title:', 'New event');
            if (!title) return;

            const startDate = new Date(info.dateStr);
            const endDate = new Date(info.dateStr);
            endDate.setHours(23, 59, 59); 

            const event = {
                title,
                start: startDate.toISOString(),
                end: endDate.toISOString(), 
                allDay: true,
                backgroundColor: 'lightblue',
                borderColor: 'blue',
                description: ''
            };

            try {
                const res = await fetch('/api/calendarevents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(event)
                });

                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                    return;
                }

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Server error:', errorData);
                    throw new Error('Failed to add event');
                }

                const newEventDto = await res.json();

               
                calendar.addEvent({
                    id: newEventDto.id,
                    title: newEventDto.title,
                    start: newEventDto.start,
                    end: newEventDto.end || null,
                    allDay: newEventDto.allDay,
                    backgroundColor: newEventDto.backgroundColor,
                    borderColor: newEventDto.borderColor,
                    extendedProps: {
                        description: newEventDto.description
                    }
                });
            } catch (err) {
                console.error('Error adding event:', err);
                alert('Failed to add event');
            }
        },

        eventClick: async function (info) {
            const newTitle = prompt('Edit event title:', info.event.title);
            if (newTitle === null) return;

            info.event.setProp('title', newTitle);

            await updateEvent(info.event);
        },

        eventDidMount: function (info) {
            info.el.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                selectedEvent = info.event;
                colorMenu.style.top = `${e.pageY}px`;
                colorMenu.style.left = `${e.pageX}px`;
                colorMenu.style.display = 'block';
            });
        },

        eventChange: async function (info) {
            await updateEvent(info.event);
        }
    });

    document.addEventListener('click', () => {
        colorMenu.style.display = 'none';
    });

    calendar.render();

    async function updateEvent(event) {
       
        let startDate = event.start;
        let endDate = event.end;

        
        if (!endDate) {
            endDate = new Date(startDate);
            if (event.allDay) {
                endDate.setHours(23, 59, 59);
            } else {
                endDate.setHours(endDate.getHours() + 1);
            }
        }

        const eventData = {
            id: event.id,
            title: event.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(), 
            allDay: event.allDay,
            backgroundColor: event.backgroundColor,
            borderColor: event.borderColor,
            description: event.extendedProps.description || ''
        };

        try {
            const res = await fetch(`/api/calendarevents/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(eventData)
            });

            if (res.status === 401) {
                alert('Session expired. Please log in again.');
                window.location.href = '/login';
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Server error:', errorData);
                throw new Error('Failed to update event');
            }
        } catch (err) {
            console.error('Error updating event:', err);
            alert('Failed to update event');
        }
    }

    async function updateEventColor(event, color) {
        event.setProp('backgroundColor', color);
        event.setProp('borderColor', color);

        await updateEvent(event);
    }
});
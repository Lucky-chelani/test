import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';

const CalendarContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MonthYear = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 150px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 20px;
`;

const DayHeader = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  padding: 8px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
  
  ${props => props.disabled && `
    color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
  `}
  
  ${props => props.isToday && `
    border: 2px solid #4CAF50;
  `}
  
  ${props => props.isSelected && `
    background: #4CAF50;
    color: white;
    font-weight: 600;
  `}
  
  ${props => !props.disabled && !props.isSelected && `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  `}
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const QuickSelectButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const DateRangeInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const SelectedDatesInfo = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const SelectedCount = styled.div`
  color: #4CAF50;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectedDatesList = styled.div`
  max-height: 120px;
  overflow-y: auto;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const DateAvailabilitySelector = ({ 
  selectedDates = [], 
  onChange,
  minDate = null,
  maxDate = null,
  label = "Available Dates"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = selectedDates.includes(dateStr);
      const isPast = currentDate < today;
      const isBeforeMin = minDate && currentDate < new Date(minDate);
      const isAfterMax = maxDate && currentDate > new Date(maxDate);
      const isDisabled = !isCurrentMonth || isPast || isBeforeMin || isAfterMax;

      days.push({
        date: new Date(currentDate),
        dateStr,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (dateStr, isDisabled) => {
    if (isDisabled) return;

    console.log("📅 Date clicked in selector:", dateStr, "- updating local state only");

    const newSelectedDates = selectedDates.includes(dateStr)
      ? selectedDates.filter(date => date !== dateStr)
      : [...selectedDates, dateStr].sort();

    // Call onChange immediately for now, but we could add debouncing here if needed
    console.log("📤 Calling onChange with new dates:", newSelectedDates);
    onChange(newSelectedDates);
  };

  const handlePrevMonth = () => {
    console.log("⬅️ Previous month clicked - changing calendar view only");
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    console.log("➡️ Next month clicked - changing calendar view only");
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const selectDateRange = () => {
    if (!rangeStart || !rangeEnd) return;

    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    
    if (start > end) return;

    const newDates = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check if date is valid (not in the past, within min/max range)
      const isPast = currentDate < today;
      const isBeforeMin = minDate && currentDate < new Date(minDate);
      const isAfterMax = maxDate && currentDate > new Date(maxDate);
      
      if (!isPast && !isBeforeMin && !isAfterMax) {
        newDates.push(dateStr);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const allSelected = [...new Set([...selectedDates, ...newDates])].sort();
    onChange(allSelected);
  };

  const clearAllDates = () => {
    onChange([]);
  };

  const selectWeekends = () => {
    const days = generateCalendarDays();
    const weekendDates = days
      .filter(day => 
        day.isCurrentMonth && 
        !day.isDisabled && 
        (day.date.getDay() === 0 || day.date.getDay() === 6)
      )
      .map(day => day.dateStr);

    const allSelected = [...new Set([...selectedDates, ...weekendDates])].sort();
    onChange(allSelected);
  };

  const calendarDays = generateCalendarDays();

  return (
    <CalendarContainer>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', display: 'block', marginBottom: '10px' }}>
          {label}
        </label>
        
        <DateRangeInputs>
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
              Range Start Date
            </label>
            <DateInput
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              min={minDate || today.toISOString().split('T')[0]}
              max={maxDate}
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
              Range End Date
            </label>
            <DateInput
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              min={rangeStart || minDate || today.toISOString().split('T')[0]}
              max={maxDate}
            />
          </div>
        </DateRangeInputs>

        <ControlsContainer>
          <QuickSelectButton type="button" onClick={selectDateRange} disabled={!rangeStart || !rangeEnd}>
            <FiCheck /> Select Range
          </QuickSelectButton>
          <QuickSelectButton type="button" onClick={selectWeekends}>
            <FiCalendar /> Add Weekends
          </QuickSelectButton>
          <QuickSelectButton type="button" onClick={clearAllDates}>
            <FiX /> Clear All
          </QuickSelectButton>
        </ControlsContainer>
      </div>

      <CalendarHeader>
        <MonthNavigation>
          <NavButton type="button" onClick={handlePrevMonth}>
            <FiChevronLeft />
          </NavButton>
          <MonthYear>
            {monthNames[currentMonth]} {currentYear}
          </MonthYear>
          <NavButton type="button" onClick={handleNextMonth}>
            <FiChevronRight />
          </NavButton>
        </MonthNavigation>
      </CalendarHeader>

      <CalendarGrid>
        {dayNames.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            disabled={day.isDisabled}
            isToday={day.isToday}
            isSelected={day.isSelected}
            onClick={() => handleDateClick(day.dateStr, day.isDisabled)}
          >
            {day.day}
          </DayCell>
        ))}
      </CalendarGrid>

      {selectedDates.length > 0 && (
        <SelectedDatesInfo>
          <SelectedCount>
            <FiCheck />
            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
          </SelectedCount>
          <SelectedDatesList>
            {selectedDates.slice(0, 10).map(date => (
              <div key={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            ))}
            {selectedDates.length > 10 && (
              <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
                ...and {selectedDates.length - 10} more dates
              </div>
            )}
          </SelectedDatesList>
        </SelectedDatesInfo>
      )}
    </CalendarContainer>
  );
};

export default DateAvailabilitySelector;

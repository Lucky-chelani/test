import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiEdit, FiChevronUp, FiChevronDown, FiCalendar, FiMapPin } from 'react-icons/fi';

const Container = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItineraryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItineraryItem = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.isOpen ? '16px' : '0'};
  cursor: pointer;
`;

const DayLabel = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: #FF6B6B;
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: rgba(255, 87, 87, 0.3);
    color: #ff5757;
  }
`;

const ItemContent = styled.div`
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
`;

const ItemForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 10px 12px;
  color: white;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 10px 12px;
  color: white;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

// Add this new component definition
const DualInputRow = styled.div`
  display: flex;
  gap: 12px;
  
  /* This is the responsive magic */
  @media (max-width: 480px) {
    flex-direction: column; 
  }
`;

/**
 * Itinerary Manager Component for Day-by-Day Trek Planning
 */
const ItineraryManager = ({ itinerary = [], onChange }) => {
  const [openItemId, setOpenItemId] = useState(null);
  
  // Helper to create a new itinerary item
  const createNewItem = () => ({
    id: `day-${Date.now()}`,
    day: itinerary.length + 1,
    title: `Day ${itinerary.length + 1}`,
    description: '',
    activities: [],
    location: '',
    distance: '',
    elevation: '',
    meals: { breakfast: true, lunch: true, dinner: true },
    accommodation: 'Camp'
  });
  
  // Add a new item to the itinerary
  const handleAddItem = () => {
    const newItem = createNewItem();
    const newItinerary = [...itinerary, newItem];
    onChange(newItinerary);
    setOpenItemId(newItem.id);
  };
  
  // Edit an existing item
  const handleEditItem = (id, field, value) => {
    const newItinerary = itinerary.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(newItinerary);
  };
  
  // Delete an item
  const handleDeleteItem = (id) => {
    // Remove the item
    let newItinerary = itinerary.filter(item => item.id !== id);
    
    // Renumber the days
    newItinerary = newItinerary.map((item, index) => ({
      ...item,
      day: index + 1,
      title: item.title.startsWith('Day ') ? `Day ${index + 1}` : item.title
    }));
    
    onChange(newItinerary);
    
    // If the deleted item was open, close it
    if (openItemId === id) {
      setOpenItemId(null);
    }
  };
  
  // Toggle item open/closed state
  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };
  
  return (
    <Container>
      <Title>
        <FiCalendar /> Day-by-Day Itinerary
      </Title>
      
      <ItineraryList>
        {itinerary.map((item, index) => (
          <ItineraryItem key={item.id}>
            <ItemHeader 
              onClick={() => toggleItem(item.id)}
              isOpen={openItemId === item.id}
            >
              <DayLabel>
                <span>Day {item.day}:</span> {item.title}
              </DayLabel>
              
              <ItemActions onClick={e => e.stopPropagation()}>
                {openItemId === item.id ? (
                  <ActionButton onClick={() => toggleItem(item.id)}>
                    <FiChevronUp />
                  </ActionButton>
                ) : (
                  <ActionButton onClick={() => toggleItem(item.id)}>
                    <FiChevronDown />
                  </ActionButton>
                )}
                <DeleteButton onClick={() => handleDeleteItem(item.id)}>
                  <FiTrash2 />
                </DeleteButton>
              </ItemActions>
            </ItemHeader>
            
            <ItemContent isOpen={openItemId === item.id}>
              <ItemForm>
                <InputGroup>
                  <Label>Day Title</Label>
                  <Input
                    type="text"
                    value={item.title}
                    onChange={e => handleEditItem(item.id, 'title', e.target.value)}
                    placeholder="e.g., Arrival & Welcome"
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={item.location}
                    onChange={e => handleEditItem(item.id, 'location', e.target.value)}
                    placeholder="e.g., Base Camp to Summit Point"
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={item.description}
                    onChange={e => handleEditItem(item.id, 'description', e.target.value)}
                    placeholder="Describe the day's activities, sights, and experiences..."
                  />
                </InputGroup>
                
                <DualInputRow>
                  <InputGroup style={{ flex: 1 }}>
                    <Label>Distance (km)</Label>
                    <Input
                      type="text"
                      value={item.distance}
                      onChange={e => handleEditItem(item.id, 'distance', e.target.value)}
                      placeholder="e.g., 8.5"
                    />
                  </InputGroup>
                  
                  <InputGroup style={{ flex: 1 }}>
                    <Label>Elevation Gain (m)</Label>
                    <Input
                      type="text"
                      value={item.elevation}
                      onChange={e => handleEditItem(item.id, 'elevation', e.target.value)}
                      placeholder="e.g., 650"
                    />
                  </InputGroup>
                </DualInputRow>
                
                <InputGroup>
                  <Label>Accommodation</Label>
                  <Input
                    type="text"
                    value={item.accommodation}
                    onChange={e => handleEditItem(item.id, 'accommodation', e.target.value)}
                    placeholder="e.g., Tent, Mountain Hut, Lodge"
                  />
                </InputGroup>
              </ItemForm>
            </ItemContent>
          </ItineraryItem>
        ))}
      </ItineraryList>
      
      <AddButton onClick={(e) => {
        e.preventDefault(); // Prevent form submission
        handleAddItem(e);
      }}>
        <FiPlus /> Add Day
      </AddButton>
    </Container>
  );
};

export default ItineraryManager;

# Admin to Booking Flow Test Guide

## Test Steps for Trek Admin → Booking Modal Flow

### 1. Test Trek Admin Panel (Setting Available Dates)

**Access the Admin Panel:**
1. Go to `http://localhost:3000/admin`
2. Login with admin credentials

**Test Available Dates Feature:**
1. Click "Add New Trek" or edit existing trek
2. Scroll to "Specific Available Dates" section
3. Select several specific dates (e.g., 5-10 dates over next few months)
4. **CRITICAL**: Only click the "Save" button when you want to save
5. **CRITICAL**: Verify that data is NOT saved when just changing form fields
6. Verify the trek is saved with the `availableDates` field

### 2. Test Booking Modal (Enforcing Available Dates)

**Access Trek Details:**
1. Go to a trek details page that has `availableDates` set
2. Click "Book This Trek" button

**Test Date Restrictions:**
1. Verify only available dates can be selected
2. Try to manually type an unavailable date - should show error
3. Click on the available date chips - should auto-fill the date input
4. Try to submit with invalid date - should block submission
5. Only valid dates should allow proceeding to payment

### 3. Expected Behavior

**Admin Panel:**
- ✅ Form data should NOT auto-save when fields change
- ✅ Data should ONLY save when "Save" button is clicked
- ✅ `availableDates` should be stored as array in Firestore
- ✅ DateAvailabilitySelector should allow picking specific dates

**Booking Modal:**
- ✅ Date input should be restricted to `trek.availableDates`
- ✅ Available dates should show as clickable chips
- ✅ Invalid dates should show clear error messages
- ✅ Form validation should prevent booking invalid dates

### 4. Debugging Tips

**If auto-save is happening:**
- Check browser console for "Save button clicked" vs other logs
- Verify no other components are calling save functions
- Check if any useEffect hooks are triggering saves

**If date restrictions aren't working:**
- Check if `trek.availableDates` is properly set in Firestore
- Verify array format: `["2024-07-15", "2024-07-22", "2024-07-29"]`
- Check browser console for date validation logs
- Ensure BookingModal receives correct trek data

### 5. Common Issues & Fixes

**Auto-save Issue:**
- Usually caused by form submission triggered by input changes
- Fixed by ensuring `handleSave` only runs on explicit events

**Date Validation Issue:**
- Usually caused by date format mismatches
- Ensure dates are in YYYY-MM-DD format
- Check timezone handling

### 6. Test Data Format

**Expected Trek Data Structure:**
```json
{
  "id": "test-trek",
  "title": "Test Trek",
  "availableDates": [
    "2024-07-15",
    "2024-07-22", 
    "2024-07-29",
    "2024-08-05"
  ],
  // ... other trek fields
}
```

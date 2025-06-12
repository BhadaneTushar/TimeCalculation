import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';

const Form = () => {
  const { addTimeEntry } = useTime();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.description) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addTimeEntry(formData);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        description: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting time entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="time-entry-form">
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={errors.date ? 'error' : ''}
        />
        {errors.date && <div className="error-message">{errors.date}</div>}
      </div>

      <div className="form-group">
        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className={errors.startTime ? 'error' : ''}
        />
        {errors.startTime && <div className="error-message">{errors.startTime}</div>}
      </div>

      <div className="form-group">
        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className={errors.endTime ? 'error' : ''}
        />
        {errors.endTime && <div className="error-message">{errors.endTime}</div>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>

      <button type="submit" className="submit-btn">Add Time Entry</button>
    </form>
  );
};

export default Form;

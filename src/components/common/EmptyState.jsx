import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.css';

const EmptyState = ({ icon, title, message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={icon}></i>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button 
          className="empty-state-action"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;

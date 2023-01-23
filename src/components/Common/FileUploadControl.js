import React from 'react'

const acceptedFileTypes = ".pdf,.doc,.dot,.docx,.xls,"
  + ".xlsx,.ppt,.pptx,.txt,.jpeg,"
  + ".jpg,.png,.gif,.tiff,.rar,.zip";

const FileUploadControl = ({ children, value, onChange, disabled }) => {
  return (
    <label htmlFor="contained-button-file" className="btn btn-success btn-sm mb-3 mt-2">
      <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
      Upload Document
      <input
        value={value}
        accept={acceptedFileTypes}
        disabled={disabled}
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onClick={event => event.target.value = null}
        onChange={disabled ? () => { } : onChange}
      />
      {children}
    </label>
  );
};

export default FileUploadControl;
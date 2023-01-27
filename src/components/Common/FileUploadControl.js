import React from 'react'
import '../../styles/app/common/hidden.css'

const acceptedFileTypes = ".pdf,.doc,.dot,.docx,.xls,"
  + ".xlsx,.ppt,.pptx,.txt,.jpeg,"
  + ".jpg,.png,.gif,.tiff,.rar,.zip";

const FileUploadControl = ({ children, value, onChange, disabled }) => {
  return (
    <div>
      <label id="fileUploadButton" htmlFor="contained-button-file" className="btn btn-success btn-sm mb-3 mt-2">
        <em id="fileUploadPlus" className="fa fa-plus-circle fa-sm button-create-icon"></em>
        <span id="fileUploadButtonText">Upload Document</span>
        <input
          value={value}
          accept={acceptedFileTypes}
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onClick={event => event.target.value = null}
          onChange={disabled ? () => { } : onChange}
        />
        {children}
      </label>
      <button id="dummyFileUploadButton" className="hidden btn btn-success btn-sm mb-3 mt-2"
        onMouseDown={e => e.preventDefault()}
        disabled>
        <i id="fileUploadSpinner" class="fa fa-circle-notch fa-sm fa-spin mr-1"></i>
        Uploading
      </button>
    </div>

  );
};

export default FileUploadControl;
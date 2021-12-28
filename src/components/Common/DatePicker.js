import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/app/widgets/datepicker.css";

export default function TableDatePicker() {
    const [date, setDate] = useState(null);
    const today = new Date(),
        threeYearsToday = new Date(today.getFullYear()-3, today.getMonth(), today.getDate()); 

    return (
        <DatePicker 
            selected={date} 
            onChange={date => setDate(date)}
            placeholderText="Enter date of birth"
            filterDate={d => {
                var today = new Date(),
                    threeYearsToday = new Date(today.getFullYear()-3, today.getMonth(), today.getDate());
                return threeYearsToday > d;
            }}
            maxDate={threeYearsToday}
            isClearable
        />
    );
}
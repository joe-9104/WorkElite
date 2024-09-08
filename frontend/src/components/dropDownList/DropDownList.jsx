import React from 'react';
import styles from './DropDownList.module.css';

const DropDownList = ({ options, onChange, placeholder }) => {
    return (
        <div className={styles.container}>
            <select
                className={styles.dropDownList}
                onChange={onChange}
                defaultValue={placeholder ? '' : options[0].value}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropDownList;
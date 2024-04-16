import React from 'react';

import '/src/styles.css';

function DashboardHeader ({ btnText, onClick }) {
    return(
        <div className='dashbord-header-container'>
            {btnText && 
                <button className='dashbord-header-btn' onClick={onClick}>{btnText}</button>
            }

            
        </div>
    )
}

export default DashboardHeader;
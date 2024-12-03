import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <div className='flex flex-col justify-center items-center space-y-4'>
            <div className='
                h-12
                w-12
                border-4
                border-l-gray-300
                border-r-gray-300
                border-b-gray-300
                border-t-[#FF0000]
                animate-spin
                rounded-full
            '/>
            {message && <p className="text-lg text-[#FF0000]">{message}</p>}
        </div>
    );
};

export default Loading;

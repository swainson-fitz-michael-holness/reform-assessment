import React from 'react';

interface IlloSvgProps {
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const IlloSvg: React.FC<IlloSvgProps> = ({
    width = 24,
    height = 24,
    className = '',
}) => (
    <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.25" y="0.25" width="16" height="9" rx="1.5" stroke="#D87906" strokeOpacity="0.5" strokeWidth="0.5" />
        <rect x="1.25" y="1.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="1.25" y="3.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="3.25" y="3.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="6.25" y="7.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="1.25" y="7.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="12.25" y="3.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="8.25" y="7.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="14.25" y="3.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="10.25" y="7.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="14.25" y="7.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="1.25" y="5.25" width="10" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="3.25" y="1.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="12.25" y="5.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="5.25" y="1.25" width="10" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
        <rect x="14.25" y="5.25" width="1" height="1" rx="0.5" fill="#D87906" fillOpacity="0.5" />
    </svg>

);

export default IlloSvg;
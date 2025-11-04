import React from 'react';

export const TeamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="logoGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#f89b29" />
                <stop offset="100%" stopColor="#ff5f6d" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" ry="24" fill="url(#logoGradient)" />
        <path 
            fill="white"
            d="M69.6,23.4c-6-3.1-13.3-4.8-21-4.8c-17.2,0-30.5,10.5-30.5,26.4c0,11,6.3,19.9,15.8,23.8v0c1.9,0.7,3.1,2.5,3.1,4.5 v0c0,2.6-2.2,4.8-4.8,4.8H18.9v10.9h20.1c12.3,0,22.3-10,22.3-22.3c0-9.8-5.3-18.1-13.1-21.5v0c-1.6-0.7-2.7-2.2-2.7-3.9 v0c0-2.6,2.2-4.8,4.8-4.8h19.5v-11h-17c-1.2,0-2.2,1-2.2,2.2s1,2.2,2.2,2.2h14.8v-11Z"
            transform="scale(0.85) translate(10, 8)"
        />
        <g transform="translate(6, 0)">
            <path d="M72,22 l8,0 l-6,12 l-8,0z" fill="#fed7aa" />
            <path d="M78,20 l8,0 l-6,12 l-8,0z" fill="#fed7aa" />
            <path d="M84,18 l8,0 l-6,12 l-8,0z" fill="#fed7aa" />
        </g>
    </svg>
);

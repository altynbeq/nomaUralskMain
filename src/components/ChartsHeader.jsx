import React from 'react';

const ChartsHeader = ({ category, title, mainTitle, categoryTitle, secondTitle }) => (
    <div className=" mb-10">
        <div>
            <p className="text-lg text-gray-400">{mainTitle}</p>
            <p className="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-slate-900">
                {categoryTitle ? categoryTitle : category}
            </p>
        </div>
        <p className="text-center dark:text-gray-200 text-xl mb-2 mt-3">{title}</p>
    </div>
);

export default ChartsHeader;

import React from 'react';

const WorkersShiftsStats = () => {
    const data = [
        {
            title: 'Foundation',
            author: 'Isaac Asimov',
            year: 1951,
            reviews: {
                positive: 2223,
                negative: 259,
            },
        },
        {
            title: 'Frankenstein',
            author: 'Mary Shelley',
            year: 1818,
            reviews: {
                positive: 5677,
                negative: 1265,
            },
        },
        {
            title: 'Solaris',
            author: 'Stanislaw Lem',
            year: 1961,
            reviews: {
                positive: 3487,
                negative: 1845,
            },
        },
        {
            title: 'Dune',
            author: 'Frank Herbert',
            year: 1965,
            reviews: {
                positive: 8576,
                negative: 663,
            },
        },
        {
            title: 'The Left Hand of Darkness',
            author: 'Ursula K. Le Guin',
            year: 1969,
            reviews: {
                positive: 6631,
                negative: 993,
            },
        },
        {
            title: 'A Scanner Darkly',
            author: 'Philip K Dick',
            year: 1977,
            reviews: {
                positive: 8124,
                negative: 1847,
            },
        },
    ];

    const rows = data.map((row) => {
        const totalReviews = row.reviews.negative + row.reviews.positive;
        const positiveReviews = (row.reviews.positive / totalReviews) * 100;
        const negativeReviews = (row.reviews.negative / totalReviews) * 100;

        return (
            <tr key={row.title} className="border-b border-gray-200">
                <td className="py-2 px-3">
                    <button className="text-sm text-blue-600 hover:underline"> {row.title}</button>
                </td>
                <td className="py-2 px-3">{row.year}</td>
                <td className="py-2 px-3">
                    <button className="text-sm text-blue-600 hover:underline">{row.author}</button>
                </td>
                <td className="py-2 px-3">{Intl.NumberFormat().format(totalReviews)}</td>
                <td className="py-2 px-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-teal-600">
                            {positiveReviews.toFixed(0)}%
                        </span>
                        <span className="text-xs font-bold text-red-600">
                            {negativeReviews.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full h-2 mt-1 flex rounded-md overflow-hidden border border-gray-300">
                        <div className="bg-teal-600" style={{ width: `${positiveReviews}%` }}></div>
                        <div
                            className="bg-red-600 border-l-2 border-gray-200"
                            style={{ width: `${negativeReviews}%` }}
                        ></div>
                    </div>
                </td>
            </tr>
        );
    });

    return (
        <div className="bg-white w-[90%]  mx-auto md:w-[90%] mt-10 p-5 subtle-border dark:bg-gray-900 overflow-auto">
            <table className="table-auto w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-3 font-semibold">Book title</th>
                        <th className="py-2 px-3 font-semibold">Year</th>
                        <th className="py-2 px-3 font-semibold">Author</th>
                        <th className="py-2 px-3 font-semibold">Reviews</th>
                        <th className="py-2 px-3 font-semibold">Reviews distribution</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

export default WorkersShiftsStats;

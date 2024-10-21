import { useStateContext } from "../contexts/ContextProvider";


// count total amount of money earned
export const  TotalCounter = (receipts) => {
    const total = Object.values(receipts).reduce((accumulator, store) => {
        return accumulator + store.totalSum;
    }, 0);
    const formattedTotal = new Intl.NumberFormat('ru-RU').format(Math.round(total));

    return formattedTotal;
}

// forms data for where the payment was done based on data
export const PaidToData = (list) => {
    return Object.entries(list).map(([storeName, data]) => {
        const percentage = ((data.totalSum / 10000000) * 100).toFixed(2);
        const kaspiStats = Object.entries(data.paidTo).map(([title, value]) => {
          return {
            title,
            value: ((value / data.totalSum) * 100).toFixed(2), // Calculate percentage based on totalSum
            current: value,
            total: data.totalSum
          };
        });

        return {
          header: storeName, // Store name as the header
          value: `${data.totalSum.toLocaleString()} тг`, // Format the total sum with commas
          percentage,
          kaspiStats,
        };
    });
}

// format ex: 1232323 to 12,334,323
export const FormatAmount = (amount) => {
    return new Intl.NumberFormat().format(amount); 
}

// list of all stores 
export const StoresList = ["Абая", "Аксай", "Жангирхана", "Женис", "Жигули", "Назарбаева"];

// forms pie series for each store share on total sum
export const FinanceShare = (data) => {
    const chartData = Object.entries(data).map(([storeName, storeDetails], index) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d84f5f', '#ffa07a', '#8dd1e1']; // Predefined colors
        return {
            name: storeName,  // Store name
            value: Math.round(storeDetails.totalSum),  // Earned sum for the store
            fill: colors[index % colors.length]  // Cycles through colors array
        };
    });
    return chartData;
}

export const SaleShare = (data) => {
      const chartData = Object.entries(data).map(([storeName, storeDetails], index) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d84f5f', '#ffa07a', '#8dd1e1']; // Predefined colors
        return {
            name: storeName,  // Store name
            value: storeDetails.totalNumberSales,  // Earned sum for the store
            fill: colors[index % colors.length]  // Cycles through colors array
        };
    });
    return chartData;
}


export const GridSpisanieListRows = (data) => {
  
    // Combine all spisanieItems from all stores into one array
    const allSpisanieItems = Object.values(data).flatMap(store => 
      store.spisanieItems.map(item => ({
        ...item,
        id: item.Дата + item.Номер + item.НоменклатураНаименование + item.СкладПредставление,
        Номенклатура: item.НоменклатураНаименование,
        Организация: item.ОрганизацияНаименование, // Shorten ОрганизацияНаименование
        Ответственный: item.ОтветственныйНаименование, // Shorten ОтветственныйНаименование
        Подразделение: item.ПодразделениеНаименование, // Shorten ПодразделениеНаименование
        Склад: item.СкладПредставление,
        СтатьяРасходов: item.СтатьяРасходовНаименование,
        // Remove the original longer fields
        ОрганизацияНаименование: item.ОрганизацияНаименование,
        ОтветственныйНаименование: undefined,
        ПодразделениеНаименование: undefined
      }))
    );
  
    return allSpisanieItems;
};
  
  

export const GridSpisanieListCols = [
  { field: 'id', headerName: 'ID', width: 150 },
  // {
  //   field: 'Дата',
  //   headerName: 'Дата',
  //   width: 110,
  //   editable: false,
  // },
  {
    field: 'Количество',
    headerName: 'Количество',
    width: 100,
    editable: false,
  },
  {
    field: 'Номенклатура',
    headerName: 'Номенклатура',
    width: 250,
    editable: false,
  },
  // {
  //   field: 'Номер',
  //   headerName: 'Номер',
  //   type: 'number',
  //   width: 110,
  //   editable: false,
  // },
  // {
  //   field: 'Организация',
  //   headerName: 'Организация',
  //   width: 110,
  //   editable: false,
  // },
  {
    field: 'Ответственный',
    headerName: 'Ответственный',
    width: 180,
    editable: false,
  },
  {
    field: 'Склад',
    headerName: 'Склад',
    width: 180,
    editable: false,
  },
  {
    field: 'СтатьяРасходов',
    headerName: 'СтатьяРасходов',
    width: 200,
    editable: false,
  },
];


export const GridProductListCols = [
  { field: 'id', headerName: 'ID', width: 150 },
  {
    field: 'name',
    headerName: 'Название',
    width: 350,
    editable: false,
  },
  {
    field: 'amount',
    headerName: 'Количество',
    width: 200,
    editable: false,
  },
  {
    field: 'totalSum',
    headerName: 'Сумма',
    type: 'number',
    width: 200,
    editable: false,
  },
];

export const ProductSoldGridList = (data) => {
  const productTotals = {};

  // Iterate over each store in monthFormedKKM
  Object.values(data).forEach(store => {
    if (store.itemsSold) {
      Object.values(store.itemsSold).forEach(item => {
        const { name, amount, totalSum } = item;

        // If the product already exists, update the amount and totalSum
        if (productTotals[name]) {
          productTotals[name].amount += amount;
          productTotals[name].totalSum += totalSum;
        } else {
          // Otherwise, create a new entry for this product
          productTotals[name] = {
            id: name + amount,
            name: name,
            amount: Math.round(amount),
            totalSum: Math.round(totalSum),
          };
        }
      });
    }
  });

  return Object.values(productTotals);
};


export const SpisanieStats = (data) => {

  // Initialize accumulators for sum, number of spisanie, and item count
  let totalSpisanieSum = 0;
  let totalNumberOfSpisanie = 0;
  let totalItemsWrittenOff = 0;
  const reasonCountMap = {};

  // Iterate over all stores in monthSpisanie
  Object.values(data).forEach(store => {
    totalSpisanieSum += store.spisanieSum || 0;
    totalNumberOfSpisanie += store.numberOfSpisanie || 0;

    // Count items written off and reasons from spisanieItems
    store.spisanieItems.forEach(item => {
      totalItemsWrittenOff += item.Количество || 0;

      // Count reasons for spisanie (assuming СтатьяРасходовНаименование is the reason)
      const reason = item.СтатьяРасходовНаименование || 'Не указана'; // Default to 'Не указана' if no reason
      reasonCountMap[reason] = (reasonCountMap[reason] || 0) + 1;
    });
  });
  // Find the most common reason for spisanie
  const mostCommonReason = Object.entries(reasonCountMap).reduce(
    (prev, curr) => (curr[1] > prev[1] ? curr : prev),
    ['', 0]
  );
  const mostCommonReasonPercentage = ((mostCommonReason[1] / totalNumberOfSpisanie) * 100).toFixed(2);
    return {
      totalSpisanieSum: totalSpisanieSum.toLocaleString(),
      totalNumberOfSpisanie: totalNumberOfSpisanie,
      mostCommonReason: mostCommonReason[0],
      totalItemsWrittenOff: totalItemsWrittenOff,
    }
};


export const FinanceHolePie = (data) => {
    return Object.keys(data).map(store => ({
      name: store,
      value: data[store].totalSum,
    }));
}

export const SalesHolePie = (data) => {
  return Object.keys(data).map(store => ({
    name: store,
    value: data[store].totalNumberSales,
  }));
}

export const FinanceStats = (data) => {
  let totalSum = 0;
  let salesCount = 0;
  let itemsSold = 0;

  // Iterate over each store in the data
  Object.keys(data).forEach(store => {
    const storeData = data[store];
    
    // Accumulate the totalSum and totalNumberSales
    totalSum += Math.round(storeData.totalSum);
    salesCount += storeData.totalNumberSales;

    // Accumulate the number of items sold
    itemsSold += Object.values(storeData.itemsSold).reduce((acc, item) => acc + item.amount, 0);
  });

  // Calculate average check
  const avgCheck = salesCount > 0 ? Math.round(totalSum / salesCount) : 0;

  // Prepare the final stats object
  const stats = {
    totalSum,
    salesCount,
    avgCheck,
    itemsSold,
  };

  return stats;
};


export const FinanceLineChartSeries = (data) => {
    const formattedData = [];
  
    Object.entries(data).forEach(([storeName, storeData]) => {
      storeData.salesSumSeries.forEach((dayData, index) => {
        // If entry for this day index doesn't exist yet, initialize it
        if (!formattedData[index]) {
          formattedData[index] = {
            name: (index + 1).toString(), // Day of the month as the name
          };
        }
  
        // Add store's series for this day under the uv field
        formattedData[index][storeName] = Math.round(dayData.y);
      });
    });
  
    return formattedData;
}

export const ProductsStats = (data) => {
    let productSum = 0;
    let productsUniqSold = 0;
    let itemsSold = 0;
  
    const uniqueProducts = new Set();
  
    Object.values(data).forEach(store => {
      if (store.itemsSold) {
        Object.values(store.itemsSold).forEach(item => {
          const { name, amount, totalSum } = item;
  
          // Accumulate the total sum and amount for all items
          productSum += totalSum;
          itemsSold += amount;
  
          // Track unique products using a Set
          if (!uniqueProducts.has(name)) {
            uniqueProducts.add(name);
            productsUniqSold++;
          }
        });
      }
    });
  
    // Calculate the average revenue per product
    const avgRevProduct = productSum / itemsSold;
  
    return {
      productSum,          // Total money earned from product sales
      productsUniqSold,    // Count of unique products sold
      avgRevProduct,       // Average revenue per product
      itemsSold          // Total number of items sold
    };
}

export const SalesBarSeriesAll = (data) => {
  const list = Array.from({ length: 31 }, (_, i) => ({
    name: (i + 1).toString(), // Days 1 to 31
    Все: 0, // This will hold the sum of sales across all stores for that day
  }));
  
  // Iterate through each store and add their sales to the corresponding day
  Object.values(data).forEach(store => {
    store.salesSeries.forEach(({ x, y }) => {
      const dayIndex = parseInt(x, 10) - 1; // Convert day "x" to zero-based index
      list[dayIndex].Все += y; // Add the store's sales to that day
    });
  });

  // Return the final list after processing all stores
  return list;
};


export const SalesBarSeriesByStore = (data) => {
  // Initialize an empty array to store series for each store
  const list = Array.from({ length: 31 }, (_, i) => ({
    name: (i + 1).toString(), // Days 1 to 31
  }));

  // Iterate over each store and process its salesSeries
  Object.entries(data).forEach(([storeName, storeData]) => {
    storeData.salesSeries.forEach(({ x, y }) => {
      const dayIndex = parseInt(x, 10) - 1; // Convert day "x" to zero-based index
      if (!list[dayIndex][storeName]) {
        list[dayIndex][storeName] = 0; // Initialize store sales for that day if not already set
      }
      list[dayIndex][storeName] += y; // Add the sales count for the store on that day
    });
  });

  return list;
};

export const SpisanieBarSeriesByStore = (data) => {
  // Initialize an empty array to store series for each store
  const list = Array.from({ length: 31 }, (_, i) => ({
    name: (i + 1).toString(), // Days 1 to 31
  }));

  // Iterate over each store and process its salesSeries
  Object.entries(data).forEach(([storeName, storeData]) => {
    storeData.seriesSum.forEach(({ x, y }) => {
      const dayIndex = parseInt(x, 10) - 1; // Convert day "x" to zero-based index
      if (!list[dayIndex][storeName]) {
        list[dayIndex][storeName] = 0; // Initialize store sales for that day if not already set
      }
      list[dayIndex][storeName] += y; // Add the sales count for the store on that day
    });
  });

  return list;
};

export const ConvertCalendarDate = (dates) => {
  const formatDate = (date, time) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}`;
  };

  const formatDateEncoded = (date, time) => {
    const formattedDate = formatDate(date, time);
    return formattedDate.replace(' ', '%20');
  };

  if (!Array.isArray(dates) || dates.length < 2) {
    throw new Error('Invalid date input, must be an array with two Date objects.');
  }

  const bitrixStartDate = formatDate(dates[0], '00:00');
  const bitrixEndDate = formatDate(dates[1], '23:59');
  const startDate = formatDateEncoded(dates[0], '00:00');
  const endDate = formatDateEncoded(dates[1], '23:59');

  return {
    bitrixStartDate,
    bitrixEndDate,
    // dateType: "week", // You can adjust this based on your needs
    startDate,
    endDate
  };
}

export const MonthDropdownToDate = (monthName, year = new Date().getFullYear()) => {
  const months = {
    "Январь": 0,
    "Февраль": 1,
    "Март": 2,
    "Апрель": 3,
    "Май": 4,
    "Июнь": 5,
    "Июль": 6,
    "Август": 7,
    "Сентябрь": 8,
    "Октябрь": 9,
    "Ноябрь": 10,
    "Декабрь": 11
  };

  const monthIndex = months[monthName];

  const startOfMonth = new Date(year, monthIndex, 1);
  const endOfMonth = new Date(year, monthIndex + 1, 0);

  const formatDate = (date, time) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}`;
  };

  const formatDateEncoded = (date, time) => {
    const formattedDate = formatDate(date, time);
    return formattedDate.replace(' ', '%20');
  };

  const bitrixStartDate = formatDate(startOfMonth, '00:00');
  const bitrixEndDate = formatDate(endOfMonth, '23:59');
  const startDate = formatDateEncoded(startOfMonth, '00:00');
  const endDate = formatDateEncoded(endOfMonth, '23:59');

  return {
    bitrixStartDate,
    bitrixEndDate,
    dateType: "month", // Assuming "month" based on input
    startDate,
    endDate
  };
}
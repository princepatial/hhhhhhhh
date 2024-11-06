
const fullValues = data_offersTitle.map((item, index) => {
  

  const offers_data = {
    problemTitle: item,
    representativePhoto: { $oid: "6540fe3aa965037aeb4d55d8" },
    description: data_offers[index],
    availableFrom: { $date: "2023-10-31T13:16:40.975Z" },
    hashtags: [],
    area: data_offerCategoryID[index],
    user: { $oid: "6540f5dda965037aeb4d5378" },
    isActive: true,
    createdAt: { $date: "2023-10-31T13:16:42.728Z" },
    updatedAt: { $date: "2023-10-31T13:16:42.728Z" },
    __v: 0,
  };

  return offers_data;
});

console.log(JSON.stringify(fullValues));

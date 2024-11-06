
const fullValues = data_needTitle.map((item, index) => {
 

  const needs_data = {

    createdAt: { $date: "2023-11-16T14:29:18.713Z" },
    updatedAt: { $date: "2023-11-16T14:29:18.713Z" },
    __v: 0,
  };

  return needs_data;
});

console.log(JSON.stringify(fullValues));

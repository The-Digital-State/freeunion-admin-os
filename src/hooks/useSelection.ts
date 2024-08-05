import { useState } from 'react';

const useSelection = (preSelected: number[]) => {
  const [selected, setSelected] = useState(preSelected);
  const [isAllSelected, setIsAllSelected] = useState(false);

  return {
    selected,
    isAllSelected,
    onSelect: (id: any) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }

      if (newSelected < selected) {
        setIsAllSelected(false);
      }
      setSelected(newSelected);
    },
    onSelectAll: () => {
      if (isAllSelected) {
        setSelected([]);
      }
      setIsAllSelected(!isAllSelected);
    },
    onClear: () => {
      setSelected([]);
      setIsAllSelected(false);
    },
  };
};

export default useSelection;

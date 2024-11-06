import { useState } from 'react';
import { SelectOptions, StateSetterType } from 'globalTypes';
import classNames from 'classnames';
import styles from '../Item.module.scss';
import blackArrow from '@images/black_arrow.svg';
import Image from 'next/image';
import { SingleValue } from 'react-select';
import OptionItem from '../OptionItem';

type Props = {
  options: SelectOptions[];
  stateItem?: SelectOptions | null;
  setStateItem: StateSetterType<SingleValue<SelectOptions> | undefined>;
  text: string;
};

const AllOptions = ({ options, stateItem, setStateItem, text }: Props) => {
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  return (
    <div>
      <div className={styles.item} onClick={() => setIsSortingOpen((prevState) => !prevState)}>
        <span>{text}</span>
        <div className={classNames(styles.image, isSortingOpen && styles.imageRotate)}>
          <Image src={blackArrow} alt="arrow image" />
        </div>
      </div>
      {isSortingOpen && (
        <div>
          {options.map((item, index) => {
            const isActive = stateItem?.value === item.value;
            return (
              <OptionItem
                key={index}
                isActive={isActive}
                text={item.label}
                onClick={() => setStateItem(item)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllOptions;

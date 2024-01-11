/* eslint-disable @typescript-eslint/ban-types */
import { Select, Spin } from 'antd';
import { useState } from 'react';

import { getTopicsAsync } from '../api';

import type { Topic } from '../api/types';

const { Option } = Select;

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (
  value: string,
  setData: Function,
  setLoading: Function
): void => {
  if (timeout != null) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = async (): Promise<void> => {
    setLoading(true);
    const topics = await getTopicsAsync(value);
    setLoading(false);

    if (currentValue === value) {
      setData(topics);
    }
  };

  timeout = setTimeout(() => {
    void fake();
  }, 500);
};

const SearchInput: React.FC<{
  className: string;
  placeholder: string;
  value?: string[];
  setValue: Function;
  resetPage: Function;
}> = ({ className, placeholder, value, setValue, resetPage }) => {
  const [data, setData] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (newValue: string): void => {
    if (newValue.trim() !== '') {
      fetch(newValue, setData, setLoading);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue: string[]): void => {
    setValue(newValue);
    resetPage();
  };

  const renderOptions = (data: Topic[]): JSX.Element[] =>
    data.map(({ name, description }) => (
      <Option key={name} value={name} label={name}>
        <div className="font-medium">{name}</div>
        {description !== null && (
          <div className="font-extralight whitespace-normal">{description}</div>
        )}
      </Option>
    ));

  return (
    <Select
      className={className}
      mode="multiple"
      showSearch
      allowClear={true}
      size="large"
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      optionLabelProp="label"
      popupMatchSelectWidth={300}
    >
      {renderOptions(data)}
    </Select>
  );
};

export default SearchInput;

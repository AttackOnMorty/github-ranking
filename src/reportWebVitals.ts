import { type ReportHandler } from 'web-vitals';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry != null && onPerfEntry instanceof Function) {
    void import('web-vitals').then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      }
    );
  }
};

export default reportWebVitals;

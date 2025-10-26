import { LoadingOutlined } from '@ant-design/icons';
import type { SpinProps } from 'antd';
import { Spin } from 'antd';
import type { CSSProperties } from 'react';

interface LoadingSpinnerProps extends SpinProps {
  fullscreen?: boolean;
  tip?: string;
}

const spinStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  width: '100%',
};

const fullscreenStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullscreen = false,
  tip = 'Loading...',
  size = 'large',
  ...rest
}) => {
  const spinner = (
    <div style={fullscreen ? fullscreenStyle : spinStyle}>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 24 : 32 }}
            spin
          />
        }
        tip={tip}
        size={size}
        {...rest}
      >
        {!fullscreen && <div style={{ height: '200px' }} />}
      </Spin>
    </div>
  );

  return fullscreen ? (
    <div style={{ position: 'relative' }}>
      {spinner}
    </div>
  ) : (
    spinner
  );
};

export default LoadingSpinner;

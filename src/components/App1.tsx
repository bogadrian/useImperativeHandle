import {
  useState,
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle
} from 'react';
import { Icon, ICON_TYPES } from './svg/Icon';

import '../App.css';

type CustomRef = {
  setIsAuthenticated: () => void;
  setIsNotAuthenticated: () => void;
  value: string | undefined;
};

//! Parent component

export const Parent = () => {
  const childRef = useRef<CustomRef>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submited, setSubmited] = useState<string | undefined>('');

  const submit = () => {
    if (isAuthenticated) {
      setSubmited(childRef.current?.value);
    }
    if (!isAuthenticated) {
      setSubmited('');
    }
  };

  useEffect(() => {
    if (childRef.current && !isAuthenticated) {
      (
        childRef.current as Pick<CustomRef, 'setIsNotAuthenticated'>
      ).setIsNotAuthenticated();
    }

    if (childRef.current && isAuthenticated) {
      (
        childRef.current as Pick<CustomRef, 'setIsAuthenticated'>
      ).setIsAuthenticated();
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      <h1>{submited}</h1>
      {isAuthenticated && <h1>{submited}</h1>}
      <div className="buttons">
        <button
          onClick={() => setIsAuthenticated(!isAuthenticated)}
          className="button"
        >
          Login/Logout
        </button>
        <button onClick={submit} className="button">
          Submit
        </button>
      </div>
      <Child ref={childRef} />
    </div>
  );
};

//! Child component

const Child = forwardRef<CustomRef>((props, ref) => {
  const [authenticated, setAuthenticated] = useState(false);

  const refInput = useRef<HTMLInputElement>(null);

  const setIsAuthenticated = () => {
    if (refInput.current) {
      refInput.current.style.borderColor = 'green';
      refInput.current.style.borderWidth = '10px';
      setAuthenticated(true);
    }
  };

  const setIsNotAuthenticated = () => {
    if (refInput.current) {
      refInput.current.style.borderColor = 'red';
      refInput.current.style.borderWidth = '10px';
      setAuthenticated(false);
    }
  };

  useImperativeHandle<Partial<CustomRef>, Partial<CustomRef>>(ref, () => {
    return {
      setIsAuthenticated,
      setIsNotAuthenticated,
      value: refInput.current?.value
    };
  });

  return (
    <div className="Component">
      {authenticated && <h1>{refInput.current?.value}</h1>}
      <div className="icon">
        {!authenticated && (
          <Icon iconType={ICON_TYPES.LIKE} customClassName="dislike" />
        )}
        {authenticated && (
          <Icon iconType={ICON_TYPES.DISLIKE} customClassName="like" />
        )}
      </div>

      <input ref={refInput} className="Input" />

      <div className="buttons">
        <button onClick={setIsAuthenticated} className="button">
          Login
        </button>
        <button onClick={setIsNotAuthenticated} className="button">
          Logout
        </button>
      </div>
    </div>
  );
});

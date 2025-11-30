import React from 'react';
import styled from 'styled-components';

const Load = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }

  /* Bola */
  .loader:before {
    content: "";
    position: absolute;
    bottom: 10px;
    left: 10px;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
    animation: loading-bounce 0.6s ease-in-out infinite alternate;
  }

  /* Step Bars */
  .loader:after {
    content: "";
    position: absolute;
    right: 2px;
    top: 0;
    height: 4px;
    width: 20px;
    border-radius: 3px;
    background: #dbeafe; /* biru soft */
    box-shadow:
      0 5px 0 #dbeafe,
      -15px 25px 0 #bfdbfe,
      -30px 45px 0 #93c5fd;
    animation: loading-step 1s ease-in-out infinite;
  }

  @keyframes loading-bounce {
    0% { transform: scale(1, 0.7); }
    40% { transform: scale(0.85, 1.2); }
    60% { transform: scale(1, 1); }
    100% { bottom: 50px; }
  }

  @keyframes loading-step {
    0% {
      box-shadow:
        0 5px 0 rgba(0, 0, 0, 0),
        0 5px 0 #dbeafe,
        -15px 25px 0 #bfdbfe,
        -30px 45px 0 #93c5fd;
    }
    100% {
      box-shadow:
        0 5px 0 #dbeafe,
        -15px 25px 0 #bfdbfe,
        -30px 45px 0 #93c5fd,
        -30px 45px 0 rgba(0, 0, 0, 0);
    }
  }
`;

export default Load;
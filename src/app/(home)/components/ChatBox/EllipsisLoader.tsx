const EllipsisLoader = () => {
  return (
    <svg width="100" height="30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="15" r="5" fill="#3498db">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="30" cy="15" r="5" fill="#3498db">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </circle>
      <circle cx="50" cy="15" r="5" fill="#3498db">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </circle>
    </svg>
  );
};

export default EllipsisLoader;

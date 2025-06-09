
type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  layout?: 'horizontal' | 'vertical';
  className?: string;
};

export const Logo = ({ size = 'medium', layout = 'vertical', className = '' }: LogoProps) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20',
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl md:text-2xl',
    large: 'text-3xl md:text-4xl',
  };

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
          <svg
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Wreath (golden) */}
            <path
              d="M150 270C216.274 270 270 216.274 270 150C270 83.7258 216.274 30 150 30C83.7258 30 30 83.7258 30 150C30 216.274 83.7258 270 150 270Z"
              stroke="#D4BC7D"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="1 15"
            />

            {/* Laurel Wreath Leaves (golden) */}
            <path
              d="M80 90C70 110 65 140 70 170C80 190 90 210 120 230"
              stroke="#D4BC7D"
              strokeWidth="4"
            />
            <path
              d="M220 90C230 110 235 140 230 170C220 190 210 210 180 230"
              stroke="#D4BC7D"
              strokeWidth="4"
            />

            {/* Stars (1 white in center, 2 gold on sides) */}
            <path
              d="M150 80L158 96H176L162 106L168 124L150 114L132 124L138 106L124 96H142L150 80Z"
              fill="white"
            />
            <path
              d="M120 100L128 116H146L132 126L138 144L120 134L102 144L108 126L94 116H112L120 100Z"
              fill="#D4BC7D"
            />
            <path
              d="M180 100L188 116H206L192 126L198 144L180 134L162 144L168 126L154 116H172L180 100Z"
              fill="#D4BC7D"
            />

            {/* Red star in middle */}
            <path
              d="M150 130L154 138H163L156 144L159 152L150 147L141 152L144 144L137 138H146L150 130Z"
              fill="#D82E2F"
            />

            {/* Graduates with caps (gold) */}
            <path d="M120 160C110 150 105 170 115 180C125 190 130 170 120 160Z" fill="#D4BC7D" />
            <path d="M180 160C190 150 195 170 185 180C175 190 170 170 180 160Z" fill="#D4BC7D" />
            <path d="M120 170C130 190 140 190 150 170" stroke="#D4BC7D" strokeWidth="4" />
            <path d="M180 170C170 190 160 190 150 170" stroke="#D4BC7D" strokeWidth="4" />

            {/* Open book (white) */}
            <path d="M140 195H160C160 195 165 200 150 200C135 200 140 195 140 195Z" fill="white" />
            <path d="M140 195V190H160V195" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className={`font-heading font-bold text-gray-800 dark:text-white ${textSizeClasses[size]}`}>
          EduEasy
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mb-2`}>
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Wreath (golden) */}
          <path
            d="M150 270C216.274 270 270 216.274 270 150C270 83.7258 216.274 30 150 30C83.7258 30 30 83.7258 30 150C30 216.274 83.7258 270 150 270Z"
            stroke="#D4BC7D"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="1 15"
          />

          {/* Laurel Wreath Leaves (golden) */}
          <path
            d="M80 90C70 110 65 140 70 170C80 190 90 210 120 230"
            stroke="#D4BC7D"
            strokeWidth="4"
          />
          <path
            d="M220 90C230 110 235 140 230 170C220 190 210 210 180 230"
            stroke="#D4BC7D"
            strokeWidth="4"
          />

          {/* Stars (1 white in center, 2 gold on sides) */}
          <path
            d="M150 80L158 96H176L162 106L168 124L150 114L132 124L138 106L124 96H142L150 80Z"
            fill="white"
          />
          <path
            d="M120 100L128 116H146L132 126L138 144L120 134L102 144L108 126L94 116H112L120 100Z"
            fill="#D4BC7D"
          />
          <path
            d="M180 100L188 116H206L192 126L198 144L180 134L162 144L168 126L154 116H172L180 100Z"
            fill="#D4BC7D"
          />

          {/* Red star in middle */}
          <path
            d="M150 130L154 138H163L156 144L159 152L150 147L141 152L144 144L137 138H146L150 130Z"
            fill="#D82E2F"
          />

          {/* Graduates with caps (gold) */}
          <path d="M120 160C110 150 105 170 115 180C125 190 130 170 120 160Z" fill="#D4BC7D" />
          <path d="M180 160C190 150 195 170 185 180C175 190 170 170 180 160Z" fill="#D4BC7D" />
          <path d="M120 170C130 190 140 190 150 170" stroke="#D4BC7D" strokeWidth="4" />
          <path d="M180 170C170 190 160 190 150 170" stroke="#D4BC7D" strokeWidth="4" />

          {/* Open book (white) */}
          <path d="M140 195H160C160 195 165 200 150 200C135 200 140 195 140 195Z" fill="white" />
          <path d="M140 195V190H160V195" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      {size !== 'small' && (
        <div className={`font-heading font-bold text-gray-800 dark:text-white text-center ${textSizeClasses[size]}`}>
          EduEasy
        </div>
      )}
    </div>
  );
};

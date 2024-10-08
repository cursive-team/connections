import { ForwardedRef, forwardRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeInput = forwardRef<HTMLInputElement, any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: any, ref: ForwardedRef<HTMLInputElement>) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);

    const handleChange = (index: number, value: string) => {
      if (value.length <= 1) {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
          const nextInput = document.getElementById(`code-${index + 1}`);
          nextInput?.focus();
        }
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        const prevInput = document.getElementById(`code-${index - 1}`);
        prevInput?.focus();
      }
    };

    return (
      <>
        <div className="flex justify-between mb-4">
          {code.map((digit, index) => (
            <input
              ref={ref}
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
        {props?.description && (
          <span className="font-sans text-xs text-tertiary">
            {props?.description}
          </span>
        )}
      </>
    );
  }
);

CodeInput.displayName = "CodeInput";

export { CodeInput };

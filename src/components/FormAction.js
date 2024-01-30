export default function FormAction({
  handleClick,
  type = "Button", //valid values: Button, Submit and Reset
  text,
  disabled = false,
  id,
}) {
  const className =
    "flex justify-center w-full font-medium rounded-lg text-sm px-5 py-2 text-center border border-2 ";
  return (
    <>
      {id === "General" && (
        <button
          type={type}
          value={type}
          className={
            className +
            (disabled
              ? "text-slate-400 bg-white"
              : "text-white bg-gradient-to-t from-blue-500 to-blue-600 hover:bg-gradient-to-b")
          }
          onClick={handleClick}
          disabled={disabled}
          id={id}
        >
          {text}
        </button>
      )}
      {id === "Register" && (
        <button
          type={type}
          value={type}
          className={
            className +
            (disabled
              ? "text-slate-400 bg-white"
              : "text-white bg-gradient-to-t from-green-500 to-green-600 hover:bg-gradient-to-b")
          }
          onClick={handleClick}
          disabled={disabled}
          id={id}
        >
          {text}
        </button>
      )}
      {id === "Logout" && (
        <button
          type={type}
          value={type}
          className={
            className + "border-red-400 text-red-400 bg-white hover:border-red-600 hover:text-white hover:bg-red-600"
          }
          onClick={handleClick}
          disabled={disabled}
          id={id}
        >
          {text}
        </button>
      )}
    </>
  );
}

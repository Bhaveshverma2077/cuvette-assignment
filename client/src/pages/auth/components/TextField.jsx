export default function TextField({
  name,
  image,
  placeholderText,
  disabled = false,
  obscure = false,
  onChange,
}) {
  return (
    <div className="relative w-full">
      {image && (
        <img
          className="absolute left-2 w-4 top-[50%] -translate-y-[50%]"
          src={image}
          alt={`text field icon`}
        />
      )}
      <input
        name={name}
        type={obscure ? "password" : "text"}
        placeholder={placeholderText}
        disabled={disabled}
        className="w-full p-2 pl-9 border border-[#CCCCCC] bg-[#F4F4F4] placeholder:text-sm"
        onChange={onChange}
      ></input>
    </div>
  );
}
